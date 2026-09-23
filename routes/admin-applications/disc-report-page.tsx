import { notFound } from "next/navigation";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, Card, CardContent, CardHeader, CardTitle } from "@venore/plugin-sdk/ui";
import { getApplicationDiscReport } from "../../index";
import { DiscAxisBars } from "./disc-axis-bars";
import { DiscReportPrintButton } from "./disc-report-print-button";

export const dynamic = "force-dynamic";

// Mesmo mecanismo de PDF do resto do sistema (venore-plugin-disc/routes/disc-report/page.tsx):
// window.print() + classes print: — não um relatório gerado no servidor. Página própria (não a
// dialog de detalhe da candidatura) porque impressão de dentro de uma dialog Radix é inconsistente
// entre navegadores (position: fixed corta o que não está na viewport visível).
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
  const result = await getApplicationDiscReport({ applicationId });
  if (!result.success) {
    notFound();
  }

  const { candidateName, jobTitle, report } = result.data;
  const stressLabel = typeof report.dataset.stress === "number" ? `${report.dataset.stress}` : report.dataset.stress;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-8 print:gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Relatório DISC</h1>
          <p className="text-sm text-muted-foreground">
            {candidateName} — candidatura para {jobTitle}
          </p>
        </div>
        <DiscReportPrintButton />
      </div>

      <div className="hidden print:block">
        <h1 className="text-xl font-semibold">Relatório DISC — {candidateName}</h1>
        <p className="text-sm text-muted-foreground">
          Candidatura para {jobTitle} · Ambiente considerado: {report.environmentLabel}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 print:grid-cols-2 print:gap-3 lg:grid-cols-2">
        <Card className="lg:col-span-2 print:col-span-2">
          <CardHeader>
            <CardTitle>Perfil comportamental</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Autoimagem externa</p>
              <p className="text-lg font-semibold text-foreground">{(report.moreProfile?.profile ?? report.dataset.more.profile).toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">{report.moreProfile?.description}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Autoimagem interna</p>
              <p className="text-lg font-semibold text-foreground">{(report.lessProfile?.profile ?? report.dataset.less.profile).toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">{report.lessProfile?.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="print:text-sm">Autoimagem externa</CardTitle>
          </CardHeader>
          <CardContent className="print:text-xs">
            <DiscAxisBars percentual={report.dataset.more.percentual} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="print:text-sm">Autoimagem interna</CardTitle>
          </CardHeader>
          <CardContent className="print:text-xs">
            <DiscAxisBars percentual={report.dataset.less.percentual} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 print:col-span-2">
          <CardHeader>
            <CardTitle className="print:text-sm">Nível de tensão</CardTitle>
          </CardHeader>
          <CardContent className="print:text-xs">
            <p className="text-sm text-muted-foreground print:text-xs">
              Diferença entre a autoimagem externa e interna — quanto maior, mais distante o comportamento observável
              está do comportamento desejado.
            </p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{stressLabel}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
