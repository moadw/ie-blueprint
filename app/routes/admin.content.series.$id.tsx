import { NavLink, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function AdminContentSeriesDetail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="space-y-4">
      <NavLink
        to="/admin/content"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Series
      </NavLink>
      <p className="text-sm text-muted-foreground">id: {id}</p>
    </div>
  );
}
