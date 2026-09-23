import { VAGAS_TAG_CATEGORIES } from "../database/schema";
import type { TagCategory, TagItemRecord } from "../contracts/types";

// Construído com reduce (não Object.fromEntries + cast) porque `as Record<TagCategory,
// TagItemRecord[]>` sobre o retorno de fromEntries falha o typecheck: TS infere um índice solto
// (`{ [k: string]: TagItemRecord[] }`) pro retorno genérico de fromEntries, que não tem overlap
// suficiente com o mapped type de chaves literais — quebrou o build de produção (ver git log).
// Função fábrica, não uma constante única — quem for MUTAR o resultado (ex:
// list-tag-items/service.ts empurrando itens por categoria) precisa de um objeto novo a cada
// chamada, nunca do singleton compartilhado abaixo.
export function buildEmptyTagCatalogs(): Record<TagCategory, TagItemRecord[]> {
  return VAGAS_TAG_CATEGORIES.reduce(
    (catalogs, category) => {
      catalogs[category] = [];
      return catalogs;
    },
    {} as Record<TagCategory, TagItemRecord[]>,
  );
}

// Só pra fallback de leitura (ex: listAllTagCatalogs() falhou, UI precisa de "algo" pra renderizar
// vazio) — nunca mutar isto diretamente, usar buildEmptyTagCatalogs() nesse caso.
export const EMPTY_TAG_CATALOGS: Record<TagCategory, TagItemRecord[]> = buildEmptyTagCatalogs();
