import { db } from "@venore/plugin-sdk";
import { vagasJobs } from "../../database/schema";
import { generateJobSlug } from "../../shared/generate-slug";
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
          publishedAt: new Date(),
          createdByUserId: command.actorId,
        })
        .returning();
      return row as JobRecord;
    } catch (cause) {
      const isUniqueViolation = cause instanceof Error && "code" in cause && (cause as { code?: string }).code === "23505";
      if (!isUniqueViolation || attempt === 4) throw cause;
    }
  }

  throw new Error("Não foi possível gerar um slug único para a vaga.");
}
