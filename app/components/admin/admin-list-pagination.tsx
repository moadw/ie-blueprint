import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

/**
 * Single source of truth for the admin list page size + threshold above
 * which `<AdminListPagination />` becomes visible. Steps 3-7 import this
 * for both their loader `limit` and `hasMore` computation.
 */
export const ADMIN_LIST_PAGE_SIZE = 100;

export interface AdminListPaginationProps {
  /** 1-based; parent derives from `skip / limit + 1`. */
  page: number;
  /** Parent computes from last batch length === limit. */
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
  /**
   * When true, disables both buttons and shows a spinner on Next.
   * Wiring contract: consumers pass `useNavigation().state !== "idle"`.
   */
  loading?: boolean;
  className?: string;
}

/**
 * Reusable Prev / Next pagination control for admin list routes.
 *
 * Mount contract: the component renders unconditionally; the *parent*
 * decides whether to mount it. Each consumer (steps 3-7) only mounts
 * `<AdminListPagination />` when `hasMore || page > 1` — see root.md's
 * "threshold model" decision. Pagination chrome is therefore invisible
 * on tenants with fewer than 100 rows.
 */
export function AdminListPagination({
  page,
  hasMore,
  onPrev,
  onNext,
  loading = false,
  className,
}: AdminListPaginationProps) {
  const prevDisabled = loading || page <= 1;
  const nextDisabled = loading || !hasMore;

  return (
    <div
      className={cn("flex justify-between items-center pt-2", className)}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous page"
      >
        Prev
      </Button>
      <span className="text-sm text-muted-foreground">Page {page}</span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={nextDisabled}
        loading={loading}
        aria-label="Next page"
      >
        Next
      </Button>
    </div>
  );
}
