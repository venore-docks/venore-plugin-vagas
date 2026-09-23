import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { listApplications, listJobs } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Button, EmptyState } from "@venore/plugin-sdk/ui";
import { ApplicationTable } from "./application-table";

export default async function VagasApplicationsAdminPage({ params }: { params: Promise<{ jobId: string }> }) {
  const gate = await getPluginAdminPageData("vagas");

  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver as candidaturas." />;
  }

  const { jobId } = await params;

  const [jobsResult, applicationsResult] = await Promise.all([listJobs(), listApplications({ jobId })]);
  const job = jobsResult.success ? jobsResult.data.find((entry) => entry.id === jobId) : undefined;
  if (!job) {
    notFound();
  }

  if (!applicationsResult.success) {
    if (applicationsResult.error.code.startsWith("rbac.authorization.")) {
      return <AdminAccessDenied message="Você não tem permissão para ver candidaturas e currículos." />;
    }
    return <p className="text-sm text-destructive">Erro ao carregar candidaturas: {applicationsResult.error.message}</p>;
  }

  const applications = applicationsResult.data;

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/vagas">
          <ArrowLeft className="size-4" />
          Vagas de emprego
        </Link>
      </Button>

      <AdminPageHeader title={`Candidaturas — ${job.title}`} description="Currículos e respostas recebidas para esta vaga." />

      {applications.length === 0 ? (
        <EmptyState icon={<Users className="size-8" strokeWidth={1.5} />} title="Nenhuma candidatura ainda" description="Assim que alguém se candidatar por /vagas, a candidatura aparece aqui." />
      ) : (
        <div className="rounded-panel border border-border bg-card">
          <ApplicationTable jobId={jobId} applications={applications} customFormFields={job.customFormFields} />
        </div>
      )}
    </div>
  );
}
