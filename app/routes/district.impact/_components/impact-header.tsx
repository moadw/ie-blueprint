import { FileDown } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ImpactHeaderProps {
  districtName: string | null;
}

export function ImpactHeader({ districtName }: ImpactHeaderProps) {
  const name = districtName ?? "your district";

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
      <Button
        variant="outline"
        onClick={handleExport}
        className="h-9 gap-1.5 rounded-lg px-3.5 text-sm self-start sm:self-auto print:hidden"
      >
        <FileDown className="h-4 w-4" />
        Export Report
      </Button>
    </div>
  );
}

export default ImpactHeader;
