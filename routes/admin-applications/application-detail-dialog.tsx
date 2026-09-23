"use client";

import { useState } from "react";
import { Eye, FileText, FileDown } from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
import type { ApplicationAdminView } from "../../index";
import type { CustomApplicationField } from "../../contracts/types";

const STATUS_LABEL: Record<ApplicationAdminView["status"], string> = {
  submitted: "Recebida",
  awaiting_disc: "Aguardando DISC",
  completed: "Concluída",
};

function formatFieldAnswer(field: CustomApplicationField, value: string | boolean | undefined): string {
  if (value === undefined) return "—";
  if (field.type === "checkbox") return value === true ? "Sim" : "Não";
  return String(value).trim() || "—";
}

export function ApplicationDetailDialog({
  jobId,
  application,
  customFormFields,
}: {
  jobId: string;
  application: ApplicationAdminView;
  customFormFields: CustomApplicationField[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Ver candidatura de ${application.candidateName}`}>
          <Eye className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] w-full max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{application.candidateName}</DialogTitle>
          <DialogDescription>
            {application.candidateEmail}
            {application.candidatePhone && ` · ${application.candidatePhone}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={application.status === "completed" ? "default" : "secondary"}>
              {STATUS_LABEL[application.status]}
            </Badge>
            {application.resumeUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={application.resumeUrl} target="_blank" rel="noreferrer">
                  <FileText className="size-4" />
                  Ver currículo
                </a>
              </Button>
            )}
            {application.discReportId && (
              <Button variant="outline" size="sm" asChild>
                <a href={`/admin/vagas/${jobId}/candidaturas/${application.id}/relatorio-disc`} target="_blank" rel="noreferrer">
                  <FileDown className="size-4" />
                  Relatório DISC (PDF)
                </a>
              </Button>
            )}
          </div>

          {customFormFields.length > 0 && (
            <div className="space-y-3 rounded-panel border border-border bg-card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
                Respostas do formulário
              </h3>
              <dl className="space-y-2">
                {customFormFields.map((field) => (
                  <div key={field.id}>
                    <dt className="text-xs text-muted-foreground">{field.label}</dt>
                    <dd className="text-sm text-foreground">
                      {formatFieldAnswer(field, application.formResponses[field.id])}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {application.discProfile && (
            <div className="rounded-panel border border-border bg-card p-4 text-sm text-foreground">
              Perfil DISC: <span className="font-medium">{application.discProfile.profileKey}</span> /{" "}
              <span className="font-medium">{application.discProfile.profileKeySecondary}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
