import { VAGAS_TAG_CATEGORIES } from "../database/schema";
import type { TagCategory } from "../contracts/types";

export const TAG_CATEGORY_LABELS: Record<TagCategory, string> = {
  benefit: "Benefícios",
  knowledge: "Conhecimento",
  skill: "Habilidades",
  attitude: "Atitudes",
  activity: "Atividades",
  contract_regime: "Regime de contratação",
};

// Regime de contratação é o único single-select (FK direta jobs.contractRegimeId) — os outros 5
// são multi-seleção via vagas.job_tags. Ver database/schema/index.ts.
export const SINGLE_SELECT_TAG_CATEGORY: TagCategory = "contract_regime";

export function isTagCategory(value: string): value is TagCategory {
  return (VAGAS_TAG_CATEGORIES as readonly string[]).includes(value);
}
