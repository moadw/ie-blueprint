export type UserRoleIdentifier =
  | "admin"
  | "teacher"
  | "district-admin"
  | "school-admin";

export type UserHomePath =
  | "/admin"
  | "/classrooms"
  | "/dashboard"
  | "/district"
  | "/home";

const HOME_BY_IDENTIFIER: Record<UserRoleIdentifier, UserHomePath> = {
  admin: "/admin",
  teacher: "/classrooms",
  "district-admin": "/district",
  "school-admin": "/district",
};

export function homePathForIdentifier(
  identifier: string | null | undefined,
): UserHomePath {
  if (identifier && identifier in HOME_BY_IDENTIFIER) {
    return HOME_BY_IDENTIFIER[identifier as UserRoleIdentifier];
  }
  return "/home";
}

/**
 * Identifiers treated as "district/school admin" for the act-as-teacher flow.
 * `school-admin` is wired (2026-07-24): it's in `HOME_BY_IDENTIFIER`
 * (→ "/district"), this set, and admitted by the `/district` layout gate
 * (`routes/district.tsx`), which resolves a school-polymorphic scope via
 * `resolveDistrictAdmin` (`district-admin.server.ts`) instead of a district.
 */
const DISTRICT_OR_SCHOOL_ADMIN = new Set<string>([
  "district-admin",
  "school-admin",
]);

/** True when the identifier is a district (or, later, school) admin. */
export function isDistrictOrSchoolAdmin(
  identifier: string | null | undefined,
): boolean {
  return !!identifier && DISTRICT_OR_SCHOOL_ADMIN.has(identifier);
}

/**
 * Role labels hidden from every role picker/filter across the app (admin +
 * district user forms). Matched case-insensitively against the role label.
 * District forms additionally hide "Administrator" (see DistrictUsersFilterBar);
 * platform-admin forms keep that one selectable.
 */
export const HIDDEN_ROLE_LABELS = new Set([
  "school manager",
  "district manager",
  "tutor",
]);

/** True unless the role is one of the globally hidden roles. */
export function isSelectableRole(
  role: { label?: string | null } | null | undefined,
): boolean {
  const label = role?.label?.trim().toLowerCase();
  return !(label != null && HIDDEN_ROLE_LABELS.has(label));
}

export interface UserNameFields {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  email?: string | null;
}

/** Best available human-readable name: full name → userName → email → fallback. */
export function getUserDisplayName(
  user: UserNameFields | null | undefined,
  fallback = "Account",
): string {
  if (!user) return fallback;
  const full = [user.firstName, user.lastName]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .trim();
  return full || user.userName || user.email || fallback;
}

/** Avatar initials: first+last initials → first char of display name → "?". */
export function getUserInitials(user: UserNameFields | null | undefined): string {
  const first = user?.firstName?.trim().charAt(0) ?? "";
  const last = user?.lastName?.trim().charAt(0) ?? "";
  const combined = `${first}${last}`.toUpperCase();
  if (combined) return combined;
  return getUserDisplayName(user, "").trim().charAt(0).toUpperCase() || "?";
}
