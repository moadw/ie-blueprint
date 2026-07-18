import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Image as ImageIcon, Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { env } from "~/lib/env";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { cn } from "~/lib/utils";
import { CurriculumCollectionFindManyDocument } from "~/queries/curriculum-collections";
import { CurriculumsFindManyDocument } from "~/queries/curriculums";

/** A collection ("Experience") the user can select. */
interface CollectionLite {
  _id: string;
  name: string;
}

/** A curriculum ("series") and the collection ids it belongs to. */
export interface CurriculumLite {
  _id: string;
  title: string;
  collectionIds: string[];
  coverUrl: string | null;
}

export interface ExperiencesSelectorProps {
  /**
   * Controlled selection. `courses` is the explicit set of selected series
   * (curriculum) ids — the source of truth; `coursesCollection` is the set of
   * experiences that have at least one selected series.
   */
  value: { coursesCollection: string[]; courses: string[] };
  /**
   * Emits the current selection. `courses` is the explicit set of selected
   * series ids; `coursesCollection` is derived — the experiences with at least
   * one selected series (kept in sync so callers can persist it and downstream
   * can still group content by experience).
   */
  onChange: (next: { coursesCollection: string[]; courses: string[] }) => void;
  /** Disable interaction (e.g. while a parent save is in flight). */
  disabled?: boolean;
  className?: string;
}

/**
 * Pure, module-scope derivation of the `courses` field from a set of selected
 * collection ids: the deduped union of curriculum `_id`s whose
 * `collectionIds` intersect the selected set.
 *
 * Exported for reuse/testing — callers never reimplement union semantics.
 */
export function deriveCourses(
  selectedCollectionIds: string[],
  curricula: CurriculumLite[],
): string[] {
  const selected = new Set(selectedCollectionIds);
  const courses = new Set<string>();
  for (const curriculum of curricula) {
    if (curriculum.collectionIds.some((id) => selected.has(id))) {
      courses.add(curriculum._id);
    }
  }
  return Array.from(courses);
}

