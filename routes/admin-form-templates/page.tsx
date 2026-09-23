import Link from "next/link";
import { ArrowLeft, ListChecks } from "lucide-react";
import { listFormTemplates } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Button, EmptyState } from "@venore/plugin-sdk/ui";
import { CreateTemplateDialog, EditTemplateDialog } from "./template-dialogs";
import { DeleteTemplateButton } from "./delete-template-button";

export default async function VagasFormTemplatesAdminPage() {
  const gate = await getPluginAdminPageData("vagas");

  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver os templates de formulário." />;
  }

  const result = await listFormTemplates();
  if (!result.success) {
    return <p className="text-sm text-destructive">Erro ao carregar templates: {result.error.message}</p>;
  }

  const templates = result.data;

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/vagas">
          <ArrowLeft className="size-4" />
          Vagas de emprego
        </Link>
      </Button>

      <AdminPageHeader
        title="Templates de formulário"
        description="Ponto de partida reaproveitável pro formulário de candidatura — ao criar uma vaga, o RH pode carregar um template e ainda ajustar os campos só para aquela vaga."
        actions={templates.length > 0 && <CreateTemplateDialog />}
      />

      {templates.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="size-8" strokeWidth={1.5} />}
          title="Nenhum template cadastrado"
          description="Monte um template com os campos extras mais comuns pra reaproveitar entre vagas."
          action={<CreateTemplateDialog />}
        />
      ) : (
        <ul className="space-y-2">
          {templates.map((template) => (
            <li key={template.id} className="flex items-center justify-between gap-2 rounded-panel border border-border bg-card p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.fields.length} campo(s)</p>
              </div>
              <div className="flex gap-1">
                <EditTemplateDialog template={template} />
                <DeleteTemplateButton templateId={template.id} name={template.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
