import { getMediaAssetForTrustedReview } from "@venore/plugin-sdk/media";
import { loadDisc, type DiscBarrel } from "../../shared/disc-bridge";
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

// listInstanceReportsExternal é o bypass equivalente do lado disc (ver shared/disc-bridge.ts) —
// só o resumo de perfil, não o dataset completo (suficiente pro RH bater o olho na tabela).
async function resolveDiscProfile(
  disc: DiscBarrel | null,
  application: ApplicationRecord,
): Promise<ApplicationAdminView["discProfile"]> {
  if (!disc || !application.discInstanceId) return null;
  const reports = await disc.listInstanceReportsExternal(application.discInstanceId);
  if (!reports.success || reports.data.length === 0) return null;
  const [report] = reports.data;
  return { profileKey: report.profileKey, profileKeySecondary: report.profileKeySecondary };
}

export async function listApplications(input: ListApplicationsInput): Promise<ListApplicationsResult> {
  const applications = await findApplicationsByJobId(input.jobId);
  const disc = await loadDisc();

  const views = await Promise.all(
    applications.map(
      async (application): Promise<ApplicationAdminView> => ({
        ...application,
        resumeUrl: await resolveResumeUrl(application.resumeMediaAssetId),
        discProfile: await resolveDiscProfile(disc, application),
      }),
    ),
  );

  return { success: true, data: views };
}
