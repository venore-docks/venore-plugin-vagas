import { getMediaAsset } from "@venore/plugin-sdk/media";
import { findJobCategoriesByIds } from "../features/list-job-categories/store";
import type { JobRecord } from "../contracts/types";

// Capa efetiva = job.coverMediaAssetId (override) OU category.coverMediaAssetId (padrão herdado)
// — resolvido em lote pra listagem pública não disparar 1 query de mídia por vaga. getMediaAsset
// já tolera asset apagado/sem visibility "public" (devolve null) — vaga sem capa não quebra nada,
// só renderiza sem imagem.
export async function resolveCoverImageUrls(jobs: JobRecord[]): Promise<Map<string, string | null>> {
  const categoryIds = [...new Set(jobs.map((job) => job.categoryId).filter((id): id is string => Boolean(id)))];
  const categories = await findJobCategoriesByIds(categoryIds);
  const categoryCoverById = new Map(categories.map((category) => [category.id, category.coverMediaAssetId]));

  function effectiveMediaId(job: JobRecord): string | null {
    return job.coverMediaAssetId ?? (job.categoryId ? (categoryCoverById.get(job.categoryId) ?? null) : null);
  }

  const mediaIds = [...new Set(jobs.map(effectiveMediaId).filter((id): id is string => Boolean(id)))];

  const urlByMediaId = new Map<string, string>();
  await Promise.all(
    mediaIds.map(async (id) => {
      const result = await getMediaAsset({ id });
      if (result.success && result.data) urlByMediaId.set(id, result.data.url);
    }),
  );

  const urlsByJobId = new Map<string, string | null>();
  for (const job of jobs) {
    const mediaId = effectiveMediaId(job);
    urlsByJobId.set(job.id, mediaId ? (urlByMediaId.get(mediaId) ?? null) : null);
  }
  return urlsByJobId;
}
