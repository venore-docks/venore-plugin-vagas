import Link from "next/link";
import { Briefcase } from "lucide-react";
import type { PublicJobView } from "../../index";

export function VagasPublicList({ jobs }: { jobs: PublicJobView[] }) {
  if (jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">Não há vagas abertas no momento.</p>;
  }

  return (
    <ul className="space-y-3">
      {jobs.map((job) => (
        <li key={job.id} className="rounded-panel border border-border bg-card p-4">
          <Link href={`/vagas/${job.slug}`} className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <Briefcase className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground hover:underline">{job.title}</p>
              {(job.department || job.location) && (
                <p className="text-xs text-muted-foreground">{[job.department, job.location].filter(Boolean).join(" · ")}</p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
