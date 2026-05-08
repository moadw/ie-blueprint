import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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
import { Select } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import {
  DistrictCreateOneDocument,
  DistrictUpdateOneDocument,
} from "~/queries/districts";

export type District = {
  _id: string;
  name?: string | null;
  state?: string | null;
  country?: string | null;
  platform?: string | null;
  organization?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CreateProps = {
  mode: "create";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (district: District) => void;
};

type EditProps = {
  mode: "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district: District;
  onUpdated: (district: District) => void;
};

export type DistrictDialogProps = CreateProps | EditProps;

const US_TIMEZONES: ReadonlyArray<{ value: string; label: string }> = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Anchorage", label: "Alaska (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii (HT)" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type FormState = {
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  timezone: string;
  active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  city: "",
  state: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  timezone: "America/New_York",
  active: true,
};

export function DistrictDialog(props: DistrictDialogProps) {
  const { mode, open, onOpenChange } = props;
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const districtId = mode === "edit" ? props.district._id : null;
  const districtName = mode === "edit" ? props.district.name ?? "" : "";
  const districtState = mode === "edit" ? props.district.state ?? "" : "";

  // Reset form whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      setForm(EMPTY_FORM);
    } else {
      // mode === "edit" — pre-populate from the target district. We don't
      // auto-derive slug from name in edit mode (matches prototype guard).
      setForm({
        ...EMPTY_FORM,
        name: districtName,
        slug: slugify(districtName),
        state: districtState,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId, open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    if (mode === "create") {
      setSubmitting(true);
      try {
        const trimmedState = form.state.trim();
        const record: {
          name: string;
          country: string;
          platform: string;
          state?: string;
        } = {
          name: trimmedName,
          country: "United States",
          platform: env.PLATFORM,
        };
        if (trimmedState) record.state = trimmedState;

        const data = await gqlClient.request(DistrictCreateOneDocument, {
          record,
        });
        const payload = data.DistrictCreateOne;
        // graphql-codegen types `error` as `never` because no concrete
        // ErrorInterface implementer is selected. Read via runtime cast.
        const errorMessage = (payload?.error as
          | { message?: string | null }
          | null
          | undefined)?.message;
        if (errorMessage) {
          toast.error(errorMessage);
          return;
        }
        const created = payload?.record;
        if (!created || !payload?.recordId) {
          toast.error("District created but response was missing a record.");
          return;
        }
        const district: District = {
          _id: payload.recordId,
          name: created.name ?? trimmedName,
          state: created.state ?? null,
          country: created.country ?? "United States",
          platform: created.platform ?? env.PLATFORM,
          organization: null,
          createdAt: created.createdAt ?? null,
          updatedAt: created.updatedAt ?? null,
        };
        toast.success(`District "${district.name ?? trimmedName}" created`);
        props.onCreated(district);
        onOpenChange(false);
        setForm(EMPTY_FORM);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create district";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // mode === "edit"
    setSubmitting(true);
    try {
      const trimmedState = form.state.trim();
      const record: {
        name: string;
        country: string;
        platform: string;
        state?: string;
      } = {
        name: trimmedName,
        country: "United States",
        platform: env.PLATFORM,
      };
      if (trimmedState) record.state = trimmedState;

      const data = await gqlClient.request(DistrictUpdateOneDocument, {
        _id: props.district._id,
        record,
      });
      const payload = data.DistrictUpdateOne;
      const errorMessage = (payload?.error as
        | { message?: string | null }
        | null
        | undefined)?.message;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
      const updated = payload?.record;
      if (!updated) {
        toast.error("District updated but response was missing a record.");
        return;
      }
      const district: District = {
        _id: updated._id ?? props.district._id,
        name: updated.name ?? trimmedName,
        state: updated.state ?? null,
        country: updated.country ?? "United States",
        platform: updated.platform ?? env.PLATFORM,
        organization: updated.organization ?? null,
        createdAt: updated.createdAt ?? null,
        updatedAt: updated.updatedAt ?? null,
      };
      toast.success("District updated successfully");
      props.onUpdated(district);
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update district";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const title = mode === "create" ? "New District" : "Edit District";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {mode === "edit" ? (
            <DialogTitle className="font-serif text-xl">{title}</DialogTitle>
          ) : (
            <DialogTitle>{title}</DialogTitle>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="district-name">Name *</Label>
              <Input
                id="district-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    ...(mode === "create"
                      ? { slug: slugify(e.target.value) }
                      : {}),
                  }))
                }
                required
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="district-slug">Slug</Label>
              <Input
                id="district-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                className="font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-city">City</Label>
              <Input
                id="district-city"
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-state">State</Label>
              <Input
                id="district-state"
                value={form.state}
                onChange={(e) =>
                  setForm((f) => ({ ...f, state: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="district-address">Address</Label>
            <Textarea
              id="district-address"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-phone">Phone</Label>
              <Input
                id="district-phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-email">Email</Label>
              <Input
                id="district-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-website">Website</Label>
              <Input
                id="district-website"
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-timezone">Timezone</Label>
              <Select
                id="district-timezone"
                value={form.timezone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, timezone: e.target.value }))
                }
              >
                {US_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Cover Photo</Label>
            <label className="flex h-14 items-center gap-3 rounded-lg border border-dashed border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/40 cursor-pointer">
              <span className="block h-8 w-12 rounded bg-muted" aria-hidden="true" />
              <span>Select cover photo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Logo</Label>
            <label className="flex h-14 items-center gap-3 rounded-lg border border-dashed border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/40 cursor-pointer">
              <span className="block h-10 w-10 rounded bg-muted" aria-hidden="true" />
              <span>Select logo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="district-active"
              checked={form.active}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, active: checked }))
              }
            />
            <Label htmlFor="district-active">Active</Label>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
              disabled={submitting || !form.name.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
