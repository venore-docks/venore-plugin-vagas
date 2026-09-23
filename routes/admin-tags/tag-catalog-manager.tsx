"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge, Button, Input } from "@venore/plugin-sdk/ui";
import { createTagItemAction, deleteTagItemAction, updateTagItemAction } from "../admin/actions";
import { TAG_CATEGORY_LABELS } from "../../shared/tag-categories";
import { VAGAS_TAG_CATEGORIES } from "../../database/schema";
import type { TagCategory, TagItemRecord } from "../../contracts/types";

function TagItemRow({ item, onRenamed, onDeleted }: { item: TagItemRecord; onRenamed: (label: string) => void; onDeleted: () => void }) {
  const [label, setLabel] = useState(item.label);
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("tagItemId", item.id);
      formData.set("label", label);
      const result = await updateTagItemAction({ error: null }, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setEditing(false);
      onRenamed(label);
    });
  }

  function remove() {
    if (!window.confirm(`Remover "${item.label}"? Vagas que usam este item perdem a marcação, sem impedimento.`)) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("tagItemId", item.id);
      const result = await deleteTagItemAction({ error: null }, formData);
      if (!result.error) onDeleted();
    });
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border p-2">
      {editing ? (
        <>
          <Input value={label} onChange={(event) => setLabel(event.target.value)} className="h-8 flex-1 text-sm" autoFocus />
          <Button type="button" size="sm" disabled={isPending} onClick={save}>
            Salvar
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
            Cancelar
          </Button>
        </>
      ) : (
        <>
          <button type="button" onClick={() => setEditing(true)} className="flex-1 text-left text-sm text-foreground hover:underline">
            {item.label}
          </button>
          <Button type="button" variant="ghost" size="icon" disabled={isPending} aria-label={`Remover ${item.label}`} onClick={remove}>
            <Trash2 className="size-4" />
          </Button>
        </>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function TagCatalogManager({ catalogs }: { catalogs: Record<TagCategory, TagItemRecord[]> }) {
  const [category, setCategory] = useState<TagCategory>(VAGAS_TAG_CATEGORIES[0]);
  const [items, setItems] = useState(catalogs);
  const [newLabel, setNewLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function addItem() {
    if (newLabel.trim().length === 0) return;
    startTransition(async () => {
      const result = await createTagItemAction({ category, label: newLabel.trim() });
      if (!result.success) {
        setError(result.error.message);
        return;
      }
      setError(null);
      setNewLabel("");
      setItems((current) => ({
        ...current,
        [category]: [...current[category], result.data].sort((a, b) => a.label.localeCompare(b.label)),
      }));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {VAGAS_TAG_CATEGORIES.map((option) => (
          <button key={option} type="button" onClick={() => setCategory(option)}>
            <Badge variant={category === option ? "default" : "secondary"}>{TAG_CATEGORY_LABELS[option]}</Badge>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={newLabel}
          onChange={(event) => setNewLabel(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder={`Novo item em "${TAG_CATEGORY_LABELS[category]}"...`}
          className="max-w-sm"
        />
        <Button type="button" disabled={isPending} onClick={addItem}>
          <Plus className="size-4" />
          Adicionar
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="space-y-2">
        {items[category].length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum item cadastrado em "{TAG_CATEGORY_LABELS[category]}" ainda.</p>
        ) : (
          items[category].map((item) => (
            <TagItemRow
              key={item.id}
              item={item}
              onRenamed={(label) =>
                setItems((current) => ({
                  ...current,
                  [category]: current[category].map((entry) => (entry.id === item.id ? { ...entry, label } : entry)),
                }))
              }
              onDeleted={() =>
                setItems((current) => ({ ...current, [category]: current[category].filter((entry) => entry.id !== item.id) }))
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
