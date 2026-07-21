import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "~/components/ui/searchable-select";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import { SetUserSchoolDocument } from "~/mutations/users";

export interface SchoolStepProps {
  /** Session token for the client-side `SetUserSchool` mutation. */
  token: string;
  /** The session user's `_id`; null only if the account failed to load. */
  userId: string | null;
  /** District display name (read-only box); null when unavailable. */
  districtName: string | null;
  /** District's school catalog, already mapped + client-filterable by name. */
  schools: SearchableSelectOption[];
  /** Non-null when the district/school load degraded → soft error card. */
  loadError: string | null;
  onBack: () => void;
}

/**
 * Step 2 of `/onboarding/account`: pick the school within the joined district
 * (client-side name filter — Blueprint `SchoolFindMany` has no substring
 * search) and assign it via `SetUserSchool`, then continue to the first
 * classroom. District + schools come pre-fetched from the route loader.
 */
export function SchoolStep({
  token,
  userId,
  districtName,
  schools,
  loadError,
  onBack,
}: SchoolStepProps) {
  const navigate = useNavigate();
  const [school, setSchool] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  const assign = async () => {
    if (!userId || !school) return;
    setAssigning(true);
    try {
      await gqlClient.request(
        SetUserSchoolDocument,
        { user: userId, school },
        { "access-token": token },
      );
      navigate("/classrooms/create");
    } catch (err) {
      // Keep the user on-step so they can retry; mutations toast (not the root
      // ErrorBoundary).
      toast.error(toErrorMessage(err, "Failed to link your school"));
      setAssigning(false);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="mb-5 text-sm text-muted-foreground sm:text-base lg:mb-6">
        This links you to your school's account
      </p>

      {loadError ? (
        // CLAUDE.md resilient-loader: a degraded district/school fetch renders a
        // soft card, not the root ErrorBoundary white-screen.
        <div className="mb-6 rounded-[14px] border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-600">
          Couldn't load your schools. Please refresh and try again.
        </div>
      ) : (
        <>
          {/* Read-only district (the join already scoped it). */}
          <div className="mb-5 lg:mb-6">
            <p className="mb-2 text-[14px] font-medium text-foreground">
              Your district
            </p>
            <div className="flex h-[52px] items-center rounded-xl border border-border bg-muted px-4 text-[15px] font-medium text-foreground">
              {districtName ?? "Your district"}
            </div>
          </div>

          <div className="mb-6 lg:mb-8">
            <p className="mb-2 text-[14px] font-medium text-foreground">
              Your school
            </p>
            {schools.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/40 p-4 text-sm text-muted-foreground">
                No schools are listed for your district yet. Please contact your
                district administrator.
              </div>
            ) : (
              <SearchableSelect
                options={schools}
                value={school}
                onChange={(value) => setSchool(value)}
                placeholder="Select your school"
                searchPlaceholder="Search schools…"
                emptyText="No schools found."
                className="rounded-xl"
              />
            )}
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={assigning}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          loading={assigning}
          disabled={!school || assigning}
          onClick={assign}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
