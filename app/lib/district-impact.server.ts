import { gqlClient } from "~/lib/graphql";
import { resolveDistrictAdmin } from "~/lib/district-admin.server";
import { safe } from "~/lib/safe-loader";
import { ImpactFindManyDocument } from "~/queries/impact";
import { UsersFindOneDocument, UserTypesFindManyDocument } from "~/queries/users";
import { SchoolFindManyDocument } from "~/queries/schools";

/**
 * Costura de datos del Impact Hub de distrito (solo lectura).
 *
 * Lee `ImpactFindMany` REAL (tipo `impact`) y lo mapea al view model `ImpactStory`.
 * Verificado en runtime (2026-06-17): la query funciona pero el backend está
 * VACÍO → cuando no hay items reales se cae a `SAMPLE_STORIES` (las 7 historias
 * de muestra del prototipo), igual que el demo (que marca cada card "Sample").
 * Cuando exista data real, la reemplaza. NO se escribe nada al backend.
 *
 * Limitaciones conocidas (follow-ups, ver research 2026-06-17):
 *  - `impact` no tiene `district` → v1 lee con `deleted:false`; scoping estricto
 *    por distrito pendiente de backend.
 *  - con data real, `user`/`school`/`userType` vienen como IDs → se resuelven a
 *    nombre/rol/escuela vía UsersFindOne + UserTypesFindMany + SchoolFindMany.
 *    OJO: el esquema `impact` no tiene nombre de autor propio; el autor sale del
 *    `user` referenciado. Para historias sembradas con user=admin, el autor sale
 *    como el admin (los autores ficticios del demo no son usuarios reales).
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
  isSample: boolean;
}

export interface DistrictImpactData {
  districtName: string | null;
  stories: ImpactStory[];
  source: "real" | "sample";
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

// Historias de muestra portadas de los SEED_ITEMS del prototipo (orden 1..7 para
// espejar el layout del demo). Contenido estático → SSR-safe.
const SAMPLE_STORIES: ImpactStory[] = [
  {
    id: "sample-1",
    type: "testimonial",
    title: null,
    body: "Inner Explorer has completely transformed our morning routine. Students arrive calmer, more focused, and ready to learn. It's the best five minutes of our day.",
    imageUrl: null,
    authorName: "Ms. Rodriguez",
    authorRole: "3rd Grade Teacher",
    schoolName: "Sunset Elementary",
    rating: null,
    isSample: true,
  },
  {
    id: "sample-2",
    type: "milestone",
    title: "12,450 Mindful Minutes",
    body: "Across 14 schools, educators and students have collectively practiced over 12,000 minutes of mindfulness this semester.",
    imageUrl: null,
    authorName: null,
    authorRole: null,
    schoolName: null,
    rating: null,
    isSample: true,
  },
  {
    id: "sample-3",
    type: "journal",
    title: "A Moment of Stillness",
    body: "Today I noticed how quiet my mind became during the breathing exercise. I could hear the birds outside for the first time in weeks. I want to bring this feeling into my afternoon classes.",
    imageUrl: null,
    authorName: "Anonymous Teacher",
    authorRole: "Middle School",
    schoolName: "Riverside Academy",
    rating: null,
    isSample: true,
  },
  {
    id: "sample-4",
    type: "feedback",
    title: "5",
    body: "The breathing exercise really helped my class settle down after recess. Every student was engaged by the end.",
    imageUrl: null,
    authorName: "Ms. Thompson",
    authorRole: null,
    schoolName: "Oak Hill Elementary",
    rating: 5,
    isSample: true,
  },
  {
    id: "sample-5",
    type: "photo",
    title: null,
    body: null,
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    authorName: null,
    authorRole: null,
    schoolName: null,
    rating: null,
    isSample: true,
  },
  {
    id: "sample-6",
    type: "testimonial",
    title: null,
    body: "As a principal, I've seen a measurable decrease in behavioral referrals since we adopted Inner Explorer district-wide. The data speaks for itself.",
    imageUrl: null,
    authorName: "Dr. James Chen",
    authorRole: "Principal",
    schoolName: "Lincoln High School",
    rating: null,
    isSample: true,
  },
  {
    id: "sample-7",
    type: "milestone",
    title: "1,200 Practices Completed",
    body: "Educators across the district have completed over 1,200 guided mindfulness practices since the start of the school year.",
    imageUrl: null,
    authorName: null,
    authorRole: null,
    schoolName: null,
    rating: null,
    isSample: true,
  },
];

export async function getDistrictImpact(request: Request): Promise<{
  data: DistrictImpactData | null;
  loadError: string | null;
}> {
  const result = await resolveDistrictAdmin(request);

  if (result.loadError || !result.district) {
    return {
      data: null,
      loadError: result.loadError ?? "Could not resolve district.",
    };
  }

  const { token, district } = result;

  const impactResult = await safe(
    gqlClient.request(
      ImpactFindManyDocument,
      { filter: { deleted: false }, limit: 100 },
      { "access-token": token },
    ),
  );

  let realStories: ImpactStory[] = [];
  if (impactResult.ok && impactResult.data.ImpactFindMany) {
    const rawList = impactResult.data.ImpactFindMany;

    // `impact` guarda `user`/`school`/`userType` como IDs. Resolvemos solo los
    // IDs distintos realmente referenciados (escala con el contenido, no con el
    // tamaño del distrito). Todo vía safe(): si algo falla, el campo queda null.
    const userIds = [
      ...new Set(rawList.map((r) => r.user).filter((x): x is string => !!x)),
    ];
    const schoolIds = [
      ...new Set(rawList.map((r) => r.school).filter((x): x is string => !!x)),
    ];

    const [typesRes, userEntries, schoolEntries] = await Promise.all([
      safe(
        gqlClient.request(
          UserTypesFindManyDocument,
          { limit: 200 },
          { "access-token": token },
        ),
      ),
      Promise.all(
        userIds.map((id) =>
          safe(
            gqlClient.request(
              UsersFindOneDocument,
              { _id: id },
              { "access-token": token },
            ),
          ).then((r) => [id, r] as const),
        ),
      ),
      Promise.all(
        schoolIds.map((id) =>
          safe(
            gqlClient.request(
              SchoolFindManyDocument,
              { filter: { _id: id }, limit: 1 },
              { "access-token": token },
            ),
          ).then((r) => [id, r] as const),
        ),
      ),
    ]);

    // userType ID → label legible
    const roleLabel = new Map<string, string>();
    if (typesRes.ok) {
      for (const t of typesRes.data.UserTypesFindMany ?? []) {
        if (t?._id && t.label) roleLabel.set(t._id, t.label);
      }
    }

    // user ID → { nombre, typeId }
    const userInfo = new Map<string, { name: string | null; typeId: string | null }>();
    for (const [id, r] of userEntries) {
      if (r.ok && r.data.UsersFindOne) {
        const u = r.data.UsersFindOne;
        const name =
          [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || null;
        userInfo.set(id, { name, typeId: u.type ?? null });
      }
    }

    // school ID → nombre
    const schoolName = new Map<string, string>();
    for (const [id, r] of schoolEntries) {
      if (r.ok) {
        const sc = (r.data.SchoolFindMany ?? [])[0];
        if (sc?.name) schoolName.set(id, sc.name);
      }
    }

    realStories = rawList.map((raw) => {
      const type = normalizeType(raw.type);
      const u = raw.user ? userInfo.get(raw.user) : undefined;
      // Rol: preferimos el `userType` del registro; si no, el tipo del autor.
      const roleId = raw.userType ?? u?.typeId ?? null;
      return {
        id: raw._id,
        type,
        title: raw.title ?? null,
        body: raw.description ?? null,
        imageUrl: raw.cover?.url ?? null,
        authorName: u?.name ?? null,
        authorRole: roleId ? (roleLabel.get(roleId) ?? null) : null,
        schoolName: raw.school ? (schoolName.get(raw.school) ?? null) : null,
        rating: parseRating(type, raw.title ?? null),
        isSample: false,
      } satisfies ImpactStory;
    });
  }

  const useReal = realStories.length > 0;

  return {
    data: {
      districtName: district.name,
      stories: useReal ? realStories : SAMPLE_STORIES,
      source: useReal ? "real" : "sample",
    },
    loadError: null,
  };
}
