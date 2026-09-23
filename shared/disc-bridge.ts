import { importActivePluginBarrel } from "@venore/plugin-sdk";

// Dependência OPCIONAL `disc` (manifest.dependencies). Contrato MÍNIMO — só os campos/funções que
// vagas usa — carregado por importActivePluginBarrel (plugin ausente/inativo -> null, a etapa
// DISC da candidatura some). Mesmo padrão de venore-plugin-academy/shared/donations-bridge.ts. Se
// o disc mudar esses campos, o build do vagas num checkout com disc sincronizado quebra aqui —
// que é o ponto.
type OpResult<T> = { success: true; data: T } | { success: false; error: { code: string; message: string } };

export type DiscInstanceExternal = {
  id: string;
  shareSlug: string;
};

export type CreateDiscInstanceExternalCommand = {
  environmentLabel: string;
  actorId: null;
  // Rota relativa pra onde o candidato volta depois de responder o teste — o test-runner do disc
  // faz router.push nisso + "?reportId=...".
  redirectUrl: string;
  externalRef: string;
};

export type DiscReportSummaryExternal = {
  id: string;
  profileKey: string;
  profileKeySecondary: string;
  createdAt: Date;
};

export type DiscAxisResultExternal = {
  profile: string;
  percentual: { d: number; i: number; s: number; c: number };
};

export type DiscProfileEntryExternal = { profile: string; description: string };

// Espelha DiscReportView (venore-plugin-disc/features/get-disc-report/types.ts) — usado pro
// "Baixar PDF" do relatório na candidatura (routes/admin-applications). getDiscReport (não
// getDiscReportHandler com claim) é público por design, sem sessão nem efeito colateral (ver
// venore-plugin-disc/features/get-disc-report/handler.ts) — nunca "reivindica" o relatório pra
// conta de quem chama, diferente de abrir /disc/r/:id direto logado como RH.
export type DiscReportViewExternal = {
  id: string;
  environmentLabel: string;
  dataset: { more: DiscAxisResultExternal; less: DiscAxisResultExternal; stress: number | "Carregando..." };
  createdAt: Date;
  moreProfile: DiscProfileEntryExternal | undefined;
  lessProfile: DiscProfileEntryExternal | undefined;
};

export type DiscBarrel = {
  createDiscInstanceExternal: (command: CreateDiscInstanceExternalCommand) => Promise<OpResult<DiscInstanceExternal>>;
  listInstanceReportsExternal: (instanceId: string) => Promise<OpResult<DiscReportSummaryExternal[]>>;
  getDiscReport: (query: { reportId: string }) => Promise<OpResult<DiscReportViewExternal>>;
};

export function loadDisc(): Promise<DiscBarrel | null> {
  return importActivePluginBarrel<DiscBarrel>("disc");
}
