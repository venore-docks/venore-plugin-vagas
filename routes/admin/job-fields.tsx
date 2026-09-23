import { Input } from "@venore/plugin-sdk/ui";
import { Textarea } from "@venore/plugin-sdk/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@venore/plugin-sdk/ui";
import { MediaPickerField, type PickableMedia } from "@venore/plugin-sdk/ui";
import { CustomFieldsEditor } from "./custom-fields-editor";
import { ScheduleFields } from "./schedule-fields";
import { TagMultiPicker, TagSinglePicker } from "./tag-picker";
import { TAG_CATEGORY_LABELS } from "../../shared/tag-categories";
import type {
  ContractType,
  CustomApplicationField,
  FormTemplateRecord,
  JobCategoryRecord,
  SalaryType,
  ScheduleType,
  TagCategory,
  TagItemRecord,
  WeekDay,
} from "../../contracts/types";

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "open", label: "Aberta" },
  { value: "paused", label: "Pausada" },
  { value: "closed", label: "Fechada" },
];

const SALARY_TYPE_OPTIONS: Array<{ value: SalaryType; label: string }> = [
  { value: "fixed", label: "Valor fixo" },
  { value: "hourly", label: "Por hora" },
  { value: "negotiable", label: "A combinar" },
  { value: "interview", label: "Proposta em entrevista" },
];

const CONTRACT_TYPE_OPTIONS: Array<{ value: ContractType; label: string }> = [
  { value: "indeterminate", label: "Indeterminado" },
  { value: "determinate", label: "Determinado" },
];

const NO_CATEGORY_VALUE = "__none__";
const NO_CONTRACT_TYPE_VALUE = "__none__";

const MULTI_TAG_CATEGORIES: Array<Exclude<TagCategory, "contract_regime">> = [
  "knowledge",
  "skill",
  "attitude",
  "activity",
  "benefit",
];

// Campos compartilhados entre o form de criação e o de edição — mesmo nome de input nos dois, só
// o valor padrão muda. Mesmo padrão de venore-plugin-birthdays/routes/admin/birthday-fields.tsx.
export function JobFields({
  categories,
  tagCatalogs,
  templates,
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
  defaultDiscEnvironmentLabel = "",
  defaultSalaryType = "negotiable",
  defaultSalaryAmount = "",
  defaultContractRegimeId = "",
  defaultContractType = null,
  defaultScheduleType = "weekly_hours",
  defaultWeeklyHours = "",
  defaultDailyStartTime = "",
  defaultDailyEndTime = "",
  defaultScheduleWeekDays = [],
  defaultManagerEmail = "",
  defaultClosesAt = "",
  defaultTagIdsByCategory = {},
}: {
  categories: JobCategoryRecord[];
  tagCatalogs: Record<TagCategory, TagItemRecord[]>;
  templates: FormTemplateRecord[];
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
  defaultDiscEnvironmentLabel?: string;
  defaultSalaryType?: SalaryType;
  defaultSalaryAmount?: string;
  defaultContractRegimeId?: string;
  defaultContractType?: ContractType | null;
  defaultScheduleType?: ScheduleType;
  defaultWeeklyHours?: string;
  defaultDailyStartTime?: string;
  defaultDailyEndTime?: string;
  defaultScheduleWeekDays?: WeekDay[];
  defaultManagerEmail?: string;
  // "YYYY-MM-DD", formato de <input type="date"> — quem chama já converte a partir de closesAt.
  defaultClosesAt?: string;
  defaultTagIdsByCategory?: Partial<Record<Exclude<TagCategory, "contract_regime">, string[]>>;
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
        Requisitos — texto livre (opcional)
        <Textarea name="requirements" defaultValue={defaultRequirements} placeholder="requisitos da vaga" rows={3} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Tipo de salário
          <Select name="salaryType" defaultValue={defaultSalaryType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SALARY_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Valor (se fixo ou por hora)
          <Input name="salaryAmount" type="text" inputMode="decimal" defaultValue={defaultSalaryAmount} placeholder="ex.: 1500.00" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Regime de contratação
          <TagSinglePicker
            name="contractRegimeId"
            category="contract_regime"
            items={tagCatalogs.contract_regime}
            defaultValue={defaultContractRegimeId}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Tipo de contrato
          <Select name="contractType" defaultValue={defaultContractType ?? NO_CONTRACT_TYPE_VALUE}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_CONTRACT_TYPE_VALUE}>Não informado</SelectItem>
              {CONTRACT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <ScheduleFields
        defaultScheduleType={defaultScheduleType}
        defaultWeeklyHours={defaultWeeklyHours}
        defaultDailyStartTime={defaultDailyStartTime}
        defaultDailyEndTime={defaultDailyEndTime}
        defaultScheduleWeekDays={defaultScheduleWeekDays}
      />

      {MULTI_TAG_CATEGORIES.map((category) => (
        <label key={category} className="flex flex-col gap-1 text-sm text-muted-foreground">
          {TAG_CATEGORY_LABELS[category]}
          <TagMultiPicker
            name={`${category}Ids`}
            category={category}
            items={tagCatalogs[category]}
            defaultSelectedIds={defaultTagIdsByCategory[category] ?? []}
          />
        </label>
      ))}

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Contato para dúvidas (opcional)
          <Input name="applyContact" defaultValue={defaultApplyContact} placeholder="e-mail ou link" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          E-mail do gestor (recebe as candidaturas)
          <Input name="managerEmail" type="email" defaultValue={defaultManagerEmail} placeholder="gestor@fem.edu.br" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
        <label className="flex flex-col gap-1 text-sm text-muted-foreground">
          Candidatar-se até (opcional)
          <Input name="closesAt" type="date" defaultValue={defaultClosesAt} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="requiresDisc" value="true" defaultChecked={defaultRequiresDisc} />
        Exigir Test DISC do candidato após a candidatura
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        "Ambiente" do Test DISC (opcional — sem isso, usa o título da vaga)
        <Input name="discEnvironmentLabel" defaultValue={defaultDiscEnvironmentLabel} placeholder="ex.: Equipe pedagógica EI" />
      </label>

      <CustomFieldsEditor name="customFormFields" initialFields={defaultCustomFormFields} templates={templates} />
    </>
  );
}
