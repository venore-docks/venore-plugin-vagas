import { notFound } from "next/navigation";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied } from "@venore/plugin-sdk/ui";
import { getApplicationDiscReport } from "../../index";
import { loadTests } from "../../shared/tests-bridge";
import { DiscReportPrintButton } from "./disc-report-print-button";

export const dynamic = "force-dynamic";

// O relatório é o do plugin Testes (TestResultReport): mesma folha do módulo DISC e mesma impressão A4
// isolada do site — o vagas não copia gráficos nem estilos de impressão. O cabeçalho abaixo é só da tela
// (candidato e vaga); o PDF sai apenas com a folha do relatório.
export default async function VagasApplicationDiscReportPage({
  params,
}: {
  params: Promise<{ jobId: string; applicationId: string }>;
}) {
  const gate = await getPluginAdminPageData("vagas");
  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver relatórios de candidatura." />;
  }

  const { applicationId } = await params;
  const data = await getApplicationDiscReport({ applicationId });
  const tests = await loadTests();
  if (!data.success || !tests) {
    notFound();
  }

  const { candidateName, jobTitle, result, footerText } = data.data;
  const TestResultReport = tests.TestResultReport;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Relatório DISC</h1>
          <p className="text-sm text-muted-foreground">
            {candidateName} — candidatura para {jobTitle}
          </p>
        </div>
        <DiscReportPrintButton />
      </div>

      <TestResultReport result={result} footerText={footerText} />
    </div>
  );
}
