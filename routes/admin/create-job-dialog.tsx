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
import type { JobCategoryRecord } from "../../contracts/types";

export function CreateJobDialog({ categories }: { categories: JobCategoryRecord[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nova vaga
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova vaga</DialogTitle>
          <DialogDescription>Cadastre uma vaga de emprego para publicar em /vagas.</DialogDescription>
        </DialogHeader>
        <CreateJobForm categories={categories} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
