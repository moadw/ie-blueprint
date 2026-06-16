import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "~/lib/graphql";
import { UsersFindOneDocument } from "~/queries/users";

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => gqlClient.request(UsersFindOneDocument, {}),
    select: (d) => d.UsersFindOne ?? null,
    enabled: options?.enabled ?? true,
  });
}
