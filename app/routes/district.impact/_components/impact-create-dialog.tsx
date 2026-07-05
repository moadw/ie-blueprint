import { useEffect, useState } from "react";
import { useRevalidator } from "react-router";
import { ChevronDown, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Modal } from "~/components/ui/modal";
import { toErrorMessage } from "~/lib/errors";
import { gqlClient } from "~/lib/graphql";
import type { ImpactStoryType } from "~/lib/district-impact.server";
import type { CreateOneimpactInput } from "~/gql/graphql";
import { ImpactCreateOneDocument } from "~/mutations/impact";

export interface ImpactCreateDialogProps {
  open: boolean;
  onClose: () => void;
  /** Autor (read-only): nombre del admin logeado. */
  authorName: string | null;
  /** Rol (read-only): tipo del admin logeado, ya formateado. */
  authorRole: string | null;
}

const TYPE_OPTIONS: { value: ImpactStoryType; label: string }[] = [
  { value: "testimonial", label: "Testimonial" },
  { value: "journal", label: "Journal Reflection" },
  { value: "photo", label: "Photo" },
  { value: "milestone", label: "Milestone" },
  { value: "feedback", label: "Practice Feedback" },
];

// Etiquetas/placeholders del cuerpo según el tipo (espeja lo que cada card
// renderiza en `impact-card.tsx`).
const BODY_FIELD: Record<
  ImpactStoryType,
  { label: string; placeholder: string }
> = {
  testimonial: {
    label: "Testimonial",
    placeholder: "Share what Inner Explorer has meant for your classroom…",
  },
  journal: {
    label: "Reflection",
    placeholder: "What did you notice during today's practice?",
  },
  photo: { label: "", placeholder: "" },
  milestone: {
    label: "Description",
    placeholder: "Describe the milestone your community reached…",
  },
  feedback: {
    label: "Feedback",
    placeholder: "What did you observe during the practice?",
  },
};

const TITLE_FIELD: Partial<
  Record<ImpactStoryType, { label: string; placeholder: string }>
> = {
  journal: { label: "Title (optional)", placeholder: "Give your reflection a title" },
  milestone: { label: "Milestone Title", placeholder: "e.g. 12,450 Mindful Minutes" },
};

const selectClass =
  "w-full h-[52px] px-4 pr-10 bg-card border border-border rounded-lg text-[15px] text-foreground placeholder:text-muted-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30";
const labelClass = "block text-[14px] text-foreground mb-2 font-medium";
const textareaClass =
  "w-full bg-card border border-border rounded-lg p-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

export function ImpactCreateDialog({
  open,
  onClose,
  authorName,
  authorRole,
}: ImpactCreateDialogProps) {
  const revalidator = useRevalidator();

  const [type, setType] = useState<ImpactStoryType>("testimonial");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [school, setSchool] = useState("");
  const [rating, setRating] = useState(0);
  // Autor/rol: autofilled desde la cuenta pero editables.
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Visibilidad de campos por tipo (alineada con cada variante de card).
  const showTitle = type === "journal" || type === "milestone";
  const showBody = type !== "photo";
  const showImageUrl = type === "photo";
  const showRating = type === "feedback";
  const showAuthor =
    type === "testimonial" || type === "journal" || type === "feedback";
  const showSchool = type !== "photo";

  // Autofill de autor/rol desde la cuenta al abrir (el usuario puede editarlos).
  useEffect(() => {
    if (!open) return;
    setAuthor(authorName ?? "");
    setRole(authorRole ?? "");
  }, [open, authorName, authorRole]);

  // Reset al cerrar.
  useEffect(() => {
    if (open) return;
    setType("testimonial");
    setTitle("");
    setBody("");
    setImageUrl("");
    setSchool("");
    setRating(0);
    setAuthor("");
    setRole("");
    setError(null);
    setSubmitting(false);
  }, [open]);

  // Limpia errores al cambiar de tipo (los requisitos cambian).
  useEffect(() => {
    setError(null);
  }, [type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validación condicional por tipo.
    if (type === "photo") {
      if (!imageUrl.trim()) {
        setError("An image URL is required for a photo.");
        return;
      }
    } else if (!body.trim()) {
      setError(`${BODY_FIELD[type].label} is required.`);
      return;
    }
    if (type === "milestone" && !title.trim()) {
      setError("A milestone title is required.");
      return;
    }
    if (type === "feedback" && rating < 1) {
      setError("Please select a rating from 1 to 5.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const record: CreateOneimpactInput = {
        type,
        deleted: false,
      };

      // feedback guarda el rating en `title` (la costura lo parsea de ahí);
      // los demás tipos usan `title` como encabezado.
      if (type === "feedback") {
        record.title = String(rating);
      } else if (showTitle) {
        record.title = title.trim() || null;
      }

      if (showBody) record.description = body.trim() || null;
      if (showImageUrl) record.cover = { type: "image", url: imageUrl.trim() };
      if (showSchool) record.school = school.trim() || null;
      if (showAuthor) {
        record.user = author.trim() || null;
        record.userType = role.trim() || null;
      }

      const data = await gqlClient.request(ImpactCreateOneDocument, { record });
      const payload = data.ImpactCreateOne;
      // `error` se genera como `never` (ErrorInterface sin inline fragment);
      // mismo cast que el resto de mutations del repo (p. ej. series-dialog).
      const payloadError = (
        payload as { error?: { message?: string } | null } | null | undefined
      )?.error;
      if (payloadError?.message) throw new Error(payloadError.message);
      if (!payload?.recordId) throw new Error("Server did not return recordId");

      toast.success("Story shared");
      onClose();
      revalidator.revalidate();
    } catch (err) {
      const msg = toErrorMessage(err, "Failed to share story");
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Share a Story">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="impact-type">
            Type
          </label>
          <div className="relative">
            <select
              id="impact-type"
              value={type}
              onChange={(e) => setType(e.target.value as ImpactStoryType)}
              className={selectClass}
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {showTitle ? (
          <Input
            label={TITLE_FIELD[type]?.label ?? "Title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={TITLE_FIELD[type]?.placeholder}
          />
        ) : null}

        {showImageUrl ? (
          <Input
            label="Image URL"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
          />
        ) : null}

        {showBody ? (
          <div>
            <label className={labelClass} htmlFor="impact-body">
              {BODY_FIELD[type].label}
            </label>
            <textarea
              id="impact-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className={textareaClass}
              placeholder={BODY_FIELD[type].placeholder}
            />
          </div>
        ) : null}

        {showRating ? (
          <div>
            <label className={labelClass}>Rating</label>
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
              {Array.from({ length: 5 }, (_, i) => {
                const value = i + 1;
                const active = value <= rating;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    aria-pressed={active}
                    className="rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <Star
                      className={
                        active
                          ? "h-6 w-6 text-amber-400 fill-amber-400"
                          : "h-6 w-6 text-muted-foreground/30"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {showSchool ? (
          <Input
            label="School (optional)"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="e.g. Sunset Elementary"
          />
        ) : null}

        {showAuthor ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
            />
            <Input
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Your role"
            />
          </div>
        ) : null}

        {showAuthor ? (
          <p className="-mt-1 text-[13px] text-muted-foreground">
            Prefilled from your account — edit if needed.
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sharing
              </>
            ) : (
              "Share Story"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ImpactCreateDialog;
