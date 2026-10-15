import type { OperationResult } from "@venore/plugin-sdk";
import type { TestResultViewExternal } from "../../shared/tests-bridge";

export type ApplicationDiscReportView = {
  candidateName: string;
  jobTitle: string;
  // Resultado do plugin Testes — renderizado pelo TestResultReport dele (não se duplica o relatório aqui).
  result: TestResultViewExternal;
  // Rodapé configurado no admin do plugin Testes.
  footerText: string;
};

export type GetApplicationDiscReportInput = { applicationId: string };
export type GetApplicationDiscReportResult = OperationResult<ApplicationDiscReportView>;
