import { Input } from "@venore/plugin-sdk/ui";
import { Textarea } from "@venore/plugin-sdk/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@venore/plugin-sdk/ui";
import { MediaPickerField, type PickableMedia } from "@venore/plugin-sdk/ui";
import { CustomFieldsEditor } from "./custom-fields-editor";
import type { CustomApplicationField, JobCategoryRecord } from "../../contracts/types";

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "open", label: "Aberta" },
  { value: "paused", label: "Pausada" },
  { value: "closed", label: "Fechada" },
];

const NO_CATEGORY_VALUE = "__none__";

// Campos compartilhados entre o form de criação e o de edição — mesmo nome de input nos dois, só
// o valor padrão muda. Mesmo padrão de venore-plugin-birthdays/routes/admin/birthday-fields.tsx.
export function JobFields({
  categories,
  defaultTitle = "",
  defaultDepartment = "",
  defaultLocation = "",
  defaultDescription = "",
  defaultRequirements = "",
  defaultApplyContact = "",
  defaultStatus = "open",
  defaultCategoryId = "",
  defaultCoverMedia = null,
  defaultCustomFormFields = [],
  defaultRequiresDisc = true,
}: {
  categories: JobCategoryRecord[];
  defaultTitle?: string;
  defaultDepartment?: string;
  defaultLocation?: string;
  defaultDescription?: string;
  defaultRequirements?: string;
  defaultApplyContact?: string;
  defaultStatus?: string;
  defaultCategoryId?: string;
  defaultCoverMedia?: PickableMedia | null;
  defaultCustomFormFields?: CustomApplicationField[];
  defaultRequiresDisc?: boolean;
}) {
  return (
    <>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Título da vaga
        <Input name="title" defaultValue={defaultTitle} placeholder="ex.: Analista de RH" required />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Área / departamento
          <Input name="department" defaultValue={defaultDepartment} placeholder="ex.: Recursos Humanos" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Local
          <Input name="location" defaultValue={defaultLocation} placeholder="ex.: Curitiba/PR — presencial" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Categoria (define a imagem de capa padrão)
        <Select name="categoryId" defaultValue={defaultCategoryId || NO_CATEGORY_VALUE}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_CATEGORY_VALUE}>Sem categoria</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <MediaPickerField name="coverMediaAssetId" label="Capa desta vaga (opcional — sobrescreve a da categoria)" initialMedia={defaultCoverMedia} />

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Descrição
        <Textarea name="description" defaultValue={defaultDescription} placeholder="descreva a vaga" rows={4} required />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Requisitos (opcional)
        <Textarea name="requirements" defaultValue={defaultRequirements} placeholder="requisitos da vaga" rows={3} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Contato para dúvidas (opcional)
          <Input name="applyContact" defaultValue={defaultApplyContact} placeholder="e-mail ou link" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Status
          <Select name="status" defaultValue={defaultStatus}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="requiresDisc" value="true" defaultChecked={defaultRequiresDisc} />
        Exigir Test DISC do candidato após a candidatura
      </label>

      <CustomFieldsEditor name="customFormFields" initialFields={defaultCustomFormFields} />
    </>
  );
}
