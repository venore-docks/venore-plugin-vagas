"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@venore/plugin-sdk/ui";
import type { PickableMedia } from "@venore/plugin-sdk/ui";
import type { FormTemplateRecord, JobCategoryRecord, JobRecord, TagCategory, TagItemRecord } from "../../contracts/types";
import { ConfirmCloseDialog } from "./confirm-close-dialog";
import { EditJobForm } from "./edit-job-form";

export function EditJobDialog({
  job,
  categories,
  tagCatalogs,
  templates,
  coverMedia,
  jobTagIds,
}: {
  job: JobRecord;
  categories: JobCategoryRecord[];
  tagCatalogs: Record<TagCategory, TagItemRecord[]>;
  templates: FormTemplateRecord[];
  coverMedia: PickableMedia | null;
  jobTagIds: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <ConfirmCloseDialog
      open={open}
      onOpenChange={setOpen}
      contentClassName="max-h-[85vh] w-full max-w-3xl sm:max-w-3xl overflow-y-auto"
      trigger={
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Editar ${job.title}`}>
            <Pencil className="size-4" />
          </Button>
        </DialogTrigger>
      }
    >
      <DialogHeader>
        <DialogTitle>Editar vaga</DialogTitle>
        <DialogDescription>{job.title}</DialogDescription>
      </DialogHeader>
      <EditJobForm
        job={job}
        categories={categories}
        tagCatalogs={tagCatalogs}
        templates={templates}
        coverMedia={coverMedia}
        jobTagIds={jobTagIds}
        onSuccess={() => setOpen(false)}
      />
    </ConfirmCloseDialog>
  );
}
