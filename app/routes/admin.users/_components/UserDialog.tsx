import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { DistrictCombobox } from "~/components/ui/district-combobox";
import type { DistrictSearchOption } from "~/components/ui/district-combobox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { duplicateKeyField, toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { isSelectableRole } from "~/lib/user";
import { DistrictOptionsFindManyDocument } from "~/queries/districts";
import { SchoolFindManyDocument } from "~/queries/schools";
import {
  UserTypesFindManyDocument,
} from "~/queries/users";
import {
  CreateUserDocument,
  SetUserSchoolDocument,
  UserUpdateOneDocument,
} from "~/mutations/users";
import type { AdminUserRow } from "./UserRow";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UserTypeOption {
  _id: string;
  label?: string | null;
}

interface SchoolOption {
  _id: string;
  name?: string | null;
}

export interface UserDialogProps {
  open: boolean;
  target: AdminUserRow | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function UserDialog({
  open,
  target,
  onOpenChange,
  onSaved,
}: UserDialogProps) {
  const isEdit = target !== null;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  // Holds the selected district option. The user's `organization` field is
  // derived from `district.organization` at submit time — districts are the
  // real connector between users and organizations in the admin UI.
  const [district, setDistrict] = useState<DistrictSearchOption | null>(null);
  const districtId = district?._id ?? "";
  const [school, setSchool] = useState("");
  const [saving, setSaving] = useState(false);

  const [userTypes, setUserTypes] = useState<UserTypeOption[]>([]);
  const [schools, setSchools] = useState<SchoolOption[]>([]);

  // Reset form fields whenever the dialog opens or the target changes.
  // `district` is resolved separately in edit mode (see below).
  useEffect(() => {
    if (!open) return;
    setFirstName(target?.firstName ?? "");
    setLastName(target?.lastName ?? "");
    setEmail(target?.email ?? "");
    setEmailError(null);
    setPassword("");
    setType(target?.type_id ?? "");
    setDistrict(null);
    setSchool("");
    setSchools([]);
  }, [open, target]);

  // In edit mode, preselect the district the user already belongs to by
  // resolving it from the user's `organization` (the combobox no longer has a
  // full district list to match against). Degrades to unselected on failure.
  useEffect(() => {
    if (!open || !isEdit) return;
    const userOrgId = target?.organization_id;
    if (!userOrgId) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await gqlClient.request(DistrictOptionsFindManyDocument, {
          filter: { organization: userOrgId },
          limit: 1,
        });
        if (cancelled) return;
        const match = (result.DistrictFindMany ?? []).find(
          (d): d is NonNullable<typeof d> => d != null,
        );
        if (match) {
          setDistrict({
            _id: match._id,
            name: match.name ?? "",
            state: match.state ?? null,
            organization: match.organization ?? null,
          });
        }
      } catch {
        if (!cancelled) setDistrict(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, isEdit, target?.organization_id]);

  // Load user types when the dialog opens. Districts come from the route
  // loader as a prop. Errors degrade gracefully — the select renders its
  // placeholder + nothing else.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await gqlClient.request(UserTypesFindManyDocument, {});
        if (cancelled) return;
        const items = (result.UserTypesFindMany ?? [])
          .filter((t): t is NonNullable<typeof t> => t != null)
          .filter(isSelectableRole);
        setUserTypes(items);
      } catch {
        if (!cancelled) setUserTypes([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // When a district is selected in create mode, load its schools so the user
  // can optionally assign one inline.
  useEffect(() => {
    if (!open) return;
    if (isEdit) return;
    if (!districtId) {
      setSchools([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await gqlClient.request(SchoolFindManyDocument, {
          filter: { district: districtId, platform: env.PLATFORM },
        });
        if (cancelled) return;
        const items = (result.SchoolFindMany ?? []).filter(
          (s): s is NonNullable<typeof s> => s != null,
        );
        setSchools(items);
      } catch {
        if (!cancelled) setSchools([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, isEdit, districtId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setEmailError(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // A user's `organization` is set from the chosen district's `organization`
    // — districts and users only meet through the organization layer.
    const orgId = district?.organization ?? null;
    if (!orgId) {
      toast.error("Selected district is missing an organization.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit && target) {
        if (!target.userId) {
          throw new Error("Cannot update user: missing id");
        }
        const result = await gqlClient.request(UserUpdateOneDocument, {
          _id: target.userId,
          record: {
            firstName,
            lastName,
            email: normalizedEmail,
            type,
            organization: orgId,
          },
        });
        const payload = result.UserUpdateOne;
        const payloadError = (
          payload as { error?: { message?: string } | null } | null | undefined
        )?.error;
        if (payloadError?.message) {
          throw new Error(payloadError.message);
        }
        toast.success("User updated");
      } else {
        const data = await gqlClient.request(CreateUserDocument, {
          firstName,
          lastName,
          email: normalizedEmail,
          type,
          organization: orgId,
          password,
          platform: env.PLATFORM,
          sendEmail: false,
        });
        const userId = data.CreateUser;
        if (school && userId) {
          try {
            await gqlClient.request(SetUserSchoolDocument, {
              user: userId,
              school,
            });
          } catch (err) {
            console.error("[user-dialog] school assignment failed", err);
            toast.warning("User created — school assignment failed.");
          }
        }
        toast.success("User created");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      // A duplicate-key error on the users collection is always the unique
      // email index — surface it on the email field so the admin can fix it
      // without losing the rest of the form.
      if (duplicateKeyField(err) !== null) {
        const message =
          "This email address is already in use. Enter a different email.";
        setEmailError(message);
        toast.error(message);
        emailInputRef.current?.focus();
      } else {
        toast.error(toErrorMessage(err, "Failed to save user"));
      }
    } finally {
      setSaving(false);
    }
  }

  // Password is optional on create — the backend accepts users with no
  // password (they self-reset / sign in via SSO), and CreateUser's `password`
  // arg is nullable.
  const submitDisabled =
    saving ||
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !type ||
    !district;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal">
            {isEdit ? "Edit user" : "Create user"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
              className="h-10 text-sm"
            />
            <Input
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="h-10 text-sm"
            />
          </div>

          <Input
            ref={emailInputRef}
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            error={emailError ?? ""}
            required
            className="h-10 text-sm"
          />

          {!isEdit ? (
            <Input
              label="Password (optional)"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank for SSO / self-reset"
              className="h-10 text-sm"
            />
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="user-dialog-role"
              className="text-sm font-medium text-muted-foreground"
            >
              Role
            </Label>
            <Select
              id="user-dialog-role"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select role</option>
              {userTypes.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.label ?? t._id}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="user-dialog-district"
              className="text-sm font-medium text-muted-foreground"
            >
              District
            </Label>
            <DistrictCombobox
              id="user-dialog-district"
              value={district}
              onChange={setDistrict}
              placeholder="Select district"
            />
          </div>

          {!isEdit && districtId && schools.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="user-dialog-school"
                className="text-sm font-medium text-muted-foreground"
              >
                School
              </Label>
              <Select
                id="user-dialog-school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              >
                <option value="">Select school</option>
                {schools.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name ?? s._id}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="h-10 px-4 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={submitDisabled}
              className="h-10 px-4 text-sm font-medium"
            >
              {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
