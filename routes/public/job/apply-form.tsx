"use client";

import { useActionState } from "react";
import { Paperclip } from "lucide-react";
import { Button, Input, Textarea } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { submitApplicationAction, type ApplyActionState } from "./actions";
import type { CustomApplicationField } from "../../../contracts/types";

const initialState: ApplyActionState = { error: null };

function CustomField({ field }: { field: CustomApplicationField }) {
  const label = `${field.label}${field.required ? " *" : ""}`;

  if (field.type === "textarea") {
    return (
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        {label}
        <Textarea name={`custom:textarea:${field.id}`} required={field.required} rows={3} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        {label}
        <select
          name={`custom:select:${field.id}`}
          required={field.required}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none ui-motion-base focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione
          </option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name={`custom:checkbox:${field.id}`} value="true" required={field.required} />
        {label}
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1 text-sm text-muted-foreground">
      {label}
      <Input name={`custom:text:${field.id}`} required={field.required} />
    </label>
  );
}

export function ApplyForm({ jobId, customFormFields }: { jobId: string; customFormFields: CustomApplicationField[] }) {
  const [state, formAction, pending] = useActionState(submitApplicationAction, initialState);
  useActionToast({ pending, error: state.error });

  return (
    <form action={formAction} className="space-y-3 rounded-panel border border-border bg-card p-4">
      <input type="hidden" name="jobId" value={jobId} />

      <h2 className="text-sm font-semibold uppercase tracking-caps text-muted-foreground">Candidatar-se a esta vaga</h2>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Nome completo *
        <Input name="candidateName" required />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          E-mail *
          <Input type="email" name="candidateEmail" required />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Telefone
          <Input type="tel" name="candidatePhone" />
        </label>
      </div>

      {customFormFields.map((field) => (
        <CustomField key={field.id} field={field} />
      ))}

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Currículo (PDF) *
        <span className="flex items-center gap-2">
          <Paperclip className="size-4 shrink-0" />
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            required
            className="w-full text-sm text-foreground file:mr-2 file:rounded-lg file:border file:border-border file:bg-card file:px-2 file:py-1 file:text-xs file:font-medium"
          />
        </span>
      </label>

      <Button type="submit" disabled={pending} className="w-full">
        Enviar candidatura
      </Button>
    </form>
  );
}
