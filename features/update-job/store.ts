import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobs } from "../../database/schema";
import type { ContractType, CustomApplicationField, JobRecord, SalaryType, ScheduleType, WeekDay } from "../../contracts/types";

export async function findJobById(id: string): Promise<JobRecord | null> {
  const [row] = await db.select().from(vagasJobs).where(eq(vagasJobs.id, id)).limit(1);
  return (row as JobRecord) ?? null;
}

export async function applyJobUpdate(input: {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string;
  requirements: string | null;
  applyContact: string | null;
  status: JobRecord["status"];
  categoryId: string | null;
  coverMediaAssetId: string | null;
  customFormFields: CustomApplicationField[];
  requiresDisc: boolean;
  discEnvironmentLabel: string | null;
  salaryType: SalaryType;
  salaryAmount: string | null;
  contractRegimeId: string | null;
  contractType: ContractType | null;
  scheduleType: ScheduleType;
  weeklyHours: string | null;
  dailyStartTime: string | null;
  dailyEndTime: string | null;
  scheduleWeekDays: WeekDay[];
  managerEmail: string | null;
  closesAt: Date | null;
}): Promise<JobRecord> {
  const [row] = await db
    .update(vagasJobs)
    .set({
      title: input.title,
      department: input.department,
      location: input.location,
      description: input.description,
      requirements: input.requirements,
      applyContact: input.applyContact,
      status: input.status,
      categoryId: input.categoryId,
      coverMediaAssetId: input.coverMediaAssetId,
      customFormFields: input.customFormFields,
      requiresDisc: input.requiresDisc,
      discEnvironmentLabel: input.discEnvironmentLabel,
      salaryType: input.salaryType,
      salaryAmount: input.salaryAmount,
      contractRegimeId: input.contractRegimeId,
      contractType: input.contractType,
      scheduleType: input.scheduleType,
      weeklyHours: input.weeklyHours,
      dailyStartTime: input.dailyStartTime,
      dailyEndTime: input.dailyEndTime,
      scheduleWeekDays: input.scheduleWeekDays,
      managerEmail: input.managerEmail,
      closesAt: input.closesAt,
      updatedAt: sql`now()`,
    })
    .where(eq(vagasJobs.id, input.id))
    .returning();

  return row as JobRecord;
}
