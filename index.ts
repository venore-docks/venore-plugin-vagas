export { vagasBreadcrumbSegments } from "./breadcrumbs";
export { createJobHandler as createJob } from "./features/create-job/handler";
export { updateJobHandler as updateJob } from "./features/update-job/handler";
export { deleteJobHandler as deleteJob } from "./features/delete-job/handler";
export { listJobsHandler as listJobs } from "./features/list-jobs/handler";
export { listPublicJobsHandler as listPublicJobs } from "./features/list-public-jobs/handler";
export { getJobBySlugHandler as getJobBySlug } from "./features/get-job-by-slug/handler";

export { createJobCategoryHandler as createJobCategory } from "./features/create-job-category/handler";
export { updateJobCategoryHandler as updateJobCategory } from "./features/update-job-category/handler";
export { deleteJobCategoryHandler as deleteJobCategory } from "./features/delete-job-category/handler";
export { listJobCategoriesHandler as listJobCategories } from "./features/list-job-categories/handler";

export { submitApplicationHandler as submitApplication } from "./features/submit-application/handler";
export { listApplicationsHandler as listApplications } from "./features/list-applications/handler";
export {
  syncApplicationDiscStatusHandler as syncApplicationDiscStatus,
} from "./features/sync-application-disc-status/handler";

// Ponto de extensão "blocks" do plugin engine, mesmo padrão do birthdays (venore-plugin-birthdays/
// index.ts): platform/page-builder/block-registry.ts importa blockDefinitions (dado,
// serializável) e block-renderers.tsx importa blockRenderers (componente) — dois registries
// paralelos, nunca misturados.
export { blockDefinitions, blockRenderers } from "./blocks";

// Ponto de extensão "seeds" do plugin engine (platform/plugin-engine/plugin-seed-registry.ts) —
// dados de exemplo populados via /admin/plugins.
export { vagasSeeds } from "./seeds";

export type {
  JobRecord,
  JobStatus,
  JobCategoryRecord,
  ApplicationRecord,
  ApplicationStatus,
  CustomApplicationField,
  ApplicationFieldType,
} from "./contracts/types";
export type { CreateJobInput, CreateJobResult } from "./features/create-job/types";
export type { UpdateJobInput, UpdateJobResult } from "./features/update-job/types";
export type { DeleteJobInput, DeleteJobResult } from "./features/delete-job/types";
export type { ListJobsResult } from "./features/list-jobs/types";
export type { PublicJobView, ListPublicJobsResult } from "./features/list-public-jobs/types";
export type { GetJobBySlugInput, GetJobBySlugResult, PublicJobDetailView } from "./features/get-job-by-slug/types";
export type { CreateJobCategoryInput, CreateJobCategoryResult } from "./features/create-job-category/types";
export type { UpdateJobCategoryInput, UpdateJobCategoryResult } from "./features/update-job-category/types";
export type { DeleteJobCategoryInput, DeleteJobCategoryResult } from "./features/delete-job-category/types";
export type { ListJobCategoriesResult } from "./features/list-job-categories/types";
export type {
  SubmitApplicationInput,
  SubmitApplicationResult,
  SubmitApplicationResumeFile,
} from "./features/submit-application/types";
export type { ListApplicationsInput, ListApplicationsResult, ApplicationAdminView } from "./features/list-applications/types";
export type {
  SyncApplicationDiscStatusInput,
  SyncApplicationDiscStatusResult,
} from "./features/sync-application-disc-status/types";
