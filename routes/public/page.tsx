import { notFound } from "next/navigation";
import { isPluginActive } from "@venore/plugin-sdk";
import { listPublicJobs } from "../../index";
import { VagasPublicList } from "./vagas-public-list";

// Sem gate de autenticação — listagem de vagas é pública, por pedido explícito do cliente
// (PORTAL-COLABORADOR-FEM.md §6.5). Único gate é o de plugin ativo, mesmo padrão de
// venore-plugin-birthdays/routes/public/page.tsx.
export default async function VagasPublicPage() {
  if (!(await isPluginActive("vagas"))) {
    notFound();
  }

  const result = await listPublicJobs();
  const jobs = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vagas de emprego</h1>
        <p className="text-sm text-muted-foreground">Oportunidades abertas na Fundação Educacional Menonita.</p>
      </div>
      <VagasPublicList jobs={jobs} />
    </div>
  );
}
