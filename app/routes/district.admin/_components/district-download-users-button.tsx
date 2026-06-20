import { useState } from "react";
import { useSearchParams } from "react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { exportUsersCsv, type UsersCsvQuery } from "~/lib/users-csv";

interface DistrictDownloadUsersButtonProps {
  total: number;
  organizationId: string;
}

export function DistrictDownloadUsersButton({
  total,
  organizationId,
}: DistrictDownloadUsersButtonProps) {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  async function handleClick() {
    const schoolFilter = params.get("school") ?? undefined;
    const roleFilter = params.get("role") ?? undefined;
    const queryFilter = params.get("query") ?? undefined;

    const restQuery: UsersCsvQuery = {
      organizationId,
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
