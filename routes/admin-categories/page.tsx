import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { listJobCategories } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Button, EmptyState } from "@venore/plugin-sdk/ui";
import { resolveMediaPickerValue } from "../../shared/resolve-media-picker-value";
import { CategoryTable } from "./category-table";
import { CreateCategoryDialog } from "./create-category-dialog";

export default async function VagasCategoriesAdminPage() {
  const gate = await getPluginAdminPageData("vagas");

  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver as categorias de vaga." />;
  }

  const result = await listJobCategories();
  if (!result.success) {
    return <p className="text-sm text-destructive">Erro ao carregar categorias: {result.error.message}</p>;
  }

  const categories = result.data;
  const coverMediaEntries = await Promise.all(
    categories.map(async (category) => [category.id, await resolveMediaPickerValue(category.coverMediaAssetId)] as const),
  );
  const coverMediaByCategoryId = new Map(coverMediaEntries);

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/vagas">
          <ArrowLeft className="size-4" />
          Vagas de emprego
        </Link>
      </Button>

      <AdminPageHeader
        title="Categorias de vaga"
        description="Cada categoria define a imagem de capa padrão herdada pelas vagas dela — a vaga pode sobrescrever com uma capa própria."
        actions={categories.length > 0 && <CreateCategoryDialog />}
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={<Tag className="size-8" strokeWidth={1.5} />}
          title="Nenhuma categoria cadastrada"
          description="Cadastre categorias como 'Pedagógico' ou 'Administrativo' para dar uma capa padrão às vagas."
          action={<CreateCategoryDialog />}
        />
      ) : (
        <div className="rounded-panel border border-border bg-card">
          <CategoryTable categories={categories} coverMediaByCategoryId={coverMediaByCategoryId} />
        </div>
      )}
    </div>
  );
}
