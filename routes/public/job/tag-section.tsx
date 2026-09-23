import { Badge } from "@venore/plugin-sdk/ui";

export function TagSection({ title, labels }: { title: string; labels: string[] }) {
  if (labels.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-caps text-muted-foreground">{title}</h2>
      <div className="flex flex-wrap gap-1.5">
        {labels.map((label) => (
          <Badge key={label} variant="secondary">
            {label}
          </Badge>
        ))}
      </div>
    </section>
  );
}
