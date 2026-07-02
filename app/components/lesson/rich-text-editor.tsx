import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Read-only: hides the formatting toolbar and disables editing. The seeded
   *  `value` still renders so a saved entry can be reviewed. */
  readOnly?: boolean;
}

/**
 * Minimal contentEditable rich-text editor. Rebuilt from the prototype's
 * `SimpleRichTextEditor` (visual reference only). Toolbar buttons toggle
 * inline formatting via the legacy `document.execCommand` API; alignment
 * buttons use `justify{Left,Center,Right}`. Pure UI — the HTML string is held
 * in parent state, never persisted at this stage.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your reflection...",
  readOnly = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("strikethrough"))
        formats.add("strikethrough");
    } catch {
      // queryCommandState can throw in some browsers — ignore.
    }
    setActiveFormats(formats);
  }, []);

  // Seed the editor's initial HTML once (uncontrolled body, controlled value).
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  // Reflect toolbar active state as the caret moves across already-typed text.
  useEffect(() => {
    const handleSelectionChange = () => {
      const el = editorRef.current;
      if (
        el &&
        (document.activeElement === el || el.contains(document.activeElement))
      ) {
        updateActiveFormats();
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateActiveFormats]);

  const execCommand = useCallback(
    (command: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false);
      handleInput();
    },
    [handleInput],
  );

  return (
    <div className="overflow-hidden rounded-xl">
      {/* Toolbar — hidden in read-only mode (nothing to format). */}
      {!readOnly ? (
      <div className="flex items-center gap-1 border-b border-white/10 bg-white/5 px-3 py-2">
        <ToolbarButton
          icon={Bold}
          title="Bold"
          active={activeFormats.has("bold")}
          onTrigger={() => execCommand("bold")}
        />
        <ToolbarButton
          icon={Italic}
          title="Italic"
          active={activeFormats.has("italic")}
          onTrigger={() => execCommand("italic")}
        />
        <ToolbarButton
          icon={Strikethrough}
          title="Strikethrough"
          active={activeFormats.has("strikethrough")}
          onTrigger={() => execCommand("strikethrough")}
        />

        <div className="mx-2 h-5 w-px bg-white/20" />

        <ToolbarButton
          icon={AlignLeft}
          title="Align left"
          onTrigger={() => execCommand("justifyLeft")}
        />
        <ToolbarButton
          icon={AlignCenter}
          title="Align center"
          onTrigger={() => execCommand("justifyCenter")}
        />
        <ToolbarButton
          icon={AlignRight}
          title="Align right"
          onTrigger={() => execCommand("justifyRight")}
        />
      </div>
      ) : null}

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-readonly={readOnly}
        aria-label="Reflection"
        onInput={readOnly ? undefined : handleInput}
        onKeyUp={readOnly ? undefined : updateActiveFormats}
        onClick={readOnly ? undefined : updateActiveFormats}
        data-placeholder={placeholder}
        className={`max-h-[280px] min-h-[160px] overflow-y-auto bg-white/5 p-4 font-sans text-base text-white/90 outline-none empty:before:text-white/40 empty:before:content-[attr(data-placeholder)] [&_*]:outline-none${
          readOnly ? " cursor-default" : ""
        }`}
      />
    </div>
  );
}

interface ToolbarButtonProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  active?: boolean;
  onTrigger: () => void;
}

function ToolbarButton({
  icon: Icon,
  title,
  active = false,
  onTrigger,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      // onMouseDown (preventDefault) keeps the editor selection alive.
      onMouseDown={(e) => {
        e.preventDefault();
        onTrigger();
      }}
      className={`flex h-8 w-8 items-center justify-center rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        active
          ? "bg-white/25 text-white"
          : "text-white/70 hover:bg-white/20 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
