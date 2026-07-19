import { useState } from "react";
import { Copy, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { env } from "~/lib/env";

interface DistrictInviteCardProps {
  /** The district admin's own organization (from `MyOrganizationFindOne`). */
  organization: { code: string | null; name: string | null } | null;
  /** `safe()` loader error for `MyOrganizationFindOne` (case C → hide the section). */
  error: string | null;
  /** Master-admin preview: the loader skips the org query, so render nothing. */
  readOnly?: boolean;
}

export function DistrictInviteCard({
  organization,
  error,
  readOnly = false,
}: DistrictInviteCardProps) {
  const [revealed, setRevealed] = useState(false);

  // In master-admin preview (readOnly) the org query is not the previewed
  // district's, and on an access-denied / failed query (case C) there is nothing
  // trustworthy to show — hide the section entirely in both cases.
  if (readOnly || error) return null;

  const code = organization?.code ?? null;
  const inviteUrl = code ? `${env.APP_URL}/signup/district/${code}` : "";

  function handleCopy() {
    if (!inviteUrl) return;
    void navigator.clipboard.writeText(inviteUrl).then(
      () => toast.success("Invite link copied"),
      () => toast.error("Couldn't copy the invite link"),
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-semibold">Invite Educators</h2>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="district-invite-url"
          className="block text-[13px] text-muted-foreground"
        >
          Invite link for {organization?.name ?? "this district"}
        </label>
        {code ? (
          revealed ? (
            <div className="flex items-stretch gap-2">
              <Input
                id="district-invite-url"
                readOnly
                value={inviteUrl}
                className="font-mono text-sm bg-muted/50 h-9 cursor-default"
                onFocus={(e) => e.currentTarget.select()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy invite link"
              >
                <Copy className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setRevealed(true)}
              className="h-9 px-4 text-sm"
            >
              Generate invite code
            </Button>
          )
        ) : (
          <p className="text-[13px] text-muted-foreground">
            This district doesn't have an invite code yet.
          </p>
        )}
      </div>

      <p className="text-[13px] text-muted-foreground">
        Educators use this link when signing up.
      </p>
    </div>
  );
}
