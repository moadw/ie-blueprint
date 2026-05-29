import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRevalidator } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/toast";
import { api, ApiError } from "~/lib/api";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import {
  DistrictCreateOneDocument,
  DistrictFindOneDocument,
  DistrictProfileCreateOneDocument,
  DistrictProfileFindOneDocument,
  DistrictProfileUpdateOneDocument,
  DistrictUpdateOneDocument,
} from "~/queries/districts";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = "image/png,image/jpeg";

type DistrictProfileSummary = {
  _id: string;
  district?: string | null;
  city?: string | null;
  address?: string | null;
  website?: string | null;
  cover?: { type?: string | null; url?: string | null } | null;
  logo?: { type?: string | null; url?: string | null } | null;
};

export type District = {
  _id: string;
  name?: string | null;
  state?: string | null;
  country?: string | null;
  platform?: string | null;
  organization?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  profile?: DistrictProfileSummary | null;
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
  website: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  city: "",
  state: "",
  address: "",
  website: "",
};

const FIELD_INPUT_CLASS =
  "h-10 px-3 rounded-[14px] bg-stone-50 border border-stone-200 text-stone-900 text-sm placeholder:text-stone-400 focus:ring-stone-300";

const LABEL_CLASS = "text-stone-600 text-sm font-medium";

