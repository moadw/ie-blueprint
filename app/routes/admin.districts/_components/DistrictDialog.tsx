import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
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
  { value: "America/New_York", label: "Eastern" },
  { value: "America/Chicago", label: "Central" },
  { value: "America/Denver", label: "Mountain" },
  { value: "America/Los_Angeles", label: "Pacific" },
  { value: "America/Anchorage", label: "Alaska" },
  { value: "Pacific/Honolulu", label: "Hawaii" },
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

const FIELD_INPUT_CLASS =
  "h-10 px-3 rounded-[14px] bg-stone-50 border border-stone-200 text-stone-900 text-sm placeholder:text-stone-400 focus:ring-stone-300";

const LABEL_CLASS = "text-stone-600 text-sm font-medium";

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
      <DialogContent className="bg-white border-stone-200 text-stone-900 max-w-lg font-sans rounded-[16px]">
        <DialogHeader className="mb-0">
          <DialogTitle className="font-serif text-xl font-normal text-stone-900">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="district-name" className={LABEL_CLASS}>
                Name *
              </Label>
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
                className={FIELD_INPUT_CLASS}
                required
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="district-slug" className={LABEL_CLASS}>
                Slug
              </Label>
              <Input
                id="district-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                className={`${FIELD_INPUT_CLASS} font-mono text-xs`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-city" className={LABEL_CLASS}>
                City
              </Label>
              <Input
                id="district-city"
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
                className={FIELD_INPUT_CLASS}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-state" className={LABEL_CLASS}>
                State
              </Label>
              <Input
                id="district-state"
                value={form.state}
                onChange={(e) =>
                  setForm((f) => ({ ...f, state: e.target.value }))
                }
                className={FIELD_INPUT_CLASS}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="district-address" className={LABEL_CLASS}>
              Address
            </Label>
            <Input
              id="district-address"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              className={FIELD_INPUT_CLASS}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-phone" className={LABEL_CLASS}>
                Phone
              </Label>
              <Input
                id="district-phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className={FIELD_INPUT_CLASS}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-email" className={LABEL_CLASS}>
                Email
              </Label>
              <Input
                id="district-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className={FIELD_INPUT_CLASS}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-website" className={LABEL_CLASS}>
                Website
              </Label>
              <Input
                id="district-website"
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
                className={FIELD_INPUT_CLASS}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district-timezone" className={LABEL_CLASS}>
                Timezone
              </Label>
              <Select
                id="district-timezone"
                value={form.timezone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, timezone: e.target.value }))
                }
                className={FIELD_INPUT_CLASS}
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
            <Label className={LABEL_CLASS}>Cover Photo</Label>
            <label className="flex items-center gap-3 p-3 rounded-[16px] border border-dashed border-stone-300 bg-stone-50 cursor-pointer hover:border-stone-400 transition-colors">
              <span
                className="block h-8 w-12 rounded bg-stone-200"
                aria-hidden="true"
              />
              <span className="text-stone-500 text-sm">Select cover photo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className={LABEL_CLASS}>Logo</Label>
            <label className="flex items-center gap-3 p-3 rounded-[16px] border border-dashed border-stone-300 bg-stone-50 cursor-pointer hover:border-stone-400 transition-colors">
              <span
                className="block h-10 w-10 rounded bg-stone-200"
                aria-hidden="true"
              />
              <span className="text-stone-500 text-sm">Select logo</span>
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
            <Label htmlFor="district-active" className="text-stone-600 text-sm">
              Active
            </Label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-100">
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting || !form.name.trim()}
              className="h-10 px-4 rounded-[14px] bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium"
            >
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-10 px-4 rounded-[14px] text-stone-500 hover:text-stone-700 hover:bg-transparent text-sm font-medium"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
