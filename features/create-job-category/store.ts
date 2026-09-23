import { db } from "@venore/plugin-sdk";
import { vagasJobCategories } from "../../database/schema";
import { generateSlug } from "../../shared/generate-slug";
import type { JobCategoryRecord } from "../../contracts/types";
import type { CreateJobCategoryCommand } from "./types";

// Mesma estratégia de retry por colisão de slug/key de features/create-job/store.ts.
export async function insertJobCategory(command: CreateJobCategoryCommand): Promise<JobCategoryRecord> {
  const baseSlug = generateSlug(command.name) || "categoria";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${crypto.randomUUID().slice(0, 6)}`;
    const slug = `${baseSlug}${suffix}`;

    try {
      const [row] = await db
        .insert(vagasJobCategories)
        .values({
          key: slug,
          slug,
          name: command.name.trim(),
          coverMediaAssetId: command.coverMediaAssetId || null,
        })
        .returning();
      return row as JobCategoryRecord;
    } catch (cause) {
      const isUniqueViolation = cause instanceof Error && "code" in cause && (cause as { code?: string }).code === "23505";
      if (!isUniqueViolation || attempt === 4) throw cause;
    }
  }

  throw new Error("Não foi possível gerar um slug único para a categoria.");
}
