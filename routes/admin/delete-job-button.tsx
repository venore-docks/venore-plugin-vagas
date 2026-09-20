"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { deleteJobAction, type VagasActionState } from "./actions";

const initialState: VagasActionState = { error: null };

export function DeleteJobButton({ jobId, title }: { jobId: string; title: string }) {
  const [state, formAction, pending] = useActionState(deleteJobAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `${title} removida.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover a vaga "${title}"?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="jobId" value={jobId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${title}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
