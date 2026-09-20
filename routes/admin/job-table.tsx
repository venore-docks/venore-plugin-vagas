import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@venore/plugin-sdk/ui";
import { Badge } from "@venore/plugin-sdk/ui";
import type { JobRecord } from "../../index";
import { DeleteJobButton } from "./delete-job-button";
import { EditJobDialog } from "./edit-job-dialog";

const STATUS_LABEL: Record<JobRecord["status"], string> = {
  open: "Aberta",
  paused: "Pausada",
  closed: "Fechada",
};

export function JobTable({ jobs }: { jobs: JobRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead className="hidden sm:table-cell">Área</TableHead>
          <TableHead className="hidden sm:table-cell">Local</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead className="w-24 text-right">Ações</TableHead>
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
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">{job.department ?? "—"}</TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">{job.location ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={job.status === "open" ? "default" : "secondary"}>{STATUS_LABEL[job.status]}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <EditJobDialog job={job} />
                <DeleteJobButton jobId={job.id} title={job.title} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
