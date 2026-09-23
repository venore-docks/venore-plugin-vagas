"use server";

import { revalidatePath } from "next/cache";
import {
  createJob,
  createJobCategory,
  deleteJob,
  deleteJobCategory,
  syncApplicationDiscStatus,
  updateJob,
  updateJobCategory,
} from "../../index";
import { isPluginActive } from "@venore/plugin-sdk";
import type { CustomApplicationField, JobStatus } from "../../contracts/types";

export type VagasActionState = { error: string | null };

const returnTo = "/admin/vagas";
const PLUGIN_DISABLED_ERROR = "O plugin Vagas de emprego está desabilitado.";

function readStatus(formData: FormData): JobStatus {
  const value = String(formData.get("status") ?? "open");
  return value === "paused" || value === "closed" ? value : "open";
}

function readCategoryId(formData: FormData): string | null {
  const value = String(formData.get("categoryId") ?? "");
  return value && value !== "__none__" ? value : null;
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

export async function createJobAction(_prevState: VagasActionState, formData: FormData): Promise<VagasActionState> {
  if (!(await isPluginActive("vagas"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await createJob({
    title: String(formData.get("title") ?? ""),
    department: String(formData.get("department") ?? "") || undefined,
    location: String(formData.get("location") ?? "") || undefined,
    description: String(formData.get("description") ?? ""),
    requirements: String(formData.get("requirements") ?? "") || undefined,
    applyContact: String(formData.get("applyContact") ?? "") || undefined,
    status: readStatus(formData),
    categoryId: readCategoryId(formData),
    coverMediaAssetId: String(formData.get("coverMediaAssetId") ?? "") || null,
    customFormFields: readCustomFormFields(formData),
    requiresDisc: formData.get("requiresDisc") === "true",
  });

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

  const result = await updateJob({
    jobId: String(formData.get("jobId") ?? ""),
    title: String(formData.get("title") ?? ""),
    department: String(formData.get("department") ?? "") || undefined,
    location: String(formData.get("location") ?? "") || undefined,
    description: String(formData.get("description") ?? ""),
    requirements: String(formData.get("requirements") ?? "") || undefined,
    applyContact: String(formData.get("applyContact") ?? "") || undefined,
    status: readStatus(formData),
    categoryId: readCategoryId(formData),
    coverMediaAssetId: String(formData.get("coverMediaAssetId") ?? "") || null,
    customFormFields: readCustomFormFields(formData),
    requiresDisc: formData.get("requiresDisc") === "true",
  });

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