export function ExperiencesSelector({
  value,
  onChange,
  disabled = false,
  className,
}: ExperiencesSelectorProps) {
  const [collections, setCollections] = useState<CollectionLite[]>([]);
  const [curricula, setCurricula] = useState<CurriculumLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Self-contained data: fetch collections + curricula once on mount.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    Promise.all([
      gqlClient.request(CurriculumCollectionFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 500,
      }),
      gqlClient.request(CurriculumsFindManyDocument, {
        filter: { platform: env.PLATFORM },
        limit: 500,
      }),
    ])
      .then(([collectionsData, curriculaData]) => {
        if (cancelled) return;
        const nextCollections = (
          collectionsData.curriculumCollectionFindMany ?? []
        )
          .filter((c): c is NonNullable<typeof c> => c != null)
          .map<CollectionLite>((c) => ({
            _id: c._id,
            name: c.name ?? "Untitled",
          }))
          .sort((a, b) =>
            a.name
              .toLocaleLowerCase()
              .localeCompare(b.name.toLocaleLowerCase()),
          );
        const nextCurricula = (curriculaData.CurriculumsFindMany ?? [])
          .filter((c): c is NonNullable<typeof c> => c != null)
          .map<CurriculumLite>((c) => ({
            _id: c._id,
            title: c.title ?? "Untitled",
            collectionIds: (c.curriculumCollection ?? [])
              .filter((cc): cc is NonNullable<typeof cc> => cc != null)
              .map((cc) => cc._id),
            coverUrl: c.cover?.url ?? null,
          }));
        setCollections(nextCollections);
        setCurricula(nextCurricula);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          toErrorMessage(err, "Failed to load Experiences."),
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Group curricula by collection membership: collectionId -> curricula.
  const byCollection = useMemo(() => {
    const map = new Map<string, CurriculumLite[]>();
    for (const curriculum of curricula) {
      for (const collectionId of curriculum.collectionIds) {
        const bucket = map.get(collectionId);
        if (bucket) bucket.push(curriculum);
        else map.set(collectionId, [curriculum]);
      }
    }
    return map;
  }, [curricula]);

  const selectedCourses = useMemo(
    () => new Set(value.courses),
    [value.courses],
  );

  // Emit a selection from an updated set of selected series ids. The experience
  // list is derived: an experience is "on" when at least one of its series is
  // selected, so a partial (granular) selection still keeps the experience
  // visible to callers and to downstream per-experience grouping.
  function emitCourses(nextCourses: Set<string>) {
    const courses = Array.from(nextCourses);
    const coursesCollection = collections
      .filter((collection) =>
        (byCollection.get(collection._id) ?? []).some((c) =>
          nextCourses.has(c._id),
        ),
      )
      .map((collection) => collection._id);
    onChange({ coursesCollection, courses });
  }

  // Experience checkbox is a bulk toggle over its series: when every series is
  // already selected, clear them all; otherwise (none or some) select them all.
  function toggleCollection(collectionId: string) {
    const childIds = (byCollection.get(collectionId) ?? []).map((c) => c._id);
    if (childIds.length === 0) return;
    const nextCourses = new Set(selectedCourses);
    const allSelected = childIds.every((id) => nextCourses.has(id));
    for (const id of childIds) {
      if (allSelected) nextCourses.delete(id);
      else nextCourses.add(id);
    }
    emitCourses(nextCourses);
  }

  // Series checkbox toggles a single series in/out of the granted set.
  function toggleCourse(courseId: string) {
    const nextCourses = new Set(selectedCourses);
    if (nextCourses.has(courseId)) nextCourses.delete(courseId);
    else nextCourses.add(courseId);
    emitCourses(nextCourses);
  }

  function toggleExpanded(collectionId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(collectionId)) next.delete(collectionId);
      else next.add(collectionId);
      return next;
    });
  }

  if (loading) {
    return (
      <div
        className={cn(
          "flex justify-center rounded-[14px] border border-border bg-card py-8",
          className,
        )}
      >
        <Loader2
          className="h-5 w-5 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={cn(
          "rounded-[14px] border border-dashed border-red-300 bg-red-50 p-3 text-sm text-red-600",
          className,
        )}
      >
        Couldn't load Experiences
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div
        className={cn(
          "rounded-[14px] border border-border bg-card p-3 text-sm text-muted-foreground",
          className,
        )}
      >
        No Experiences available
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {collections.map((collection) => {
        const isExpanded = expanded.has(collection._id);
        const children = byCollection.get(collection._id) ?? [];
        const selectedChildCount = children.filter((c) =>
          selectedCourses.has(c._id),
        ).length;
        const allSelected =
          children.length > 0 && selectedChildCount === children.length;
        const someSelected = selectedChildCount > 0 && !allSelected;
        return (
          <div
            key={collection._id}
            className={cn(
              "rounded-[14px] border bg-card shadow-xs transition-colors",
              selectedChildCount > 0 ? "border-foreground/40" : "border-border",
            )}
          >
            <div className="flex items-center gap-3 p-3">
              <label className="flex flex-1 cursor-pointer items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    // Indeterminate isn't a React prop — reflect the partial
                    // state onto the DOM node directly.
                    if (el) el.indeterminate = someSelected;
                  }}
                  disabled={disabled || children.length === 0}
                  onChange={() => toggleCollection(collection._id)}
                  className="h-4 w-4 rounded border-border accent-foreground cursor-pointer disabled:cursor-not-allowed"
                  aria-label={`Select all series in ${collection.name}`}
                />
                <span className="flex-1 truncate text-sm font-medium text-foreground">
                  {collection.name}
                </span>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {someSelected
                    ? `${selectedChildCount}/${children.length} series`
                    : `${children.length} series`}
                </span>
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleExpanded(collection._id)}
                aria-label={isExpanded ? "Collapse" : "Expand"}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isExpanded ? (
              <div className="space-y-2 border-t border-border px-3 py-2">
                {children.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No series</p>
                ) : (
                  children.map((curriculum) => (
                    <label
                      key={curriculum._id}
                      className="flex cursor-pointer items-center gap-2.5"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourses.has(curriculum._id)}
                        disabled={disabled}
                        onChange={() => toggleCourse(curriculum._id)}
                        className="h-4 w-4 flex-shrink-0 rounded border-border accent-foreground cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`Select ${curriculum.title}`}
                      />
                      {curriculum.coverUrl ? (
                        <img
                          src={curriculum.coverUrl}
                          alt=""
                          className="h-9 w-9 flex-shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                          <ImageIcon className="h-4 w-4" aria-hidden="true" />
                        </div>
                      )}
                      <span className="truncate text-sm text-muted-foreground">
                        {curriculum.title}
                      </span>
                    </label>
                  ))
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default ExperiencesSelector;
