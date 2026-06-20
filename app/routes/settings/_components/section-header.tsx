interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{subtitle}</p>
    </div>
  );
}
