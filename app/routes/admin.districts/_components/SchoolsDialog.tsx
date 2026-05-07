import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import {
  SchoolCreateOneDocument,
  SchoolFindManyDocument,
  SchoolUpdateOneDocument,
} from "~/queries/schools";

export interface SchoolsDialogDistrict {
  _id: string;
  name?: string | null;
  state?: string | null;
}

export interface SchoolsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district: SchoolsDialogDistrict;
}

interface School {
  _id: string;
  name: string;
}

export function SchoolsDialog({
  open,
  onOpenChange,
  district,
}: SchoolsDialogProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setEditingId(null);
    setEditingName("");
    setNewName("");
    gqlClient
      .request(SchoolFindManyDocument, {
        filter: { district: district._id },
        limit: 500,
        skip: 0,
      })
      .then((data) => {
        if (cancelled) return;
        const list: School[] = (data.SchoolFindMany ?? [])
          .filter((s): s is NonNullable<typeof s> => s != null)
          .map((s) => ({ _id: s._id, name: s.name ?? "" }));
        setSchools(list);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Failed to load schools.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, district._id]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const record: {
        name: string;
        district: string;
        country: string;
        platform: string;
        state?: string;
      } = {
        name,
        district: district._id,
        country: "United States",
        platform: env.PLATFORM,
      };
      if (district.state) record.state = district.state;
      const data = await gqlClient.request(SchoolCreateOneDocument, {
        record,
      });
      const payload = data.SchoolCreateOne;
      // graphql-codegen types `error` as `never` because no concrete
      // ErrorInterface implementer is selected. Read via runtime cast.
      const createErrMsg = (payload?.error as
        | { message?: string | null }
        | null
        | undefined)?.message;
      if (createErrMsg) {
        toast.error(createErrMsg);
        return;
      }
      const created = payload?.record;
      if (!created) {
        toast.error("Failed to create school");
        return;
      }
      setSchools((prev) => [
        ...prev,
        { _id: created._id, name: created.name ?? name },
      ]);
      setNewName("");
      toast.success(`School "${name}" added`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create school",
      );
    } finally {
      setCreating(false);
    }
  }

  function startEdit(school: School) {
    setEditingId(school._id);
    setEditingName(school.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  async function handleSaveEdit(school: School) {
    const name = editingName.trim();
    if (!name) return;
    if (name === school.name) {
      cancelEdit();
      return;
    }
    setSavingId(school._id);
    try {
      const data = await gqlClient.request(SchoolUpdateOneDocument, {
        _id: school._id,
        record: { name },
      });
      const payload = data.SchoolUpdateOne;
      const updateErrMsg = (payload?.error as
        | { message?: string | null }
        | null
        | undefined)?.message;
      if (updateErrMsg) {
        toast.error(updateErrMsg);
        return;
      }
      setSchools((prev) =>
        prev.map((s) => (s._id === school._id ? { ...s, name } : s)),
      );
      cancelEdit();
      toast.success(`School renamed to "${name}"`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update school",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Schools — {district.name ?? "Unnamed district"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <section className="space-y-2">
            <Label>Existing ({schools.length})</Label>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2
                  className="h-5 w-5 animate-spin text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            ) : loadError ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {loadError}
              </div>
            ) : schools.length === 0 ? (
              <div className="rounded-lg border border-border p-4 text-center text-sm text-muted-foreground">
                No schools added yet.
              </div>
            ) : (
              <div className="rounded-lg border border-border divide-y divide-border max-h-40 overflow-y-auto">
                {schools.map((school) => {
                  const isEditing = editingId === school._id;
                  const isSaving = savingId === school._id;
                  return (
                    <div
                      key={school._id}
                      className="flex items-center gap-2 px-3 py-2"
                    >
                      {isEditing ? (
                        <>
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                void handleSaveEdit(school);
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                cancelEdit();
                              }
                            }}
                            aria-label={`Edit school name for ${school.name}`}
                            className="h-8 px-2 text-sm flex-1"
                            autoFocus
                            disabled={isSaving}
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => void handleSaveEdit(school)}
                            loading={isSaving}
                            disabled={isSaving || editingName.trim() === ""}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 truncate text-sm text-foreground">
                            {school.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => startEdit(school)}
                            aria-label={`Edit ${school.name}`}
                            className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <Label htmlFor="add-school-name">Add School</Label>
            <form
              onSubmit={handleCreate}
              className="flex items-center gap-2"
            >
              <Input
                id="add-school-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="School name"
                className="flex-1"
                disabled={creating}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={creating}
                disabled={creating || newName.trim() === ""}
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
                Add
              </Button>
            </form>
          </section>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
