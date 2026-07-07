import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useRevalidator } from "react-router";
import { Award, Pencil, Plus, Video } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  AchievementDialog,
  type PinItem,
} from "~/components/admin/achievement-dialog";
import { requireSessionToken } from "~/lib/session.server";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { safe } from "~/lib/safe-loader";
import { PinFindManyDocument } from "~/queries/pins";
import { ClassesAdminFindManyDocument } from "~/queries/classes";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await requireSessionToken(request);
  if (!env.PLATFORM) {
    return {
      pins: [],
      classNames: {} as Record<string, string>,
      error: "Platform is not configured. Please contact your administrator.",
    };
  }
  const result = await safe(
    gqlClient.request(
      PinFindManyDocument,
      { filter: { platform: env.PLATFORM }, limit: 100 },
      { "access-token": token },
    ),
  );
  // Soft delete = non-null deletedAt — drop those rows.
  const pins = result.ok
    ? (result.data.PinFindMany ?? []).filter((p) => !p.deletedAt)
    : [];

  // Resolve the practice (class) each pin is attached to, so the card can show
  // its title. Batch every referenced class id into one query via the `_id in`
  // operator (no platform filter — a pin's class may live under a different
  // platform id than env.PLATFORM). A failed lookup just leaves names unknown;
  // it doesn't take down the list.
  const classIds = [
    ...new Set(pins.map((p) => p.class).filter((id): id is string => !!id)),
  ];
  let classNames: Record<string, string> = {};
  if (classIds.length > 0) {
    const classesResult = await safe(
      gqlClient.request(
        ClassesAdminFindManyDocument,
        { filter: { _operators: { _id: { in: classIds } } }, limit: classIds.length },
        { "access-token": token },
      ),
    );
    if (classesResult.ok) {
      classNames = Object.fromEntries(
        (classesResult.data.ClassesAdminFindMany ?? []).map((c) => [
          c._id,
          c.title ?? "Untitled practice",
        ]),
      );
    }
  }

  return { pins, classNames, error: result.error };
}

export default function AdminContentAchievements() {
  const { pins, classNames, error } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPin, setEditPin] = useState<PinItem | null>(null);

  const openCreate = () => {
    setEditPin(null);
    setDialogOpen(true);
  };
  const openEdit = (pin: PinItem) => {
    setEditPin(pin);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-foreground">
            Achievements Library
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Global achievement templates that can be copied to any series
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Achievement
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 py-10 text-center">
          <p className="mb-1 text-sm font-medium text-red-700">
            Couldn't load achievements
          </p>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      ) : pins.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-16 text-center">
          <Award className="mx-auto mb-3 h-12 w-12 text-stone-300" />
          <p className="mb-4 text-stone-600">No achievements yet</p>
          <div className="flex justify-center">
            <Button variant="primary" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pins.map((p) => (
            <div
              key={p._id}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm"
            >
              {p.cover?.url ? (
                <img
                  src={p.cover.url}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                  <Award className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">
                    {p.label || "Untitled"}
                  </p>
                  {p.video?.url ? (
                    <Video className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  ) : null}
                </div>
                {p.class && classNames[p.class] ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {classNames[p.class]}
                  </p>
                ) : (
                  <p className="truncate text-xs italic text-muted-foreground/70">
                    Not attached to a practice
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(p)}
                aria-label={`Edit ${p.label || "achievement"}`}
                className="h-8 w-8 flex-shrink-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <AchievementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        curriculumId={null}
        pin={editPin}
        onSaved={() => revalidator.revalidate()}
      />
    </div>
  );
}
