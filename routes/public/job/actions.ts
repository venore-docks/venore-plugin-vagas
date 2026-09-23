"use server";

import { redirect } from "next/navigation";
import { isPluginActive } from "@venore/plugin-sdk";
import { submitApplication } from "../../../index";

export type ApplyActionState = { error: string | null };

// Campos dinâmicos do form vêm nomeados "custom:<tipo>:<fieldId>" (ver apply-form.tsx) — o tipo no
// nome evita ambiguidade entre "" (texto vazio) e "não marcado" (checkbox ausente do FormData),
// sem precisar buscar a vaga de novo aqui só pra saber o tipo de cada campo.
function readFormResponses(formData: FormData): Record<string, string | boolean> {
  const responses: Record<string, string | boolean> = {};
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("custom:") || value instanceof File) continue;
    const [, kind, fieldId] = key.split(":");
    if (!fieldId) continue;
    responses[fieldId] = kind === "checkbox" ? true : value;
  }
  return responses;
}

export async function submitApplicationAction(_prevState: ApplyActionState, formData: FormData): Promise<ApplyActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: "O plugin Vagas de emprego está desabilitado." };
  }

  const resume = formData.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return { error: "Anexe seu currículo em PDF." };
  }

  const result = await submitApplication({
    jobId: String(formData.get("jobId") ?? ""),
    candidateName: String(formData.get("candidateName") ?? ""),
    candidateEmail: String(formData.get("candidateEmail") ?? ""),
    candidatePhone: String(formData.get("candidatePhone") ?? "") || undefined,
    formResponses: readFormResponses(formData),
    resume: {
      filename: resume.name,
      contentType: resume.type || "application/pdf",
      size: resume.size,
      data: Buffer.from(await resume.arrayBuffer()),
    },
  });

  if (!result.success) {
    return { error: result.error.message };
  }

  // redirect() lança internamente — nunca retorna, a navegação assume a partir daqui (mesmo
  // padrão de test-runner.tsx no disc, mas server-side: aqui dá pra redirecionar direto porque
  // a candidatura não depende de nenhum estado só existente no browser).
  redirect(result.data.nextUrl);
}
