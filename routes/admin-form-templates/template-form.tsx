"use client";

import { useActionState } from "react";
import { Button, Input } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { createFormTemplateAction, updateFormTemplateAction, type VagasActionState } from "../admin/actions";
import { CustomFieldsEditor } from "../admin/custom-fields-editor";
import type { FormTemplateRecord } from "../../contracts/types";

const initialState: VagasActionState = { error: null };

export function TemplateForm({ template, onSuccess }: { template?: FormTemplateRecord; onSuccess?: () => void }) {
  const action = template ? updateFormTemplateAction : createFormTemplateAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  useActionToast({ pending, error: state.error, successMessage: template ? "Template atualizado." : "Template cadastrado.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      {template && <input type="hidden" name="templateId" value={template.id} />}
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Nome do template
        <Input name="name" defaultValue={template?.name ?? ""} placeholder="ex.: Formulário padrão — pedagógico" required />
      </label>
      <CustomFieldsEditor name="customFormFields" initialFields={template?.fields ?? []} />
      <Button type="submit" disabled={pending} className="w-full">
        {template ? "Salvar" : "Cadastrar"}
      </Button>
    </form>
  );
}
