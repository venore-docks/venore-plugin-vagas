export { vagasBreadcrumbSegments } from "./breadcrumbs";
export { createJobHandler as createJob } from "./features/create-job/handler";
export { updateJobHandler as updateJob } from "./features/update-job/handler";
export { deleteJobHandler as deleteJob } from "./features/delete-job/handler";
export { listJobsHandler as listJobs } from "./features/list-jobs/handler";
export { listPublicJobsHandler as listPublicJobs } from "./features/list-public-jobs/handler";
export { getJobBySlugHandler as getJobBySlug } from "./features/get-job-by-slug/handler";

// Ponto de extensão "blocks" do plugin engine, mesmo padrão do birthdays (venore-plugin-birthdays/
// index.ts): platform/page-builder/block-registry.ts importa blockDefinitions (dado,
// serializável) e block-renderers.tsx importa blockRenderers (componente) — dois registries
// paralelos, nunca misturados.
export { blockDefinitions, blockRenderers } from "./blocks";

// Ponto de extensão "seeds" do plugin engine (platform/plugin-engine/plugin-seed-registry.ts) —
// dados de exemplo populados via /admin/plugins.
export { vagasSeeds } from "./seeds";

export type { JobRecord, JobStatus } from "./contracts/types";
export type { CreateJobInput, CreateJobResult } from "./features/create-job/types";
export type { UpdateJobInput, UpdateJobResult } from "./features/update-job/types";
export type { DeleteJobInput, DeleteJobResult } from "./features/delete-job/types";
export type { ListJobsResult } from "./features/list-jobs/types";
export type { PublicJobView, ListPublicJobsResult } from "./features/list-public-jobs/types";
export type { GetJobBySlugInput, GetJobBySlugResult } from "./features/get-job-by-slug/types";
