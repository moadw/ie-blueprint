import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Select } from "~/components/ui/select";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { DistrictFindManyDocument } from "~/queries/districts";
import { SchoolFindManyDocument } from "~/queries/schools";
import {
  SchoolUserDeleteOneDocument,
  SetUserSchoolDocument,
} from "~/mutations/users";
import type { AdminUserRow } from "./UserRow";

export interface UserSchoolsDialogProps {
  /**
   * The user whose school memberships are being managed. When `null`, the
   * dialog is closed. The parent should derive this from a refreshed copy of
   * the loader's users list so that mutations triggered from inside the
   * dialog (via `onChanged`) result in an up-to-date chip set on next render.
   */
  target: AdminUserRow | null;
  onOpenChange: (open: boolean) => void;
  /**
   * Called after a successful add or remove. Parent should call
   * `revalidator.revalidate()` so the row's schools cell and the dialog's
   * chip row both pick up the new state.
   */
  onChanged: () => void;
}

interface SchoolOption {
  _id: string;
  name: string;
}

interface PendingRemove {
  school_id: string;
  school_name: string;
}

export function UserSchoolsDialog({
  target,
  onOpenChange,
  onChanged,
}: UserSchoolsDialogProps) {
  const open = target !== null;
  const organizationId = target?.organization_id ?? null;

  const [districtId, setDistrictId] = useState<string | null>(null);
  const [districtName, setDistrictName] = useState<string | null>(null);
  const [districtResolved, setDistrictResolved] = useState<boolean>(false);

  const [allSchools, setAllSchools] = useState<SchoolOption[]>([]);
  const [loadingSchools, setLoadingSchools] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [picked, setPicked] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);

  const [pendingRemove, setPendingRemove] = useState<PendingRemove | null>(
    null,
  );
  const [removing, setRemoving] = useState<boolean>(false);

  // Resolve the user's district from `organization_id` whenever the dialog
  // opens for a new user. We query the targeted district directly instead of
  // taking a `districts` prop from the route loader — this decouples the
  // dialog from sibling step-3 and keeps the network footprint small.
  useEffect(() => {
    if (!open || !organizationId) {
      setDistrictId(null);
      setDistrictName(null);
      setDistrictResolved(open);
      return;
    }
    let cancelled = false;
    setDistrictResolved(false);
    setLoadError(null);
    gqlClient
      .request(DistrictFindManyDocument, {
        filter: { organization: organizationId, platform: env.PLATFORM },
        limit: 1,
        skip: 0,
      })
      .then((data) => {
        if (cancelled) return;
        const list = (data.DistrictFindMany ?? []).filter(
          (d): d is NonNullable<typeof d> => d != null,
        );
        const district = list[0] ?? null;
        if (district) {
          setDistrictId(district._id);
          setDistrictName(district.name ?? null);
        } else {
          setDistrictId(null);
          setDistrictName(null);
        }
        setDistrictResolved(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          err instanceof Error
            ? err.message
            : "Failed to load the user's district.",
        );
        setDistrictResolved(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, organizationId]);

  // Fetch the district's full school catalog once the district has resolved.
  useEffect(() => {
    if (!open || !districtId) {
      setAllSchools([]);
      return;
    }
    let cancelled = false;
    setLoadingSchools(true);
    setLoadError(null);
    gqlClient
      .request(SchoolFindManyDocument, {
        filter: { district: districtId, platform: env.PLATFORM },
        limit: 500,
        skip: 0,
      })
      .then((data) => {
        if (cancelled) return;
        const list: SchoolOption[] = (data.SchoolFindMany ?? [])
          .filter((s): s is NonNullable<typeof s> => s != null)
          .map((s) => ({ _id: s._id, name: s.name ?? "" }))
          .filter((s) => s.name.length > 0);
        setAllSchools(list);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Failed to load schools.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingSchools(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, districtId]);

  // Reset transient state whenever the dialog closes so reopening starts
  // fresh.
  useEffect(() => {
    if (open) return;
    setPicked("");
    setPendingRemove(null);
    setAdding(false);
    setRemoving(false);
    setAllSchools([]);
    setDistrictId(null);
    setDistrictName(null);
    setDistrictResolved(false);
    setLoadError(null);
    setLoadingSchools(false);
  }, [open]);

  const currentSchools = (target?.schools ?? []).filter(
    (s): s is NonNullable<typeof s> => s != null,
  );
  const currentSchoolIds = new Set(
    currentSchools
      .map((s) => s.school_id)
      .filter((id): id is string => typeof id === "string"),
  );
  const available = allSchools.filter((s) => !currentSchoolIds.has(s._id));

  async function handleAdd() {
    if (!target?.userId || !picked) return;
    setAdding(true);
    try {
      await gqlClient.request(SetUserSchoolDocument, {
        user: target.userId,
        school: picked,
      });
      toast.success("School added");
      setPicked("");
      onChanged();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add school",
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove() {
    if (!target?.userId || !pendingRemove) return;
    setRemoving(true);
    try {
      await gqlClient.request(SchoolUserDeleteOneDocument, {
        user: target.userId,
        school: pendingRemove.school_id,
      });
      toast.success("School removed");
      setPendingRemove(null);
      onChanged();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove school",
      );
    } finally {
      setRemoving(false);
    }
  }

  const fullName = target
    ? `${target.firstName ?? ""} ${target.lastName ?? ""}`.trim()
    : "";

  const hasOrganization = Boolean(organizationId);
  const districtMissing = districtResolved && hasOrganization && !districtId;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Schools</DialogTitle>
            <DialogDescription>
              {fullName ? `Schools for ${fullName}` : "Manage school access"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* District resolution */}
            {!hasOrganization ? (
              <p className="text-sm text-muted-foreground">
                User has no district — schools can&apos;t be managed.
              </p>
            ) : !districtResolved ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                Loading district…
              </div>
            ) : districtMissing ? (
              <p className="text-sm text-muted-foreground">
                User has no district — schools can&apos;t be managed.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                District:{" "}
                <span className="font-medium text-foreground">
                  {districtName ?? "Unnamed district"}
                </span>
              </p>
            )}

            {/* Current schools as removable chips */}
            {hasOrganization && districtId ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Current schools ({currentSchools.length})
                </p>
                {currentSchools.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No schools assigned yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentSchools.map((s) => {
                      const schoolId = s.school_id ?? "";
                      const schoolName = s.school_name ?? "Unnamed school";
                      return (
                        <button
                          key={schoolId || schoolName}
                          type="button"
                          onClick={() =>
                            setPendingRemove({
                              school_id: schoolId,
                              school_name: schoolName,
                            })
                          }
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          aria-label={`Remove ${schoolName}`}
                        >
                          <span>{schoolName}</span>
                          <X className="h-3 w-3" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}

            {/* Add school picker */}
            {hasOrganization && districtId ? (
              <div className="space-y-1">
                <label
                  htmlFor="add-school-select"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Add school
                </label>
                <div className="flex items-end gap-2">
                  <Select
                    id="add-school-select"
                    value={picked}
                    onChange={(e) => setPicked(e.target.value)}
                    disabled={loadingSchools || available.length === 0}
                    className="flex-1"
                  >
                    <option value="">
                      {loadingSchools
                        ? "Loading schools…"
                        : available.length === 0
                          ? "No more schools available"
                          : "Select school…"}
                    </option>
                    {available.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!picked || adding}
                    loading={adding}
                    onClick={() => void handleAdd()}
                    className="h-10 px-4 text-sm shrink-0"
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : null}

            {loadError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {loadError}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 text-sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={pendingRemove !== null}
        onOpenChange={(o) => {
          if (!o) setPendingRemove(null);
        }}
        title={
          <>
            Remove{" "}
            <span className="font-medium">
              {pendingRemove?.school_name ?? "school"}
            </span>
            ?
          </>
        }
        description="The user will lose access to its content."
        variant="destructive"
        confirmLabel="Remove"
        cancelLabel="Cancel"
        loading={removing}
        onConfirm={() => void handleRemove()}
      />
    </>
  );
}
