"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@venore/plugin-sdk/ui";
import { ConfirmCloseDialog } from "./confirm-close-dialog";
import { CreateJobForm } from "./create-job-form";
import type { FormTemplateRecord, JobCategoryRecord, TagCategory, TagItemRecord } from "../../contracts/types";

export function CreateJobDialog({
  categories,
  tagCatalogs,
  templates,
}: {
  categories: JobCategoryRecord[];
  tagCatalogs: Record<TagCategory, TagItemRecord[]>;
  templates: FormTemplateRecord[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <ConfirmCloseDialog
      open={open}
      onOpenChange={setOpen}
      contentClassName="max-h-[85vh] w-full max-w-3xl sm:max-w-3xl overflow-y-auto"
      trigger={
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4" />
            Nova vaga
          </Button>
        </DialogTrigger>
      }
    >
      <DialogHeader>
        <DialogTitle>Nova vaga</DialogTitle>
        <DialogDescription>Cadastre uma vaga de emprego para publicar em /vagas.</DialogDescription>
      </DialogHeader>
      <CreateJobForm categories={categories} tagCatalogs={tagCatalogs} templates={templates} onSuccess={() => setOpen(false)} />
    </ConfirmCloseDialog>
  );
}
