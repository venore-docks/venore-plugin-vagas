"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
import type { PickableMedia } from "@venore/plugin-sdk/ui";
import type { FormTemplateRecord, JobCategoryRecord, JobRecord, TagCategory, TagItemRecord } from "../../contracts/types";
import { confirmBeforeClose } from "./dialog-confirm-close";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Editar ${job.title}`}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto"
        onPointerDownOutside={confirmBeforeClose}
        onEscapeKeyDown={confirmBeforeClose}
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
      </DialogContent>
    </Dialog>
  );
}
