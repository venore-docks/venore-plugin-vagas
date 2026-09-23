"use server";

import { revalidatePath } from "next/cache";
import {
  createFormTemplate,
  createJob,
  createJobCategory,
  createTagItem,
  deleteFormTemplate,
  deleteJob,
  deleteJobCategory,
  deleteTagItem,
  syncApplicationDiscStatus,
  updateFormTemplate,
  updateJob,
  updateJobCategory,
  updateTagItem,
} from "../../index";
import type { CreateTagItemResult } from "../../index";
import { isPluginActive } from "@venore/plugin-sdk";
import type { ContractType, CustomApplicationField, JobStatus, SalaryType, ScheduleType, TagCategory, WeekDay } from "../../contracts/types";

export type VagasActionState = { error: string | null };

const returnTo = "/admin/vagas";
const PLUGIN_DISABLED_ERROR = "O plugin Vagas de emprego está desabilitado.";
const NO_SELECTION_VALUE = "__none__";

function readStatus(formData: FormData): JobStatus {
  const value = String(formData.get("status") ?? "open");
  return value === "paused" || value === "closed" ? value : "open";
}

function readSingleSelect(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "");
  return value && value !== NO_SELECTION_VALUE ? value : null;
}

function readIdArray(formData: FormData, key: string): string[] {
  const raw = String(formData.get(key) ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function readCustomFormFields(formData: FormData): CustomApplicationField[] {
  const raw = String(formData.get("customFormFields") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readSalaryType(formData: FormData): SalaryType {
  const value = String(formData.get("salaryType") ?? "negotiable");
  return value === "fixed" || value === "hourly" || value === "interview" ? value : "negotiable";
}

function readContractType(formData: FormData): ContractType | null {
  const value = String(formData.get("contractType") ?? "");
  return value === "indeterminate" || value === "determinate" ? value : null;
}

function readScheduleType(formData: FormData): ScheduleType {
  return String(formData.get("scheduleType") ?? "weekly_hours") === "fixed" ? "fixed" : "weekly_hours";
}

const WEEK_DAYS: WeekDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function readScheduleWeekDays(formData: FormData): WeekDay[] {
  return WEEK_DAYS.filter((day) => formData.get(`scheduleWeekDay:${day}`) === "true");
}

function readClosesAt(formData: FormData): Date | null {
  const value = String(formData.get("closesAt") ?? "");
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function jobFieldsFromFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    department: String(formData.get("department") ?? "") || undefined,
    location: String(formData.get("location") ?? "") || undefined,
    description: String(formData.get("description") ?? ""),
    requirements: String(formData.get("requirements") ?? "") || undefined,
    applyContact: String(formData.get("applyContact") ?? "") || undefined,
    status: readStatus(formData),
    categoryId: readSingleSelect(formData, "categoryId"),
    coverMediaAssetId: String(formData.get("coverMediaAssetId") ?? "") || null,
    customFormFields: readCustomFormFields(formData),
    requiresDisc: formData.get("requiresDisc") === "true",
    discEnvironmentLabel: String(formData.get("discEnvironmentLabel") ?? "") || null,
    salaryType: readSalaryType(formData),
    salaryAmount: String(formData.get("salaryAmount") ?? "") || null,
    contractRegimeId: readSingleSelect(formData, "contractRegimeId"),
    contractType: readContractType(formData),
    scheduleType: readScheduleType(formData),
    weeklyHours: String(formData.get("weeklyHours") ?? "") || null,
    dailyStartTime: String(formData.get("dailyStartTime") ?? "") || null,
    dailyEndTime: String(formData.get("dailyEndTime") ?? "") || null,
    scheduleWeekDays: readScheduleWeekDays(formData),
    managerEmail: String(formData.get("managerEmail") ?? "") || null,
    closesAt: readClosesAt(formData),
    benefitIds: readIdArray(formData, "benefitIds"),
    knowledgeIds: readIdArray(formData, "knowledgeIds"),
    skillIds: readIdArray(formData, "skillIds"),
    attitudeIds: readIdArray(formData, "attitudeIds"),
    activityIds: readIdArray(formData, "activityIds"),
  };
}

export async function createJobAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await createJob(jobFieldsFromFormData(formData));

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(returnTo);
  return { error: null };
}

export async function updateJobAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await updateJob({ jobId: String(formData.get("jobId") ?? ""), ...jobFieldsFromFormData(formData) });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(returnTo);
  return { error: null };
}

export async function deleteJobAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await deleteJob({ jobId: String(formData.get("jobId") ?? "") });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(returnTo);
  return { error: null };
}

export async function createJobCategoryAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await createJobCategory({
    name: String(formData.get("name") ?? ""),
    coverMediaAssetId: String(formData.get("coverMediaAssetId") ?? "") || null,
  });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/categorias`);
  return { error: null };
}

export async function updateJobCategoryAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await updateJobCategory({
    categoryId: String(formData.get("categoryId") ?? ""),
    name: String(formData.get("name") ?? ""),
    coverMediaAssetId: String(formData.get("coverMediaAssetId") ?? "") || null,
  });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/categorias`);
  return { error: null };
}

export async function deleteJobCategoryAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await deleteJobCategory({ categoryId: String(formData.get("categoryId") ?? "") });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/categorias`);
  return { error: null };
}

export async function syncApplicationDiscStatusAction(
  _prevState: VagasActionState,
  formData: FormData,
): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const jobId = String(formData.get("jobId") ?? "");
  const result = await syncApplicationDiscStatus({ applicationId: String(formData.get("applicationId") ?? "") });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/${jobId}/candidaturas`);
  return { error: null };
}

// Chamada direta (não via useActionState) a partir de tag-picker.tsx — o "novo item" acontece
// inline no form da vaga, sem submit de página inteira. Mesmo racional de
// media-picker-field.actions.ts (upload "no momento" sem sair do form que está sendo preenchido).
export async function createTagItemAction(input: { category: TagCategory; label: string }): Promise<CreateTagItemResult> {
  if (!(await isPluginActive("vagas"))) {
    return { success: false, error: { code: "plugin_disabled", message: PLUGIN_DISABLED_ERROR } };
  }
  const result = await createTagItem(input);
  if (result.success) revalidatePath(`${returnTo}/listas`);
  return result;
}

export async function updateTagItemAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await updateTagItem({
    tagItemId: String(formData.get("tagItemId") ?? ""),
    label: String(formData.get("label") ?? ""),
  });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/listas`);
  return { error: null };
}

export async function deleteTagItemAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await deleteTagItem({ tagItemId: String(formData.get("tagItemId") ?? "") });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/listas`);
  return { error: null };
}

export async function createFormTemplateAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await createFormTemplate({
    name: String(formData.get("name") ?? ""),
    fields: readCustomFormFields(formData),
  });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/formularios`);
  return { error: null };
}

export async function updateFormTemplateAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await updateFormTemplate({
    templateId: String(formData.get("templateId") ?? ""),
    name: String(formData.get("name") ?? ""),
    fields: readCustomFormFields(formData),
  });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/formularios`);
  return { error: null };
}

export async function deleteFormTemplateAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await deleteFormTemplate({ templateId: String(formData.get("templateId") ?? "") });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(`${returnTo}/formularios`);
  return { error: null };
}
