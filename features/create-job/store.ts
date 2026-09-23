import { db } from "@venore/plugin-sdk";
import { vagasJobs } from "../../database/schema";
import { generateJobSlug } from "../../shared/generate-slug";
import { syncJobTags } from "../../shared/job-tags";
import type { JobRecord } from "../../contracts/types";
import type { CreateJobCommand } from "./types";

// Colisão de slug (dois títulos iguais) resolve com um sufixo curto — mais simples do que pedir
// pro RH escolher slug manualmente, e não precisa de round-trip extra pra checar disponibilidade
// antes do insert.
export async function insertJob(command: CreateJobCommand): Promise<JobRecord> {
  const baseSlug = generateJobSlug(command.title) || "vaga";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

    try {
      const [row] = await db
        .insert(vagasJobs)
        .values({
          title: command.title.trim(),
          slug,
          department: command.department?.trim() || null,
          location: command.location?.trim() || null,
          description: command.description.trim(),
          requirements: command.requirements?.trim() || null,
          applyContact: command.applyContact?.trim() || null,
          status: command.status ?? "open",
          categoryId: command.categoryId || null,
          coverMediaAssetId: command.coverMediaAssetId || null,
          customFormFields: command.customFormFields ?? [],
          requiresDisc: command.requiresDisc ?? true,
          discEnvironmentLabel: command.discEnvironmentLabel?.trim() || null,
          salaryType: command.salaryType ?? "negotiable",
          salaryAmount: command.salaryAmount || null,
          contractRegimeId: command.contractRegimeId || null,
          contractType: command.contractType ?? null,
          scheduleType: command.scheduleType ?? "weekly_hours",
          weeklyHours: command.weeklyHours || null,
          dailyStartTime: command.dailyStartTime || null,
          dailyEndTime: command.dailyEndTime || null,
          scheduleWeekDays: command.scheduleWeekDays ?? [],
          managerEmail: command.managerEmail?.trim() || null,
          closesAt: command.closesAt ?? null,
          publishedAt: new Date(),
          createdByUserId: command.actorId,
        })
        .returning();

      const allTagIds = [
        ...(command.benefitIds ?? []),
        ...(command.knowledgeIds ?? []),
        ...(command.skillIds ?? []),
        ...(command.attitudeIds ?? []),
        ...(command.activityIds ?? []),
      ];
      if (allTagIds.length > 0) await syncJobTags(row.id, allTagIds);

      return row as JobRecord;
    } catch (cause) {
      const isUniqueViolation = cause instanceof Error && "code" in cause && (cause as { code?: string }).code === "23505";
      if (!isUniqueViolation || attempt === 4) throw cause;
    }
  }

  throw new Error("Não foi possível gerar um slug único para a vaga.");
}
