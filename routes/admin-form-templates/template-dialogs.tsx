"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
import { TemplateForm } from "./template-form";
import type { FormTemplateRecord } from "../../contracts/types";

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Novo template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo template de formulário</DialogTitle>
          <DialogDescription>Monte os campos extras — o RH escolhe este template como ponto de partida ao criar uma vaga.</DialogDescription>
        </DialogHeader>
        <TemplateForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export function EditTemplateDialog({ template }: { template: FormTemplateRecord }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Editar ${template.name}`}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar template</DialogTitle>
          <DialogDescription>{template.name}</DialogDescription>
        </DialogHeader>
        <TemplateForm template={template} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
