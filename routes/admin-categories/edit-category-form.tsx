"use client";

import { useActionState } from "react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import type { PickableMedia } from "@venore/plugin-sdk/ui";
import { updateJobCategoryAction, type VagasActionState } from "../admin/actions";
import { CategoryFields } from "./category-fields";
import type { JobCategoryRecord } from "../../contracts/types";

const initialState: VagasActionState = { error: null };

export function EditCategoryForm({
  category,
  coverMedia,
  onSuccess,
}: {
  category: JobCategoryRecord;
  coverMedia: PickableMedia | null;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateJobCategoryAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Categoria atualizada.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="categoryId" value={category.id} />
      <CategoryFields defaultName={category.name} defaultCoverMedia={coverMedia} />
      <Button type="submit" disabled={pending} className="w-full">
        Salvar
      </Button>
    </form>
  );
}
