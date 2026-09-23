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
import type { JobCategoryRecord } from "../../contracts/types";
import { EditCategoryForm } from "./edit-category-form";

export function EditCategoryDialog({ category, coverMedia }: { category: JobCategoryRecord; coverMedia: PickableMedia | null }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Editar ${category.name}`}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar categoria</DialogTitle>
          <DialogDescription>{category.name}</DialogDescription>
        </DialogHeader>
        <EditCategoryForm category={category} coverMedia={coverMedia} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
