"use client";

import { useActionState } from "react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { createJobAction, type VagasActionState } from "./actions";
import { JobFields } from "./job-fields";
import type { JobCategoryRecord } from "../../contracts/types";

const initialState: VagasActionState = { error: null };

export function CreateJobForm({ categories, onSuccess }: { categories: JobCategoryRecord[]; onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(createJobAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Vaga cadastrada.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      <JobFields categories={categories} />
      <Button type="submit" disabled={pending} className="w-full">
        Cadastrar
      </Button>
    </form>
  );
}
