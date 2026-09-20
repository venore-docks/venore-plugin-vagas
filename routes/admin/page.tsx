import { Briefcase } from "lucide-react";
import { listJobs } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied } from "@venore/plugin-sdk/ui";
import { AdminPageHeader } from "@venore/plugin-sdk/ui";
import { AdminStatTile } from "@venore/plugin-sdk/ui";
import { EmptyState } from "@venore/plugin-sdk/ui";
import { CreateJobDialog } from "./create-job-dialog";
import { JobTable } from "./job-table";

export default async function VagasAdminPage() {
  const gate = await getPluginAdminPageData("vagas");

  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver as vagas de emprego." />;
  }

  const result = await listJobs();
  if (!result.success) {
    return <p className="text-sm text-destructive">Erro ao carregar vagas: {result.error.message}</p>;
  }

  const jobs = result.data;
  const openCount = jobs.filter((job) => job.status === "open").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Vagas de emprego"
        description="Cadastro de vagas — vagas com status 'Aberta' aparecem em /vagas, sem login."
        actions={jobs.length > 0 && <CreateJobDialog />}
      />

      {jobs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <AdminStatTile label="Total" value={jobs.length} />
          <AdminStatTile label="Abertas" value={openCount} />
          <AdminStatTile label="Fechadas/pausadas" value={jobs.length - openCount} />
        </div>
      )}

      {jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="size-8" strokeWidth={1.5} />}
          title="Nenhuma vaga cadastrada"
          description="Cadastre a primeira vaga para começar a publicar em /vagas."
          action={<CreateJobDialog />}
        />
      ) : (
        <div className="rounded-panel border border-border bg-card">
          <JobTable jobs={jobs} />
        </div>
      )}
    </div>
  );
}
