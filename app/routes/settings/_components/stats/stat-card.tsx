interface StatCardProps {
  value: string | number;
  label: string;
  suffix?: string;
}

export function StatCard({ value, label, suffix }: StatCardProps) {
  return (
    <div className="bg-primary/10 rounded-[24px] p-5 text-center flex flex-col justify-center min-h-[100px]">
      <p className="text-3xl font-serif text-foreground mb-1">
        {value}
        {suffix ? (
          <span className="text-lg text-muted-foreground">{suffix}</span>
        ) : null}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
