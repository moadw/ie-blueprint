export type UserRoleIdentifier = "admin" | "teacher" | "district-admin";

export type UserHomePath = "/admin" | "/classrooms" | "/dashboard" | "/home";

const HOME_BY_IDENTIFIER: Record<UserRoleIdentifier, UserHomePath> = {
  admin: "/admin",
  teacher: "/classrooms",
  "district-admin": "/dashboard",
};

export function homePathForIdentifier(
  identifier: string | null | undefined,
): UserHomePath {
  if (identifier && identifier in HOME_BY_IDENTIFIER) {
    return HOME_BY_IDENTIFIER[identifier as UserRoleIdentifier];
  }
  return "/home";
}
