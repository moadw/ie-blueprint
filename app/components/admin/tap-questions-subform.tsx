import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

/**
 * One entry of the tap's `extraQuestions` subdocument array.
 * `question` is the questions-collection record id; `points` lives on the tap
 * subdocument (NOT the question record); `label` is a client-only display
 * cache the dialog strips before saving the tap.
 */
export type ExtraQuestionEntry = {
  question: string;
  points: number | null;
  label?: string;
};

export interface TapQuestionsSubformProps {
  /**
   * The question text. Owned by the dialog — a journal tap allows exactly ONE
   * question, and its questions-collection record is created/updated on the
   * tap's Save (not here).
   */
  value: string;
  onChange: (text: string) => void;
  /** True while the existing question's text is being resolved on edit-open. */
  loading?: boolean;
}

/**
 * Journal taps allow exactly one question. This is a single, always-open
 * textarea — no add/edit/delete affordances and no inline save. The text is
 * lifted to the dialog and persisted to the questions collection on tap Save.
 */
export function TapQuestionsSubform({
  value,
  onChange,
  loading,
}: TapQuestionsSubformProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor="tap-question"
        className="text-sm font-medium text-muted-foreground"
      >
        Question *
      </Label>
      <Textarea
        id="tap-question"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={loading}
        placeholder={loading ? "Loading question…" : "Question text…"}
        className="min-h-[80px] text-sm"
      />
    </div>
  );
}
