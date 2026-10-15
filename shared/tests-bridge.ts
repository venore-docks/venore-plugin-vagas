import type { ComponentType } from "react";
import { importActivePluginBarrel } from "@venore/plugin-sdk";

// Dependência OPCIONAL `tests` (plugin Testes; manifest.dependencies). Contrato MÍNIMO — só os
// campos/funções que vagas usa — carregado por importActivePluginBarrel (plugin ausente/inativo ->
// null, a etapa DISC da candidatura some). Mesmo padrão de venore-plugin-academy/shared/donations-bridge.ts.
// Usa só a API GENÉRICA do Testes (docs/api-publica.md do plugin tests): se ela mudar esses campos, o
// build do vagas num checkout com o tests sincronizado quebra aqui — que é o ponto.
type OpResult<T> = { success: true; data: T } | { success: false; error: { code: string; message: string } };

// Módulo do Testes que a etapa de candidatura aplica.
export const VAGAS_TEST_MODULE_ID = "disc";

export type TestInstanceExternal = {
  id: string;
  shareSlug: string;
};

export type CreateTestInstanceExternalCommand = {
  testId: string;
  // Ambiente em que as respostas devem ser pensadas (rótulo da vaga).
  contextLabel: string;
  actorId: null;
  // Candidato de vaga: responde sem login, informando nome e e-mail, e NÃO vê o resultado (o RH vê).
  identityMode: "identified";
  showResultToParticipant: false;
  // Rota relativa pra onde o candidato volta depois de responder o teste.
  redirectUrl: string;
  // Idempotência: a mesma referência devolve a aplicação já criada.
  externalRef: string;
};

export type TestResultSummaryExternal = {
  id: string;
  headline: string;
  headlineSecondary: string | null;
  createdAt: Date;
};

export type TestInstanceResultsExternal = {
  results: TestResultSummaryExternal[];
};

// Subconjunto de TestResultView que o vagas lê; o objeto inteiro é repassado ao TestResultReport.
export type TestResultViewExternal = {
  id: string;
  testId: string;
  contextLabel: string;
  headline: string;
  headlineSecondary: string | null;
  createdAt: Date;
  [key: string]: unknown;
};

export type TestsBarrel = {
  createTestInstanceExternal: (command: CreateTestInstanceExternalCommand) => Promise<OpResult<TestInstanceExternal>>;
  listTestInstanceResultsExternal: (instanceId: string) => Promise<OpResult<TestInstanceResultsExternal>>;
  // Sem sessão e sem efeito colateral — nunca "reivindica" o resultado pra conta de quem chama.
  // Autorização é do vagas (vagas.applications.review), checada antes.
  getTestResultExternal: (resultId: string) => Promise<OpResult<TestResultViewExternal>>;
  getTestReportFooterText: () => Promise<string>;
  // Relatório embutível: folha do módulo + impressão A4 isolada do site.
  TestResultReport: ComponentType<{ result: TestResultViewExternal; footerText?: string }>;
};

export function loadTests(): Promise<TestsBarrel | null> {
  return importActivePluginBarrel<TestsBarrel>("tests");
}
