import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { isPluginActive } from "@venore/plugin-sdk";
import { syncApplicationDiscStatus } from "../../../index";

export const dynamic = "force-dynamic";

// Fecha o laço candidatura<->DISC: o test-runner do disc faz router.push aqui depois que o
// candidato termina o teste (redirectUrl criado em features/submit-application/service.ts). Sem
// reportId na query também funciona — sync é idempotente e só reflete o que já existir pra essa
// instância (ver features/sync-application-disc-status).
export default async function VagasApplicationConfirmationPage({
  params,
}: {
  params: Promise<{ slug: string; applicationId: string }>;
}) {
  if (!(await isPluginActive("vagas"))) {
    notFound();
  }

  const { slug, applicationId } = await params;
  const result = await syncApplicationDiscStatus({ applicationId });
  if (!result.success) {
    notFound();
  }

  const application = result.data;

  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <CheckCircle2 className="mx-auto size-10 text-primary" />
      <h1 className="text-xl font-semibold tracking-tight text-foreground">Candidatura recebida!</h1>
      <p className="text-sm text-muted-foreground">
        Obrigado, {application.candidateName.split(" ")[0]}. Recebemos sua candidatura e seu currículo.
        {application.status === "completed" && application.discReportId && " Seu Test DISC também foi registrado."}
        {application.status === "awaiting_disc" &&
          " Ainda não recebemos o resultado do seu Test DISC — se você concluiu o teste, aguarde alguns instantes e atualize esta página."}
      </p>
      <Button variant="outline" asChild>
        <Link href={`/vagas/${slug}`}>Voltar para a vaga</Link>
      </Button>
    </div>
  );
}
