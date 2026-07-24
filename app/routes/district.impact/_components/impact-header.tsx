import { useState } from "react";
import { FileDown, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ImpactCreateDialog } from "~/routes/district.impact/_components/impact-create-dialog";

interface ImpactHeaderProps {
  districtName: string | null;
  /** Identidad del admin logeado para autofill del autor (null si no cargó). */
  currentUser?: {
    name: string | null;
    role: string | null;
    isAdmin: boolean;
  } | null;
  /**
   * Org + platform del distrito activo — se estampan al crear un impact para que
   * quede scopeado por distrito. En preview de master admin es la org del distrito
   * previsualizado, de modo que el admin puede crear historias para ese distrito.
   */
  organization?: string | null;
  platform?: string | null;
}

export function ImpactHeader({
  districtName,
  currentUser,
  organization = null,
  platform = null,
}: ImpactHeaderProps) {
  const name = districtName ?? "your district";
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExport = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Impact Hub
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stories, reflections, and moments from across {name}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
        {currentUser ? (
          <Button
            variant="primary"
            onClick={() => setDialogOpen(true)}
            className="h-9 gap-1.5 rounded-lg px-3.5 text-sm"
          >
            <Plus className="h-4 w-4" />
            Share a Story
          </Button>
        ) : null}
        <Button
          variant="outline"
          onClick={handleExport}
          className="h-9 gap-1.5 rounded-lg px-3.5 text-sm"
        >
          <FileDown className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {currentUser ? (
        <ImpactCreateDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          authorName={currentUser.name}
          authorRole={currentUser.role}
          isAdmin={currentUser.isAdmin}
          organization={organization}
          platform={platform}
        />
      ) : null}
    </div>
  );
}

export default ImpactHeader;
