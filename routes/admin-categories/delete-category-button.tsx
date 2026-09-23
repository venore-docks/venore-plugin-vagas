"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { deleteJobCategoryAction, type VagasActionState } from "../admin/actions";

const initialState: VagasActionState = { error: null };

export function DeleteCategoryButton({ categoryId, name }: { categoryId: string; name: string }) {
  const [state, formAction, pending] = useActionState(deleteJobCategoryAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `${name} removida.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover a categoria "${name}"?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="categoryId" value={categoryId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${name}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
