"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { deleteFormTemplateAction, type VagasActionState } from "../admin/actions";

const initialState: VagasActionState = { error: null };

export function DeleteTemplateButton({ templateId, name }: { templateId: string; name: string }) {
  const [state, formAction, pending] = useActionState(deleteFormTemplateAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `${name} removido.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover o template "${name}"? Vagas que já usaram este template como ponto de partida não são afetadas.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="templateId" value={templateId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${name}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
