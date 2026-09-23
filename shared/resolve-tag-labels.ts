import { findTagItemsByIdsPublic } from "../features/list-tag-items/store";
import type { JobRecord, TagCategory } from "../contracts/types";

export type ResolvedJobTags = {
  benefits: string[];
  knowledge: string[];
  skills: string[];
  attitudes: string[];
  activities: string[];
  contractRegimeLabel: string | null;
};

const EMPTY: ResolvedJobTags = { benefits: [], knowledge: [], skills: [], attitudes: [], activities: [], contractRegimeLabel: null };

// Resolve em UMA query os labels dos 5 grupos multi-seleção da vaga + o nome do regime de
// contratação (single-select) — mesmo espírito de resolve-cover-image.ts, mas usando o próprio
// campo `category` de cada TagItemRecord retornado pra agrupar, em vez de precisar do catálogo
// completo (findTagItemsByIdsPublic já filtra só o que a vaga usa).
export async function resolveJobTagLabels(job: JobRecord, flatJobTagIds: string[]): Promise<ResolvedJobTags> {
  const ids = job.contractRegimeId ? [...flatJobTagIds, job.contractRegimeId] : flatJobTagIds;
  if (ids.length === 0) return EMPTY;

  const items = await findTagItemsByIdsPublic(ids);
  const labelsByCategory: Record<TagCategory, string[]> = {
    benefit: [],
    knowledge: [],
    skill: [],
    attitude: [],
    activity: [],
    contract_regime: [],
  };
  for (const item of items) labelsByCategory[item.category].push(item.label);

  return {
    benefits: labelsByCategory.benefit,
    knowledge: labelsByCategory.knowledge,
    skills: labelsByCategory.skill,
    attitudes: labelsByCategory.attitude,
    activities: labelsByCategory.activity,
    contractRegimeLabel: labelsByCategory.contract_regime[0] ?? null,
  };
}
