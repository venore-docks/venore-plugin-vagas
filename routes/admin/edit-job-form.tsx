"use client";

import { useActionState } from "react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { updateJobAction, type VagasActionState } from "./actions";
import { JobFields } from "./job-fields";
import type { JobRecord } from "../../index";

const initialState: VagasActionState = { error: null };

export function EditJobForm({ job, onSuccess }: { job: JobRecord; onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(updateJobAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Vaga atualizada.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="jobId" value={job.id} />
      <JobFields
        defaultTitle={job.title}
        defaultDepartment={job.department ?? ""}
        defaultLocation={job.location ?? ""}
        defaultDescription={job.description}
        defaultRequirements={job.requirements ?? ""}
        defaultApplyContact={job.applyContact ?? ""}
        defaultStatus={job.status}
      />
      <Button type="submit" disabled={pending} className="w-full">
        Salvar
      </Button>
    </form>
  );
}
