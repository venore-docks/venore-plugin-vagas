import { Briefcase } from "lucide-react";
import { listPublicJobsHandler as listPublicJobs } from "../features/list-public-jobs/handler";
import type { BlockRendererProps } from "@venore/plugin-sdk";
import { hasRichTextContent, renderRichTextContent, RICH_TEXT_INLINE_CLASSES } from "@venore/plugin-sdk/page-builder";
import { cn } from "@venore/plugin-sdk/ui";

function readString(data: Record<string, unknown>, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readLimit(data: Record<string, unknown>, fallback: number): number {
  const value = data.limit;
  return typeof value === "number" && value > 0 ? value : fallback;
}

export async function VagasOpenPositionsBlock({ block }: BlockRendererProps) {
  const title = readString(block.data, "title", "Vagas abertas");
  const description = block.data.description;
  const emptyMessage = hasRichTextContent(block.data.emptyMessage)
    ? block.data.emptyMessage
    : "Não há vagas abertas no momento.";
  const limit = readLimit(block.data, 6);

  const result = await listPublicJobs();
  // Handler é público (sem auth) — um erro aqui é de infraestrutura, não de permissão. Bloco some
  // em vez de quebrar a página, mesmo padrão de BirthdaysMonthListBlock.
  if (!result.success) {
    return null;
  }

  const openJobs = result.data.slice(0, limit);

  return (
    <div className="rounded-panel border border-border bg-card p-4 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {hasRichTextContent(description) && (
          <div className={cn("mt-1 text-sm text-muted-foreground", RICH_TEXT_INLINE_CLASSES)}>{renderRichTextContent(description)}</div>
        )}
      </div>

      {openJobs.length === 0 ? (
        <div className={cn("mt-4 text-sm text-muted-foreground", RICH_TEXT_INLINE_CLASSES)}>{renderRichTextContent(emptyMessage)}</div>
      ) : (
        <ul className="mt-4 space-y-2">
          {openJobs.map((job) => (
            <li key={job.id} className="flex items-center gap-3 rounded-panel p-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                <Briefcase className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <a href={`/vagas/${job.slug}`} className="truncate text-sm font-medium text-foreground hover:underline">
                  {job.title}
                </a>
                {(job.department || job.location) && (
                  <p className="truncate text-xs text-muted-foreground">
                    {[job.department, job.location].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
