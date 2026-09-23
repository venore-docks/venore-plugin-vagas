import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listAllTagCatalogs } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Button } from "@venore/plugin-sdk/ui";
import { VAGAS_TAG_CATEGORIES } from "../../database/schema";
import { TagCatalogManager } from "./tag-catalog-manager";
import type { TagCategory, TagItemRecord } from "../../contracts/types";

const EMPTY_CATALOGS = Object.fromEntries(VAGAS_TAG_CATEGORIES.map((category) => [category, []])) as Record<
  TagCategory,
  TagItemRecord[]
>;

export default async function VagasTagsAdminPage() {
  const gate = await getPluginAdminPageData("vagas");

  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver as listas de vagas." />;
  }

  const result = await listAllTagCatalogs();
  const catalogs = result.success ? result.data : EMPTY_CATALOGS;

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/vagas">
          <ArrowLeft className="size-4" />
          Vagas de emprego
        </Link>
      </Button>

      <AdminPageHeader
        title="Listas pré-definidas"
        description="Benefícios, conhecimento, habilidades, atitudes, atividades e regime de contratação — um catálogo único, reaproveitado por todas as vagas."
      />

      <div className="rounded-panel border border-border bg-card p-4">
        <TagCatalogManager catalogs={catalogs} />
      </div>
    </div>
  );
}
