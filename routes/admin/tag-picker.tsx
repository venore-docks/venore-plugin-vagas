"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@venore/plugin-sdk/ui";
import { createTagItemAction } from "./actions";
import type { TagCategory, TagItemRecord } from "../../contracts/types";

// "novo item" chama a mesma action tanto no modo multi quanto single — cadastra no catálogo
// compartilhado (vagas.tag_items) e já marca/seleciona o item recém-criado, sem sair do form da
// vaga (pedido explícito: RH cadastra item novo no mesmo formulário da vaga, sem precisar navegar
// pra /admin/vagas/listas primeiro).
function useCreateTagItem(category: TagCategory, onCreated: (item: TagItemRecord) => void) {
  const [isPending, startTransition] = useTransition();
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (label.trim().length === 0) return;
    startTransition(async () => {
      const result = await createTagItemAction({ category, label: label.trim() });
      if (!result.success) {
        setError(result.error.message);
        return;
      }
      setError(null);
      setLabel("");
      onCreated(result.data);
    });
  }

  return { label, setLabel, submit, isPending, error };
}

export function TagMultiPicker({
  name,
  category,
  items,
  defaultSelectedIds = [],
}: {
  name: string;
  category: TagCategory;
  items: TagItemRecord[];
  defaultSelectedIds?: string[];
}) {
  const [catalog, setCatalog] = useState(items);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(defaultSelectedIds));
  const create = useCreateTagItem(category, (item) => {
    setCatalog((current) => [...current, item].sort((a, b) => a.label.localeCompare(b.label)));
    setSelectedIds((current) => new Set(current).add(item.id));
  });

  function toggle(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify([...selectedIds])} />
      <div className="flex flex-wrap gap-1.5">
        {catalog.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <Badge variant={selectedIds.has(item.id) ? "default" : "secondary"}>{item.label}</Badge>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={create.label}
          onChange={(event) => create.setLabel(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              create.submit();
            }
          }}
          placeholder="Novo item..."
          className="h-8 max-w-[12rem] text-xs"
        />
        <Button type="button" variant="outline" size="sm" disabled={create.isPending} onClick={create.submit}>
          <Plus className="size-3.5" />
          Adicionar
        </Button>
      </div>
      {create.error && <p className="text-xs text-destructive">{create.error}</p>}
    </div>
  );
}

const NO_SELECTION_VALUE = "__none__";

export function TagSinglePicker({
  name,
  category,
  items,
  defaultValue = "",
}: {
  name: string;
  category: TagCategory;
  items: TagItemRecord[];
  defaultValue?: string;
}) {
  const [catalog, setCatalog] = useState(items);
  const [selected, setSelected] = useState(defaultValue || NO_SELECTION_VALUE);
  const create = useCreateTagItem(category, (item) => {
    setCatalog((current) => [...current, item].sort((a, b) => a.label.localeCompare(b.label)));
    setSelected(item.id);
  });

  return (
    <div className="flex items-center gap-2">
      <Select name={name} value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_SELECTION_VALUE}>Não informado</SelectItem>
          {catalog.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        value={create.label}
        onChange={(event) => create.setLabel(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            create.submit();
          }
        }}
        placeholder="Novo..."
        className="h-9 max-w-[9rem] text-xs"
      />
      <Button type="button" variant="outline" size="sm" disabled={create.isPending} onClick={create.submit}>
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
