"use client";

import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
import { ApplyForm } from "./apply-form";
import { estimateApplicationMinutes } from "../../../shared/estimate-application-minutes";
import type { CustomApplicationField } from "../../../contracts/types";

// "Quero me candidatar" avisa etapas + tempo total ANTES de abrir o formulário (pedido explícito
// — o Test DISC tem 20 perguntas, candidato precisa saber o que está assumindo antes de começar).
// started fica em estado local: o form só nasce depois do candidato confirmar no modal.
export function ApplyCta({
  jobId,
  customFormFields,
  requiresDisc,
  closed,
}: {
  jobId: string;
  customFormFields: CustomApplicationField[];
  requiresDisc: boolean;
  closed: boolean;
}) {
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);

  if (closed) {
    return (
      <div className="rounded-panel border border-border bg-card p-4 text-center text-sm text-muted-foreground">
        Prazo de candidatura encerrado para esta vaga.
      </div>
    );
  }

  if (started) {
    return <ApplyForm jobId={jobId} customFormFields={customFormFields} />;
  }

  const totalMinutes = estimateApplicationMinutes(customFormFields.length, requiresDisc);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Quero me candidatar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Antes de começar</DialogTitle>
          <DialogDescription>O processo tem estas etapas — reserve um tempinho pra fazer tudo de uma vez.</DialogDescription>
        </DialogHeader>

        <ol className="space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            Preencher seus dados (nome, e-mail{customFormFields.length > 0 ? " e mais alguns campos" : ""})
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            Anexar seu currículo em PDF
          </li>
          {requiresDisc && (
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              Responder o Test DISC (20 perguntas)
            </li>
          )}
        </ol>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4" />
          Tempo total estimado: ~{totalMinutes} minutos
        </p>

        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            setOpen(false);
            setStarted(true);
          }}
        >
          Continuar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
