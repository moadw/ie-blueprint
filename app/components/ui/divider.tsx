export interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex-1 h-px bg-border" />
      {label ? (
        <>
          <span className="text-[13px] text-muted-foreground">{label}</span>
          <span className="flex-1 h-px bg-border" />
        </>
      ) : null}
    </div>
  );
}