export function DistrictDialog(props: DistrictDialogProps) {
  const { mode, open, onOpenChange } = props;
  const revalidator = useRevalidator();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [persistedCoverUrl, setPersistedCoverUrl] = useState<string | null>(
    null,
  );
  const [persistedLogoUrl, setPersistedLogoUrl] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

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
    setCoverFile(null);
    setLogoFile(null);
    setProfileId(null);
    setPersistedCoverUrl(null);
    setPersistedLogoUrl(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId, open]);

  // Edit-open: load (or bootstrap) the profile, hydrate text fields + persisted URLs.
  useEffect(() => {
    if (!open || mode !== "edit") return;
    const targetId = districtId;
    if (!targetId) return;

    let cancelled = false;
    (async () => {
      try {
        const findResult = await gqlClient.request(
          DistrictProfileFindOneDocument,
          { filter: { district: targetId } },
        );
        if (cancelled) return;
        let found = findResult.DistrictProfileFindOne ?? null;
        if (!found) {
          // Bootstrap: legacy district with no profile yet.
          const createResult = await gqlClient.request(
            DistrictProfileCreateOneDocument,
            { record: { district: targetId } },
          );
          if (cancelled) return;
          found = createResult.DistrictProfileCreateOne ?? null;
        }
        if (!found?._id) return;
        setProfileId(found._id);
        setForm((prev) => ({
          ...prev,
          city: found?.city ?? "",
          address: found?.address ?? "",
          website: found?.website ?? "",
        }));
        // Cover/logo live on `district` (not on `districtprofile`).
        const districtResult = await gqlClient.request(
          DistrictFindOneDocument,
          { filter: { _id: targetId } },
        );
        if (cancelled) return;
        const districtRecord = districtResult.DistrictFindOne ?? null;
        setPersistedCoverUrl(districtRecord?.coverPhoto?.url ?? null);
        setPersistedLogoUrl(districtRecord?.logo?.url ?? null);
      } catch (err) {
        if (cancelled) return;
        console.error("[district-profile-open] failed", err);
        toast.error("Couldn't load district profile.");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId, open, mode]);

  // Blob preview for cover.
  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  // Blob preview for logo.
  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  // Refetch the district and update persisted cover/logo URLs.
  // Cover/logo live on `district.coverPhoto` / `district.logo` (not on the
  // profile). Appends a cache-bust so the browser drops the stale image
  // even when the backend overwrites the same S3 path.
  async function refetchDistrictAssets() {
    if (!districtId) return;
    try {
      const result = await gqlClient.request(
        DistrictFindOneDocument,
        { filter: { _id: districtId } },
      );
      const found = result.DistrictFindOne;
      if (!found) return;
      const bust = (url: string) =>
        `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
      setPersistedCoverUrl(
        found.coverPhoto?.url ? bust(found.coverPhoto.url) : null,
      );
      setPersistedLogoUrl(found.logo?.url ? bust(found.logo.url) : null);
    } catch (err) {
      console.error("[district-assets-refetch] failed", err);
    }
  }

  async function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Cover photo must be 5 MB or smaller.");
      return;
    }
    if (mode === "create") {
      setCoverFile(file);
      return;
    }
    // edit: immediate upload
    if (!profileId) {
      toast.error("Profile not ready — try again in a moment.");
      return;
    }
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("id", districtId ?? "");
      fd.append("file", file);
      console.log("[district-cover] PUT /admin/district-cover", {
        districtId,
        profileId,
        file: { name: file.name, size: file.size, type: file.type },
      });
      await api("/admin/district-cover", { method: "PUT", body: fd });
      toast.success("Cover photo updated");
      await refetchDistrictAssets();
      revalidator.revalidate();
    } catch (err) {
      console.error("[district-cover] upload-on-change failed", {
        profileId,
        file: { name: file.name, size: file.size, type: file.type },
        err,
        ...(err instanceof ApiError
          ? { status: err.status, body: err.body }
          : {}),
      });
      toast.error(err instanceof Error ? err.message : "Cover upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Logo must be 5 MB or smaller.");
      return;
    }
    if (mode === "create") {
      setLogoFile(file);
      return;
    }
    // edit: immediate upload
    if (!profileId) {
      toast.error("Profile not ready — try again in a moment.");
      return;
    }
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("id", districtId ?? "");
      fd.append("file", file);
      console.log("[district-logo] PUT /admin/district-logo", {
        districtId,
        profileId,
        file: { name: file.name, size: file.size, type: file.type },
      });
      await api("/admin/district-logo", { method: "PUT", body: fd });
      toast.success("Logo updated");
      await refetchDistrictAssets();
      revalidator.revalidate();
    } catch (err) {
      console.error("[district-logo] upload-on-change failed", {
        profileId,
        file: { name: file.name, size: file.size, type: file.type },
        err,
        ...(err instanceof ApiError
          ? { status: err.status, body: err.body }
          : {}),
      });
      toast.error(err instanceof Error ? err.message : "Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    if (mode === "create") {
      setSubmitting(true);
      try {
        const trimmedState = form.state.trim();
        const trimmedSlug = form.slug.trim() || slugify(trimmedName);
        const trimmedCity = form.city.trim();
        const trimmedAddress = form.address.trim();
        const trimmedWebsite = form.website.trim();

        const record: {
          name: string;
          slug: string;
          country: string;
          platform: string;
          state?: string;
        } = {
          name: trimmedName,
          slug: trimmedSlug,
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

        // Persist the profile (city/address/website + FK).
        // Note: `districtprofileInput` does not include `platform` in the
        // generated schema — only `district` + content fields.
        let profileId: string | null = null;
        let profileError: string | null = null;
        try {
          const profileRecord: {
            district: string;
            city?: string;
            address?: string;
            website?: string;
          } = {
            district: district._id,
          };
          if (trimmedCity) profileRecord.city = trimmedCity;
          if (trimmedAddress) profileRecord.address = trimmedAddress;
          if (trimmedWebsite) profileRecord.website = trimmedWebsite;

          const profileData = await gqlClient.request(
            DistrictProfileCreateOneDocument,
            { record: profileRecord },
          );
          profileId = profileData.DistrictProfileCreateOne?._id ?? null;
          if (!profileId) {
            profileError = "Profile create returned no _id";
          }
        } catch (err) {
          profileError = err instanceof Error ? err.message : String(err);
          console.error("[district-profile-create] failed", err);
        }

        // Sequential uploads (only if profileId exists).
        let coverFailed = false;
        let logoFailed = false;
        if (profileId && coverFile) {
          try {
            const fd = new FormData();
            fd.append("id", district._id);
            fd.append("file", coverFile);
            console.log("[district-cover] PUT /admin/district-cover", {
              districtId: district._id,
              profileId,
              file: { name: coverFile.name, size: coverFile.size, type: coverFile.type },
            });
            await api("/admin/district-cover", { method: "PUT", body: fd });
          } catch (err) {
            coverFailed = true;
            console.error("[district-cover] upload failed", {
              profileId,
              file: { name: coverFile.name, size: coverFile.size, type: coverFile.type },
              err,
              ...(err instanceof ApiError
                ? { status: err.status, body: err.body }
                : {}),
            });
          }
        }
        if (profileId && logoFile) {
          try {
            const fd = new FormData();
            fd.append("id", district._id);
            fd.append("file", logoFile);
            console.log("[district-logo] PUT /admin/district-logo", {
              districtId: district._id,
              profileId,
              file: { name: logoFile.name, size: logoFile.size, type: logoFile.type },
            });
            await api("/admin/district-logo", { method: "PUT", body: fd });
          } catch (err) {
            logoFailed = true;
            console.error("[district-logo] upload failed", {
              profileId,
              file: { name: logoFile.name, size: logoFile.size, type: logoFile.type },
              err,
              ...(err instanceof ApiError
                ? { status: err.status, body: err.body }
                : {}),
            });
          }
        }

        // Aggregate toast.
        if (profileError) {
          toast.warning("District created — profile fields failed to save.");
        } else if (coverFailed && logoFailed) {
          toast.warning("District created — cover and logo uploads failed.");
        } else if (coverFailed) {
          toast.warning("District created — cover upload failed.");
        } else if (logoFailed) {
          toast.warning("District created — logo upload failed.");
        } else {
          toast.success("District created");
        }

        props.onCreated(district);
        onOpenChange(false);
        setForm(EMPTY_FORM);
        setCoverFile(null);
        setLogoFile(null);
        revalidator.revalidate();
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
      const trimmedSlug = form.slug.trim() || slugify(trimmedName);
      const record: {
        name: string;
        slug: string;
        country: string;
        platform: string;
        state?: string;
      } = {
        name: trimmedName,
        slug: trimmedSlug,
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

      // Persist profile text fields (city/address/website). Cover/logo
      // uploads happen on-change in edit mode — they are NOT part of submit.
      if (profileId) {
        try {
          const trimmedCity = form.city.trim();
          const trimmedAddress = form.address.trim();
          const trimmedWebsite = form.website.trim();
          const profileRecord: {
            city?: string;
            address?: string;
            website?: string;
          } = {};
          if (trimmedCity) profileRecord.city = trimmedCity;
          if (trimmedAddress) profileRecord.address = trimmedAddress;
          if (trimmedWebsite) profileRecord.website = trimmedWebsite;
          await gqlClient.request(DistrictProfileUpdateOneDocument, {
            _id: profileId,
            record: profileRecord,
          });
        } catch (err) {
          console.error("[district-profile-update] failed", err);
          toast.error("Couldn't save profile fields.");
          // Don't bail — district itself already saved.
        }
      }

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
            <Label className={LABEL_CLASS}>Cover Photo</Label>
            <label
              className={`flex items-center gap-3 p-3 rounded-[16px] border border-dashed border-stone-300 bg-stone-50 cursor-pointer hover:border-stone-400 transition-colors ${
                uploadingCover ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt=""
                  className="w-12 h-8 rounded object-cover"
                />
              ) : mode === "edit" && persistedCoverUrl ? (
                <img
                  src={persistedCoverUrl}
                  alt=""
                  className="w-12 h-8 rounded object-cover"
                />
              ) : (
                <span
                  className="block h-8 w-12 rounded bg-stone-200"
                  aria-hidden="true"
                />
              )}
              <span className="text-stone-500 text-sm">
                {coverFile?.name ??
                  (mode === "edit" && persistedCoverUrl
                    ? "Replace cover photo"
                    : "Select cover photo")}
              </span>
              {uploadingCover ? (
                <Loader2
                  className="ml-auto w-4 h-4 animate-spin text-stone-500"
                  aria-label="Uploading"
                />
              ) : null}
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES}
                className="hidden"
                onChange={handleCoverChange}
                disabled={uploadingCover}
              />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className={LABEL_CLASS}>Logo</Label>
            <label
              className={`flex items-center gap-3 p-3 rounded-[16px] border border-dashed border-stone-300 bg-stone-50 cursor-pointer hover:border-stone-400 transition-colors ${
                uploadingLogo ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt=""
                  className="w-10 h-10 rounded object-cover"
                />
              ) : mode === "edit" && persistedLogoUrl ? (
                <img
                  src={persistedLogoUrl}
                  alt=""
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <span
                  className="block h-10 w-10 rounded bg-stone-200"
                  aria-hidden="true"
                />
              )}
              <span className="text-stone-500 text-sm">
                {logoFile?.name ??
                  (mode === "edit" && persistedLogoUrl
                    ? "Replace logo"
                    : "Select logo")}
              </span>
              {uploadingLogo ? (
                <Loader2
                  className="ml-auto w-4 h-4 animate-spin text-stone-500"
                  aria-label="Uploading"
                />
              ) : null}
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES}
                className="hidden"
                onChange={handleLogoChange}
                disabled={uploadingLogo}
              />
            </label>
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
