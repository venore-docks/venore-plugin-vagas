import { getMediaAssetForTrustedReview } from "@venore/plugin-sdk/media";
import { loadTests, type TestsBarrel } from "../../shared/tests-bridge";
import type { ApplicationRecord } from "../../contracts/types";
import { findApplicationsByJobId } from "./store";
import type { ApplicationAdminView, ListApplicationsInput, ListApplicationsResult } from "./types";

// getMediaAssetForTrustedReview é o bypass deliberado de visibilidade do core (currículo é sempre
// "private") — só chamado aqui porque o handler já checou vagas.applications.review antes. Ver
// venore-docks/.../get-media-asset/service.ts.
async function resolveResumeUrl(mediaAssetId: string | null): Promise<string | null> {
  if (!mediaAssetId) return null;
  const result = await getMediaAssetForTrustedReview({ id: mediaAssetId });
  return result.success && result.data ? result.data.url : null;
}

// listTestInstanceResultsExternal é o bypass equivalente do lado Testes (ver shared/tests-bridge.ts) —
// só o resumo de perfil (headline), não o dataset completo (suficiente pro RH bater o olho na tabela).
async function resolveDiscProfile(
  tests: TestsBarrel | null,
  application: ApplicationRecord,
): Promise<ApplicationAdminView["discProfile"]> {
  if (!tests || !application.discInstanceId) return null;
  const reports = await tests.listTestInstanceResultsExternal(application.discInstanceId);
  if (!reports.success || reports.data.results.length === 0) return null;
  const [report] = reports.data.results;
  return { profileKey: report.headline, profileKeySecondary: report.headlineSecondary ?? "" };
}

export async function listApplications(input: ListApplicationsInput): Promise<ListApplicationsResult> {
  const applications = await findApplicationsByJobId(input.jobId);
  const tests = await loadTests();

  const views = await Promise.all(
    applications.map(
      async (application): Promise<ApplicationAdminView> => ({
        ...application,
        resumeUrl: await resolveResumeUrl(application.resumeMediaAssetId),
        discProfile: await resolveDiscProfile(tests, application),
      }),
    ),
  );

  return { success: true, data: views };
}
