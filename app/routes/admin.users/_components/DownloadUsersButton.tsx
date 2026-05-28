import { useState } from "react";
import { useSearchParams } from "react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { exportUsersCsv, type UsersCsvQuery } from "~/lib/users-csv";

export interface DownloadUsersButtonDistrict {
  _id: string;
  name?: string | null;
  organization?: string | null;
}

interface DownloadUsersButtonProps {
  total: number;
  /**
   * Optional district list used to resolve the URL's `district` filter into
   * the REST `organizationId` query parameter. When the list is empty (e.g.
   * before step-3's filter loader changes have landed), the `district` URL
   * param is forwarded as-is on `districtId`.
   */
  districts?: ReadonlyArray<DownloadUsersButtonDistrict>;
}

export function DownloadUsersButton({
  total,
  districts = [],
}: DownloadUsersButtonProps) {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  async function handleClick() {
    const districtFilter = params.get("district") ?? undefined;
    const schoolFilter = params.get("school") ?? undefined;
    const roleFilter = params.get("role") ?? undefined;
    const queryFilter = params.get("query") ?? undefined;

    // MTW maps `district` → `organizationId` via a district lookup. If we
    // don't have the district list (step-3 not landed), fall back to passing
    // the same value through `districtId` so filters still narrow correctly.
    const resolvedOrg = districtFilter
      ? (districts.find((d) => d._id === districtFilter)?.organization ??
        undefined)
      : undefined;

    const restQuery: UsersCsvQuery = {
      ...(resolvedOrg
        ? { organizationId: resolvedOrg }
        : districtFilter
          ? { districtId: districtFilter }
          : {}),
      ...(schoolFilter ? { schoolId: schoolFilter } : {}),
      ...(roleFilter ? { type: roleFilter } : {}),
      ...(queryFilter ? { search: queryFilter } : {}),
    };

    setLoading(true);
    setProgress(null);
    try {
      const blob = await exportUsersCsv(
        restQuery,
        total,
        (page, pages) => setProgress(`${page}/${pages}`),
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users-export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Download ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      loading={loading}
      className="h-10 px-4 text-sm gap-1.5"
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      {loading
        ? `Downloading${progress ? ` ${progress}` : ""}`
        : `Download Users (${total.toLocaleString()})`}
    </Button>
  );
}
