import type { OperationResult } from "@venore/plugin-sdk";
import { createJob } from "../features/create-job/service";
import { listJobs } from "../features/list-jobs/service";

// Seed de dados de exemplo do plugin (platform/plugin-engine/plugin-seed-registry.ts) — rodado
// via /admin/plugins. Chama service.ts direto (não o handler via barrel): não existe sessão/ator
// autenticado neste caminho — mesmo racional de venore-plugin-birthdays/seeds/example.ts.
const SEED_ACTOR_ID = "system-seed";

const EXAMPLE_JOBS = [
  {
    title: "Analista de Recursos Humanos",
    department: "Recursos Humanos",
    location: "Curitiba/PR — presencial",
    description: "Apoiar processos de recrutamento, integração e administração de pessoal da FEM.",
    requirements: "Experiência prévia em RH; conhecimento de rotinas de admissão e desligamento.",
    applyContact: "rh@fem.edu.br",
  },
  {
    title: "Professor(a) de Educação Física",
    department: "Colégio Erasto Gaertner",
    location: "Curitiba/PR — presencial",
    description: "Ministrar aulas de Educação Física para o Ensino Fundamental e Médio.",
    requirements: "Licenciatura em Educação Física; registro no CREF.",
    applyContact: "vagas@fem.edu.br",
  },
  {
    title: "Assistente Administrativo — Faculdade Fidelis",
    department: "Faculdade Fidelis",
    location: "Curitiba/PR — presencial",
    description: "Apoiar a secretaria acadêmica em rotinas de matrícula e atendimento a alunos.",
    requirements: "Ensino médio completo; boa comunicação e organização.",
    applyContact: "vagas@fem.edu.br",
  },
];

// Idempotente: pula quem já existe pelo título — rodar 2x não duplica.
export async function seedVagasExample(): Promise<OperationResult<void>> {
  const existing = await listJobs();
  if (!existing.success) {
    return { success: false, error: existing.error };
  }
  const existingTitles = new Set(existing.data.map((job) => job.title));

  for (const entry of EXAMPLE_JOBS) {
    if (existingTitles.has(entry.title)) continue;
    const created = await createJob({ ...entry, actorId: SEED_ACTOR_ID });
    if (!created.success) {
      return { success: false, error: created.error };
    }
  }

  return { success: true, data: undefined };
}
