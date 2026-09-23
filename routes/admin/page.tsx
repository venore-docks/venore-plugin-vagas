import Link from "next/link";
import { Briefcase, Tag } from "lucide-react";
import { listJobCategories, listJobs } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied } from "@venore/plugin-sdk/ui";
import { AdminPageHeader } from "@venore/plugin-sdk/ui";
import { AdminStatTile } from "@venore/plugin-sdk/ui";
import { Button } from "@venore/plugin-sdk/ui";
import { EmptyState } from "@venore/plugin-sdk/ui";
import { resolveMediaPickerValue } from "../../shared/resolve-media-picker-value";
import { CreateJobDialog } from "./create-job-dialog";
import { JobTable } from "./job-table";

export default async function VagasAdminPage() {
  const gate = await getPluginAdminPageData("vagas");

  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver as vagas de emprego." />;
  }

  const [result, categoriesResult] = await Promise.all([listJobs(), listJobCategories()]);
  if (!result.success) {
    return <p className="text-sm text-destructive">Erro ao carregar vagas: {result.error.message}</p>;
  }
  const categories = categoriesResult.success ? categoriesResult.data : [];

  const jobs = result.data;
  const openCount = jobs.filter((job) => job.status === "open").length;

  const coverMediaEntries = await Promise.all(
    jobs.map(async (job) => [job.id, await resolveMediaPickerValue(job.coverMediaAssetId)] as const),
  );
  const coverMediaByJobId = new Map(coverMediaEntries);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Vagas de emprego"
        description="Cadastro de vagas — vagas com status 'Aberta' aparecem em /vagas, sem login."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/vagas/categorias">
                <Tag className="size-4" />
                Categorias
              </Link>
            </Button>
            {jobs.length > 0 && <CreateJobDialog categories={categories} />}
          </div>
        }
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
          action={<CreateJobDialog categories={categories} />}
        />
      ) : (
        <div className="rounded-panel border border-border bg-card">
          <JobTable jobs={jobs} categories={categories} coverMediaByJobId={coverMediaByJobId} />
        </div>
      )}
    </div>
  );
}
