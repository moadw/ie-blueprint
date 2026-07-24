import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { safe } from "~/lib/safe-loader";
import { ImpactFindManyDocument } from "~/queries/impact";

/**
 * Costura de datos del Impact Hub de distrito (solo lectura).
 *
 * Lee `ImpactFindMany` REAL (tipo `impact`) y lo mapea al view model `ImpactStory`.
 * Cuando no hay items reales devuelve una lista VACÍA — la vista renderiza su
 * empty state. NO hay historias de muestra ni placeholders; NO se escribe nada al
 * backend.
 *
 * Scoping por distrito (2026-07-23): el backend agregó `organization` + `platform`
 * al tipo `impact`, así que el hub ya se scopea de verdad. Filtra
 * `{ organization, platform, deleted:false }` donde `organization` sale de
 * `resolveDistrictAdmin` (el distrito del usuario logeado, o el distrito
 * previsualizado si un master admin navega como distrito). Si no se puede
 * resolver la org, NO se consulta (evita leer null-org / cross-org) → lista vacía.
 *
 * Convención de datos:
 *  - convención (acordada con backend, 2026-06-17): `user`/`userType`/`school`
 *    guardan TEXTO directo (nombre de autor / rol / nombre de escuela), NO IDs —
 *    el userId no aportaba para este hub. La costura los mapea 1:1 a la card.
 */

export type ImpactStoryType =
  | "testimonial"
  | "journal"
  | "photo"
  | "milestone"
  | "feedback";

export interface ImpactStory {
  id: string;
  type: ImpactStoryType;
  title: string | null;
  body: string | null;
  imageUrl: string | null;
  authorName: string | null;
  authorRole: string | null;
  schoolName: string | null;
  rating: number | null; // feedback: 1-5
}

export interface DistrictImpactData {
  districtName: string | null;
  // Org + platform del distrito activo — se estampan al crear un impact para que
  // el hub lo lea filtrado por distrito. `organization` puede ser null en el
  // borde raro de un distrito sin org (los creates quedan sin scope de org).
  organization: string | null;
  platform: string;
  stories: ImpactStory[];
  // Identidad del admin logeado, para autofill del autor al crear (read-only).
  // `isAdmin` = master admin → el hub NO autocompleta autor/rol (crea a nombre
  // del distrito previsualizado, no del admin).
  currentUser: { name: string | null; role: string | null; isAdmin: boolean };
}

const KNOWN_TYPES: ImpactStoryType[] = [
  "testimonial",
  "journal",
  "photo",
  "milestone",
  "feedback",
];

function normalizeType(t: string | null | undefined): ImpactStoryType {
  const v = (t ?? "") as ImpactStoryType;
  return KNOWN_TYPES.includes(v) ? v : "journal";
}

function parseRating(type: ImpactStoryType, title: string | null): number | null {
  if (type !== "feedback") return null;
  const n = Number(title);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export async function getDistrictImpact(request: Request): Promise<{
  data: DistrictImpactData | null;
  loadError: string | null;
  // Master-admin preview flag — surfaced so the Impact header can hide the
  // "Share a Story" create action (read-only UI gate, not an impact-scoping change).
  preview: boolean;
}> {
  const result = await resolveDistrictAdmin(request);

  if (result.loadError || !result.district) {
    return {
      data: null,
      loadError: result.loadError ?? "Could not resolve district.",
      preview: result.preview,
    };
  }

  const { token, district, currentUser } = result;
  const organization = district.organization;

  // Scoping por distrito: solo consultamos si podemos resolver la org. Una org
  // ausente NO debe caer a un read sin scope (leería otras orgs) — sin org no
  // hay historias reales y el hub cae a samples, igual que cuando está vacío.
  const impactResult = organization
    ? await safe(
        gqlClient.request(
          ImpactFindManyDocument,
          {
            filter: { organization, platform: env.PLATFORM, deleted: false },
            limit: 100,
          },
          { "access-token": token },
        ),
      )
    : null;

  let realStories: ImpactStory[] = [];
  if (impactResult?.ok && impactResult.data.ImpactFindMany) {
    // user/userType/school traen TEXTO directo (nombre/rol/escuela) → mapeo 1:1.
    // Ordenamos por `order` para un layout estable.
    const sorted = [...impactResult.data.ImpactFindMany].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
    realStories = sorted.map((raw) => {
      const type = normalizeType(raw.type);
      return {
        id: raw._id,
        type,
        title: raw.title ?? null,
        body: raw.description ?? null,
        imageUrl: raw.cover?.url ?? null,
        authorName: raw.user ?? null,
        authorRole: raw.userType ?? null,
        schoolName: raw.school ?? null,
        rating: parseRating(type, raw.title ?? null),
      } satisfies ImpactStory;
    });
  }

  return {
    data: {
      districtName: district.name,
      organization,
      platform: env.PLATFORM,
      stories: realStories,
      currentUser,
    },
    loadError: null,
    preview: result.preview,
  };
}
