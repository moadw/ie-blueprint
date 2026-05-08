import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
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

const FIELD_INPUT_CLASS =
  "h-10 px-3 rounded-[14px] bg-stone-50 border border-stone-200 text-stone-900 text-sm placeholder:text-stone-400 focus:ring-stone-300";

const SECTION_LABEL_CLASS = "text-xs text-stone-500 font-medium";

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
      <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-lg font-sans rounded-[16px]">
        <DialogHeader className="mb-0">
          <DialogTitle className="font-serif text-xl font-normal text-stone-900">
            Schools — {district.name ?? "Unnamed district"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <section className="space-y-1">
            <p className={SECTION_LABEL_CLASS}>Existing ({schools.length})</p>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2
                  className="h-5 w-5 animate-spin text-stone-400"
                  aria-hidden="true"
                />
              </div>
            ) : loadError ? (
              <div className="rounded-[14px] border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {loadError}
              </div>
            ) : schools.length === 0 ? (
              <p className="text-sm text-stone-400">No schools added yet.</p>
            ) : (
              <div className="border border-stone-200 rounded-[16px] divide-y divide-stone-100 max-h-40 overflow-y-auto">
                {schools.map((school) => {
                  const isEditing = editingId === school._id;
                  const isSaving = savingId === school._id;
                  return (
                    <div
                      key={school._id}
                      className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm"
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
                            className={`${FIELD_INPUT_CLASS} h-8 flex-1`}
                            autoFocus
                            disabled={isSaving}
                          />
                          <Button
                            type="button"
                            onClick={() => void handleSaveEdit(school)}
                            loading={isSaving}
                            disabled={isSaving || editingName.trim() === ""}
                            className="h-8 px-3 rounded-[14px] bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="h-8 px-3 rounded-[14px] text-stone-500 hover:text-stone-700 hover:bg-transparent text-xs font-medium"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-stone-800 truncate">
                            {school.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => startEdit(school)}
                            aria-label={`Edit ${school.name}`}
                            className="shrink-0 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 rounded-md p-1"
                          >
                            <Pencil
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-2 pt-2">
            <p className={SECTION_LABEL_CLASS}>Add School</p>
            <form
              onSubmit={handleCreate}
              className="flex items-center gap-2"
            >
              <Input
                id="add-school-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="School name"
                className={`${FIELD_INPUT_CLASS} flex-1`}
                disabled={creating}
              />
              <Button
                type="submit"
                loading={creating}
                disabled={creating || newName.trim() === ""}
                className="h-10 px-3 rounded-[14px] bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                Add
              </Button>
            </form>
          </section>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-stone-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-[14px] text-stone-500 hover:text-stone-700 hover:bg-transparent text-sm font-medium"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
