import { listPublicJobs } from "./service";
import type { ListPublicJobsResult } from "./types";

// Sem authorizeActor de propósito — listagem de vagas abertas é pública, sem autenticação (mesmo
// espírito de list-public-birthdays no venore-plugin-birthdays).
export async function listPublicJobsHandler(): Promise<ListPublicJobsResult> {
  return listPublicJobs();
}
