import Link from "next/link";
import { Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@venore/plugin-sdk/ui";
import { Badge, Button } from "@venore/plugin-sdk/ui";
import type { PickableMedia } from "@venore/plugin-sdk/ui";
import type { JobCategoryRecord, JobRecord } from "../../contracts/types";
import { DeleteJobButton } from "./delete-job-button";
import { EditJobDialog } from "./edit-job-dialog";

const STATUS_LABEL: Record<JobRecord["status"], string> = {
  open: "Aberta",
  paused: "Pausada",
  closed: "Fechada",
};

export function JobTable({
  jobs,
  categories,
  coverMediaByJobId,
}: {
  jobs: JobRecord[];
  categories: JobCategoryRecord[];
  coverMediaByJobId: Map<string, PickableMedia | null>;
}) {
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead className="hidden sm:table-cell">Área</TableHead>
          <TableHead className="hidden sm:table-cell">Local</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead className="w-40 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium text-foreground">
              {job.title}
              <p className="text-xs text-muted-foreground sm:hidden">
                {[job.department, job.location].filter(Boolean).join(" · ")}
              </p>
              {job.categoryId && categoryNameById.has(job.categoryId) && (
                <p className="text-xs text-muted-foreground">{categoryNameById.get(job.categoryId)}</p>
              )}
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">{job.department ?? "—"}</TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">{job.location ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={job.status === "open" ? "default" : "secondary"}>{STATUS_LABEL[job.status]}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" aria-label={`Candidaturas de ${job.title}`} asChild>
                  <Link href={`/admin/vagas/${job.id}/candidaturas`}>
                    <Users className="size-4" />
                  </Link>
                </Button>
                <EditJobDialog job={job} categories={categories} coverMedia={coverMediaByJobId.get(job.id) ?? null} />
                <DeleteJobButton jobId={job.id} title={job.title} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
