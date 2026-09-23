"use client";

import { useActionState } from "react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { createJobCategoryAction, type VagasActionState } from "../admin/actions";
import { CategoryFields } from "./category-fields";

const initialState: VagasActionState = { error: null };

export function CreateCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(createJobCategoryAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Categoria cadastrada.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      <CategoryFields />
      <Button type="submit" disabled={pending} className="w-full">
        Cadastrar
      </Button>
    </form>
  );
}
