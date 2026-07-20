import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useFetcher } from "react-router";
import { User } from "lucide-react";
import type { DistrictAdminLookupData } from "~/routes/admin.district-admin.$organizationId";

export interface DistrictAdminLineProps {
  organizationId?: string | null | undefined;
}

/**
 * The district card's admin line. Lazily loads the org's `district-admin`
 * users via a fetcher the first time the row nears the viewport, so the list
 * renders immediately and only visible rows trigger a lookup. Shows a skeleton
 * until its own fetch resolves, then the admin name (with `+N` when the org has
 * more than one) or "No admin assigned".
 */
export function DistrictAdminLine({ organizationId }: DistrictAdminLineProps) {
  const fetcher = useFetcher<DistrictAdminLookupData>();
  const ref = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef(false);
  const load = fetcher.load;

  useEffect(() => {
    if (!organizationId) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !loadedRef.current) {
          loadedRef.current = true;
          load(`/admin/district-admin/${encodeURIComponent(organizationId)}`);
          observer.disconnect();
        }
      },
      // Prefetch just before the row scrolls into view for a smoother fill.
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [organizationId, load]);

  let content: ReactNode;
  if (!organizationId) {
    content = "No admin assigned";
  } else if (!fetcher.data) {
    content = (
      <span className="inline-block h-3 w-24 rounded bg-muted animate-pulse align-middle" />
    );
  } else if (fetcher.data.admins.length > 0) {
    const [first, ...rest] = fetcher.data.admins;
    content = (
      <>
        {first?.name}
        {rest.length > 0 ? (
          <span className="text-muted-foreground/70"> +{rest.length}</span>
        ) : null}
      </>
    );
  } else {
    content = "No admin assigned";
  }

  return (
    <div
      ref={ref}
      className="flex items-center gap-1 text-sm text-muted-foreground"
    >
      <User className="w-3 h-3" aria-hidden="true" />
      <span className="truncate">{content}</span>
    </div>
  );
}
