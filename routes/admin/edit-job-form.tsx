"use client";

import { useActionState } from "react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import type { PickableMedia } from "@venore/plugin-sdk/ui";
import { updateJobAction, type VagasActionState } from "./actions";
import { JobFields } from "./job-fields";
import { formatDateForInput } from "../../shared/format-date-input";
import { groupTagIdsByCategory } from "../../shared/group-job-tags";
import type { FormTemplateRecord, JobCategoryRecord, JobRecord, TagCategory, TagItemRecord } from "../../contracts/types";

const initialState: VagasActionState = { error: null };

export function EditJobForm({
  job,
  categories,
  tagCatalogs,
  templates,
  coverMedia,
  jobTagIds,
  onSuccess,
}: {
  job: JobRecord;
  categories: JobCategoryRecord[];
  tagCatalogs: Record<TagCategory, TagItemRecord[]>;
  templates: FormTemplateRecord[];
  coverMedia: PickableMedia | null;
  jobTagIds: string[];
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateJobAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Vaga atualizada.", onSuccess });

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="jobId" value={job.id} />
      <JobFields
        categories={categories}
        tagCatalogs={tagCatalogs}
        templates={templates}
        defaultTitle={job.title}
        defaultDepartment={job.department ?? ""}
        defaultLocation={job.location ?? ""}
        defaultDescription={job.description}
        defaultRequirements={job.requirements ?? ""}
        defaultApplyContact={job.applyContact ?? ""}
        defaultStatus={job.status}
        defaultCategoryId={job.categoryId ?? ""}
        defaultCoverMedia={coverMedia}
        defaultCustomFormFields={job.customFormFields}
        defaultRequiresDisc={job.requiresDisc}
        defaultDiscEnvironmentLabel={job.discEnvironmentLabel ?? ""}
        defaultSalaryType={job.salaryType}
        defaultSalaryAmount={job.salaryAmount ?? ""}
        defaultContractRegimeId={job.contractRegimeId ?? ""}
        defaultContractType={job.contractType}
        defaultScheduleType={job.scheduleType}
        defaultWeeklyHours={job.weeklyHours ?? ""}
        defaultDailyStartTime={job.dailyStartTime ?? ""}
        defaultDailyEndTime={job.dailyEndTime ?? ""}
        defaultScheduleWeekDays={job.scheduleWeekDays}
        defaultManagerEmail={job.managerEmail ?? ""}
        defaultClosesAt={formatDateForInput(job.closesAt)}
        defaultTagIdsByCategory={groupTagIdsByCategory(jobTagIds, tagCatalogs)}
      />
      <Button type="submit" disabled={pending} className="w-full">
        Salvar
      </Button>
    </form>
  );
}
