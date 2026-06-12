import { useState } from "react";
import { useRevalidator } from "react-router";
import { Copy, Link2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  ConfirmDialog,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import {
  SchoolCodeCreateOneDocument,
  SchoolCodeDeleteOneDocument,
} from "~/queries/school-codes";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateInviteCode(length = 8): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let result = "";
  const alphabetLength = CODE_ALPHABET.length;
  for (let i = 0; i < length; i++) {
    const idx = (bytes[i] ?? 0) % alphabetLength;
    result += CODE_ALPHABET[idx];
  }
  return result;
}

interface DistrictInviteCardProps {
  districtId: string;
  districtName: string | null;
  invite: { _id: string; code: string } | null;
}

type CreatePayload = {
  recordId?: string | null;
  record?: { _id?: string | null; code?: string | null } | null;
  error?: { message?: string | null } | null;
} | null
  | undefined;

export function DistrictInviteCard({
  districtId,
  districtName,
  invite,
}: DistrictInviteCardProps) {
  const revalidator = useRevalidator();
  const [creating, setCreating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [mutationsDisabled, setMutationsDisabled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleCopy() {
    if (!invite?.code) return;
    void navigator.clipboard.writeText(invite.code).then(
      () => toast.success("Code copied"),
      () => toast.error("Couldn't copy the code"),
    );
  }

  async function handleGenerate() {
    if (mutationsDisabled || creating) return;
    setCreating(true);
    try {
      const data = await gqlClient.request(SchoolCodeCreateOneDocument, {
        record: {
          district: districtId,
          platform: env.PLATFORM,
          code: generateInviteCode(),
        },
      });
      const payload = data.SchoolCodeCreateOne as CreatePayload;
      if (payload?.error?.message) {
        toast.error(payload.error.message);
        setMutationsDisabled(true);
        return;
      }
      revalidator.revalidate();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Couldn't generate invite code";
      toast.error(message);
      setMutationsDisabled(true);
    } finally {
      setCreating(false);
    }
  }

  async function handleRegenerate() {
    if (mutationsDisabled || !invite?.code) return;
    setRegenerating(true);
    try {
      await gqlClient.request(SchoolCodeDeleteOneDocument, {
        schoolCode: invite.code,
      });
      const data = await gqlClient.request(SchoolCodeCreateOneDocument, {
        record: {
          district: districtId,
          platform: env.PLATFORM,
          code: generateInviteCode(),
        },
      });
      const payload = data.SchoolCodeCreateOne as CreatePayload;
      if (payload?.error?.message) {
        toast.error(payload.error.message);
        setMutationsDisabled(true);
        return;
      }
      revalidator.revalidate();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Couldn't regenerate invite code";
      toast.error(message);
      setMutationsDisabled(true);
    } finally {
      setRegenerating(false);
      setConfirmOpen(false);
    }
  }

  const districtLabel = districtName ?? "this district";

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Link2
          className="w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <h2 className="text-sm font-semibold">Invite Educators</h2>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="district-invite-code"
          className="block text-[13px] text-muted-foreground"
        >
          Invite code for {districtLabel}
        </label>
        {invite?.code ? (
          <div className="flex items-stretch gap-2">
            <Input
              id="district-invite-code"
              readOnly
              value={invite.code}
              className="font-mono text-sm bg-muted/50 h-9 cursor-default"
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="Copy invite code"
            >
              <Copy className="w-4 h-4" aria-hidden="true" />
            </Button>
            {!mutationsDisabled ? (
              <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Regenerate invite code?"
                description="The current code will stop working. Educators who try to use it will not be able to sign up."
                confirmLabel="Regenerate"
                cancelLabel="Cancel"
                variant="destructive"
                loading={regenerating}
                onConfirm={handleRegenerate}
                trigger={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Regenerate invite code"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  </Button>
                }
              />
            ) : null}
          </div>
        ) : mutationsDisabled ? null : (
          <Button
            variant="outline"
            onClick={handleGenerate}
            loading={creating}
            className="h-9 px-4 text-sm"
          >
            Generate invite code
          </Button>
        )}
      </div>

      <p className="text-[13px] text-muted-foreground">
        Educators use this code when signing up.
      </p>
    </div>
  );
}
