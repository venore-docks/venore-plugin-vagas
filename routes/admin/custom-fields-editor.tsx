"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@venore/plugin-sdk/ui";
import { APPLICATION_FIELD_TYPES } from "../../shared/application-fields";
import type { CustomApplicationField } from "../../contracts/types";

// Editor dos campos extras do formulário de candidatura, por vaga — o formulário básico (nome/
// e-mail/telefone) é fixo, isto só edita o que se soma a ele. Estado local + input hidden com JSON
// (mesmo padrão de MediaPickerField: componente client dentro de um <form> de server action, sem
// precisar de fetch/submit próprio).
export function CustomFieldsEditor({ name, initialFields = [] }: { name: string; initialFields?: CustomApplicationField[] }) {
  const [fields, setFields] = useState<CustomApplicationField[]>(initialFields);

  function addField() {
    setFields((current) => [
      ...current,
      { id: crypto.randomUUID(), label: "", type: "text", required: false },
    ]);
  }

  function updateField(id: string, patch: Partial<CustomApplicationField>) {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  }

  function removeField(id: string) {
    setFields((current) => current.filter((field) => field.id !== id));
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(fields)} />
      <p className="text-sm text-muted-foreground">Campos extras do formulário (opcional)</p>

      {fields.map((field) => (
        <div key={field.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2">
          <Input
            value={field.label}
            onChange={(event) => updateField(field.id, { label: event.target.value })}
            placeholder="Rótulo do campo"
            className="min-w-[10rem] flex-1"
          />
          <Select value={field.type} onValueChange={(value) => updateField(field.id, { type: value as CustomApplicationField["type"] })}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APPLICATION_FIELD_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.type === "select" && (
            <Input
              value={field.options?.join(", ") ?? ""}
              onChange={(event) =>
                updateField(field.id, { options: event.target.value.split(",").map((option) => option.trim()).filter(Boolean) })
              }
              placeholder="Opções separadas por vírgula"
              className="min-w-[12rem] flex-1"
            />
          )}
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(event) => updateField(field.id, { required: event.target.checked })}
            />
            Obrigatório
          </label>
          <Button type="button" variant="ghost" size="icon" aria-label="Remover campo" onClick={() => removeField(field.id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addField}>
        <Plus className="size-4" />
        Adicionar campo
      </Button>
    </div>
  );
}
