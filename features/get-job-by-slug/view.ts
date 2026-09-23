import type { ResolvedJobTags } from "../../shared/resolve-tag-labels";
import type { JobRecord } from "../../contracts/types";
import type { PublicJobDetailView } from "./types";

export function toPublicJobDetailView(record: JobRecord, coverImageUrl: string | null, tags: ResolvedJobTags): PublicJobDetailView {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    department: record.department,
    location: record.location,
    description: record.description,
    requirements: record.requirements,
    applyContact: record.applyContact,
    coverImageUrl,
    customFormFields: record.customFormFields,
    requiresDisc: record.requiresDisc,
    salaryType: record.salaryType,
    salaryAmount: record.salaryAmount,
    contractRegimeLabel: tags.contractRegimeLabel,
    contractType: record.contractType,
    scheduleType: record.scheduleType,
    weeklyHours: record.weeklyHours,
    dailyStartTime: record.dailyStartTime,
    dailyEndTime: record.dailyEndTime,
    scheduleWeekDays: record.scheduleWeekDays,
    benefits: tags.benefits,
    knowledge: tags.knowledge,
    skills: tags.skills,
    attitudes: tags.attitudes,
    activities: tags.activities,
    closesAt: record.closesAt,
    publishedAt: record.publishedAt,
  };
}
