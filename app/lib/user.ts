export type UserRoleIdentifier = "admin" | "teacher" | "district-admin";

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
};

export function homePathForIdentifier(
  identifier: string | null | undefined,
): UserHomePath {
  if (identifier && identifier in HOME_BY_IDENTIFIER) {
    return HOME_BY_IDENTIFIER[identifier as UserRoleIdentifier];
  }
  return "/home";
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
