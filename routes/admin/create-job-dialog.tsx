"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nova vaga
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova vaga</DialogTitle>
          <DialogDescription>Cadastre uma vaga de emprego para publicar em /vagas.</DialogDescription>
        </DialogHeader>
        <CreateJobForm categories={categories} tagCatalogs={tagCatalogs} templates={templates} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
