"use server";

import { revalidatePath } from "next/cache";
import { createJob, deleteJob, updateJob } from "../../index";
import { isPluginActive } from "@venore/plugin-sdk";
import type { JobStatus } from "../../contracts/types";

export type VagasActionState = { error: string | null };

const returnTo = "/admin/vagas";
const PLUGIN_DISABLED_ERROR = "O plugin Vagas de emprego está desabilitado.";

function readStatus(formData: FormData): JobStatus {
  const value = String(formData.get("status") ?? "open");
  return value === "paused" || value === "closed" ? value : "open";
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
