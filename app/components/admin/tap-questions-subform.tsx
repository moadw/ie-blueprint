import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/toast";
import { env } from "~/lib/env";
import { gqlClient } from "~/lib/graphql";
import { QuestionsFindManyDocument } from "~/queries/questions";
import {
  QuestionsCreateOneDocument,
  QuestionsUpdateOneDocument,
} from "~/mutations/questions";

/**
 * One entry of the tap's `extraQuestions` subdocument array.
 * `question` is the questions-collection record id; `points` lives on the
 * tap subdocument (NOT the question record); `label` is a client-only
 * display cache that the dialog strips before saving the tap.
 */
export type ExtraQuestionEntry = {
  question: string;
  points: number | null;
  label?: string;
};

export interface TapQuestionsSubformProps {
  value: ExtraQuestionEntry[];
  onChange: (value: ExtraQuestionEntry[]) => void;
}

function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function payloadErrorMessage(payload: unknown): string | null {
  const err = (
    payload as { error?: { message?: string } | null } | null | undefined
  )?.error;
  return err?.message ?? null;
}

export function TapQuestionsSubform({
  value,
  onChange,
}: TapQuestionsSubformProps) {
  // Resolved question texts keyed by record id, for prefilled entries that
  // carry only an id. The query has no limit/skip args — fetch the
  // platform's questions and match ids client-side.
  const [resolved, setResolved] = useState<Record<string, string>>({});
  const [resolveStarted, setResolveStarted] = useState(false);

  const [adding, setAdding] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [draftPoints, setDraftPoints] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editPoints, setEditPoints] = useState("");
  const [updating, setUpdating] = useState(false);

  const needsResolution = value.some((entry) => entry.label == null);

  useEffect(() => {
    if (!needsResolution || resolveStarted) return;
    let cancelled = false;
    setResolveStarted(true);
    gqlClient
      .request(QuestionsFindManyDocument, {
        filter: { platform: env.PLATFORM },
      })
      .then((data) => {
        if (cancelled) return;
        const map: Record<string, string> = {};
        for (const row of data.QuestionsFindMany ?? []) {
          if (row?._id && row.label) map[row._id] = row.label;
        }
        setResolved(map);
      })
      .catch(() => {
        /* unresolved ids fall back to the raw-id rendering below */
      });
    return () => {
      cancelled = true;
    };
  }, [needsResolution, resolveStarted]);

  function displayText(entry: ExtraQuestionEntry): string | undefined {
    return entry.label ?? resolved[entry.question];
  }

  function resetDraft() {
    setDraftText("");
    setDraftPoints("");
    setAdding(false);
  }

  async function handleCreate() {
    const text = draftText.trim();
    if (!text || creating) return;
    setCreating(true);
    try {
      // Only the question text + platform are ever written to the
      // questions record; points stay on the tap subdocument.
      const data = await gqlClient.request(QuestionsCreateOneDocument, {
        record: { label: text, platform: env.PLATFORM },
      });
      const payload = data.QuestionsCreateOne;
      const message = payloadErrorMessage(payload);
      if (message) throw new Error(message);
      const recordId = payload?.recordId ?? payload?.record?._id;
      if (!recordId) throw new Error("Question record was not created");
      onChange([
        ...value,
        {
          question: recordId,
          points: parseOptionalNumber(draftPoints),
          label: text,
        },
      ]);
      toast.success("Question added");
      resetDraft();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add question",
      );
    } finally {
      setCreating(false);
    }
  }

  function startEdit(index: number) {
    const entry = value[index];
    if (!entry) return;
    setEditingIndex(index);
    setEditText(displayText(entry) ?? "");
    setEditPoints(entry.points != null ? String(entry.points) : "");
  }

  function cancelEdit() {
    if (updating) return;
    setEditingIndex(null);
  }

  async function handleUpdate() {
    if (editingIndex == null || updating) return;
    const entry = value[editingIndex];
    if (!entry) return;
    const text = editText.trim();
    if (!text) return;
    setUpdating(true);
    try {
      // Text changes persist immediately on the question record; points
      // changes are tap-side only and persist when the tap is saved.
      if (text !== displayText(entry)) {
        const data = await gqlClient.request(QuestionsUpdateOneDocument, {
          _id: entry.question,
          record: { label: text },
        });
        const message = payloadErrorMessage(data.QuestionsUpdateOne);
        if (message) throw new Error(message);
        toast.success("Question updated");
      }
      onChange(
        value.map((item, i) =>
          i === editingIndex
            ? {
                ...item,
                label: text,
                points: parseOptionalNumber(editPoints),
              }
            : item,
        ),
      );
      setEditingIndex(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update question",
      );
    } finally {
      setUpdating(false);
    }
  }

  function handleRemove(index: number) {
    // Drops the tap's extraQuestions entry only — question records have no
    // delete mutation and orphans are acceptable.
    if (editingIndex === index) setEditingIndex(null);
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Questions</p>
        {!adding ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAdding(true)}
            className="h-7 px-2 text-xs text-stone-500 hover:text-stone-700"
          >
            <Plus className="h-3 w-3" />
            Add question
          </Button>
        ) : null}
      </div>

      {value.length === 0 && !adding ? (
        <p className="text-xs text-stone-400">No questions yet.</p>
      ) : null}

      {value.map((entry, index) => {
        const text = displayText(entry);
        if (editingIndex === index) {
          return (
            <div
              key={`${entry.question}-${index}`}
              className="space-y-3 rounded-lg border border-stone-200 bg-stone-50/40 p-3"
            >
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor={`tap-question-edit-${index}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  Question *
                </Label>
                <Textarea
                  id={`tap-question-edit-${index}`}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  required
                  className="min-h-[60px] text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor={`tap-question-edit-points-${index}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  Points
                </Label>
                <Input
                  id={`tap-question-edit-points-${index}`}
                  type="number"
                  min={0}
                  step="any"
                  value={editPoints}
                  onChange={(e) => setEditPoints(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={updating}
                  disabled={updating || !editText.trim()}
                  onClick={handleUpdate}
                >
                  Save
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div
            key={`${entry.question}-${index}`}
            className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50/40 p-3"
          >
            <div className="min-w-0 flex-1">
              {text ? (
                <p className="text-sm text-foreground">{text}</p>
              ) : (
                <>
                  <p className="truncate font-mono text-xs text-foreground">
                    {entry.question}
                  </p>
                  <p className="text-xs text-stone-400">
                    Question text unavailable
                  </p>
                </>
              )}
              <p className="mt-0.5 text-xs text-stone-400">
                {entry.points != null ? `${entry.points} pts` : "No points"}
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => startEdit(index)}
                aria-label="Edit question"
                className="h-7 w-7 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                aria-label="Remove question"
                className="h-7 w-7 text-stone-400 hover:bg-stone-100 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}

      {adding ? (
        <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50/40 p-3">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="tap-question-new"
              className="text-xs font-medium text-muted-foreground"
            >
              Question *
            </Label>
            <Textarea
              id="tap-question-new"
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              required
              autoFocus
              placeholder="Question text…"
              className="min-h-[60px] text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="tap-question-new-points"
              className="text-xs font-medium text-muted-foreground"
            >
              Points
            </Label>
            <Input
              id="tap-question-new-points"
              type="number"
              min={0}
              step="any"
              value={draftPoints}
              onChange={(e) => setDraftPoints(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDraft}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={creating}
              disabled={creating || !draftText.trim()}
              onClick={handleCreate}
            >
              Save
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
