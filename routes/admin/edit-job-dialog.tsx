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
import type { JobRecord } from "../../index";
import { EditJobForm } from "./edit-job-form";

export function EditJobDialog({ job }: { job: JobRecord }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Editar ${job.title}`}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar vaga</DialogTitle>
          <DialogDescription>{job.title}</DialogDescription>
        </DialogHeader>
        <EditJobForm job={job} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
