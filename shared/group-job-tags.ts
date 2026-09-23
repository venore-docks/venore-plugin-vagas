import type { TagCategory, TagItemRecord } from "../contracts/types";

// Função pura (sem db) — safe pra "use client" (edit-job-form.tsx) e pra código server. Agrupa uma
// lista solta de tagItemIds por categoria, dado o catálogo completo — usado tanto pro form de
// edição (pré-selecionar cada um dos 5 TagPicker) quanto pra resolução pública (labels por grupo).
// Ignora 'contract_regime' de propósito (single-select, resolvido à parte por
// jobs.contractRegimeId, nunca aparece em job_tags).
export function groupTagIdsByCategory(
  tagItemIds: string[],
  catalogs: Record<TagCategory, TagItemRecord[]>,
): Record<Exclude<TagCategory, "contract_regime">, string[]> {
  const idSet = new Set(tagItemIds);
  const result = {} as Record<Exclude<TagCategory, "contract_regime">, string[]>;
  for (const category of ["benefit", "knowledge", "skill", "attitude", "activity"] as const) {
    result[category] = catalogs[category].filter((item) => idSet.has(item.id)).map((item) => item.id);
  }
  return result;
}
