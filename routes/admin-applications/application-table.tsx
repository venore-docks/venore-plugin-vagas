import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@venore/plugin-sdk/ui";
import type { ApplicationAdminView } from "../../index";
import { SyncDiscButton } from "./sync-disc-button";

const STATUS_LABEL: Record<ApplicationAdminView["status"], string> = {
  submitted: "Recebida",
  awaiting_disc: "Aguardando DISC",
  completed: "Concluída",
};

const STATUS_VARIANT: Record<ApplicationAdminView["status"], "default" | "secondary"> = {
  submitted: "secondary",
  awaiting_disc: "secondary",
  completed: "default",
};

export function ApplicationTable({ jobId, applications }: { jobId: string; applications: ApplicationAdminView[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Candidato</TableHead>
          <TableHead className="hidden sm:table-cell">Currículo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden sm:table-cell">Perfil DISC</TableHead>
          <TableHead className="w-40 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium text-foreground">
              {application.candidateName}
              <p className="text-xs text-muted-foreground">{application.candidateEmail}</p>
              {application.candidatePhone && <p className="text-xs text-muted-foreground">{application.candidatePhone}</p>}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {application.resumeUrl ? (
                <Link
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-foreground hover:underline"
                >
                  <FileText className="size-4" />
                  Ver
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[application.status]}>{STATUS_LABEL[application.status]}</Badge>
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
              {application.discProfile
                ? `${application.discProfile.profileKey} / ${application.discProfile.profileKeySecondary}`
                : "—"}
            </TableCell>
            <TableCell className="text-right">
              {application.status === "awaiting_disc" && <SyncDiscButton jobId={jobId} applicationId={application.id} />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
