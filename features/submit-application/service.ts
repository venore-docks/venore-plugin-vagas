import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { uploadReservedCategoryAssetPublic } from "@venore/plugin-sdk/media";
import { findMissingRequiredField } from "../../shared/application-fields";
import { loadDisc } from "../../shared/disc-bridge";
import { findOpenJobById, insertApplication, markApplicationAwaitingDisc } from "./store";
import type { SubmitApplicationInput, SubmitApplicationResult } from "./types";

// "Caixote" reservado de mídia pro currículo — genérico (não amarra a chave a FEM/Cobim), sempre
// private (uploadReservedCategoryAssetPublic nunca nasce público). Ver
// venore-docks/src/contexts/media/get-or-create-reserved-category.ts.
const RESUME_CATEGORY_KEY = "vagas.applications";
const RESUME_CATEGORY_NAME = "Currículos de candidatura (vagas)";

function confirmationUrl(jobSlug: string, applicationId: string): string {
  return `/vagas/${jobSlug}/candidatura/${applicationId}/concluido`;
}

export async function submitApplication(input: SubmitApplicationInput): Promise<SubmitApplicationResult> {
  const handle = beginOperation({
    useCase: "vagas.submit-application",
    actor: { id: "anonymous", type: "system" },
    kind: "write",
  });

  const job = await findOpenJobById(input.jobId);
  if (!job) {
    const error = { code: "vagas.not_found", message: "Vaga não encontrada ou não está mais aberta." };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  const missingField = findMissingRequiredField(job.customFormFields, input.formResponses);
  if (missingField) {
    const error = { code: "vagas.missing_required_field", message: `Preencha o campo "${missingField.label}".` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  // Sem sessão (candidato nunca loga) — só o upload público resolve isso, ver
  // venore-docks/.../upload-reserved-category-asset/handler-public.ts.
  const uploaded = await uploadReservedCategoryAssetPublic({
    filename: input.resume.filename,
    contentType: input.resume.contentType,
    size: input.resume.size,
    data: input.resume.data,
    categoryKey: RESUME_CATEGORY_KEY,
    categoryName: RESUME_CATEGORY_NAME,
    allowedMimeCategories: ["document"],
  });
  if (!uploaded.success) {
    endOperation(handle, uploaded);
    return uploaded;
  }

  const application = await insertApplication({
    jobId: job.id,
    candidateName: input.candidateName.trim(),
    candidateEmail: input.candidateEmail.trim(),
    candidatePhone: input.candidatePhone?.trim() || null,
    resumeMediaAssetId: uploaded.data.id,
    formResponses: input.formResponses,
  });

  if (!job.requiresDisc) {
    endOperation(handle, { success: true });
    return { success: true, data: { application, nextUrl: confirmationUrl(job.slug, application.id) } };
  }

  const disc = await loadDisc();
  if (!disc) {
    // Vaga pede DISC mas o plugin não está instalado nesta instância — degrada com dignidade
    // (candidatura já está registrada), mesmo espírito de toda dependência opcional na plataforma.
    endOperation(handle, { success: true });
    return { success: true, data: { application, nextUrl: confirmationUrl(job.slug, application.id) } };
  }

  const instance = await disc.createDiscInstanceExternal({
    environmentLabel: job.title,
    actorId: null,
    redirectUrl: confirmationUrl(job.slug, application.id),
    externalRef: `vagas:${application.id}`,
  });
  if (!instance.success) {
    // Falha ao criar a instância DISC não derruba a candidatura já registrada — RH consegue
    // reparar manualmente depois (status fica "submitted", sem discInstanceId).
    endOperation(handle, { success: true });
    return { success: true, data: { application, nextUrl: confirmationUrl(job.slug, application.id) } };
  }

  const updated = await markApplicationAwaitingDisc(application.id, instance.data.id);

  endOperation(handle, { success: true });
  return { success: true, data: { application: updated, nextUrl: `/disc/teste?slug=${instance.data.shareSlug}` } };
}
