import { syncApplicationDiscStatus } from "./service";
import type { SyncApplicationDiscStatusInput, SyncApplicationDiscStatusResult } from "./types";

// Sem authorizeActor de propósito — chamado a partir da própria página pública de confirmação
// (o candidato só conhece o applicationId da sua candidatura, veio da própria URL de retorno do
// disc) e do botão "verificar DISC" no admin (já atrás de vagas.applications.review na página que
// o renderiza). Operação idempotente, não expõe nada além do que o próprio candidato já forneceu.
export async function syncApplicationDiscStatusHandler(
  input: SyncApplicationDiscStatusInput,
): Promise<SyncApplicationDiscStatusResult> {
  if (input.applicationId.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_id", message: "applicationId não pode ser vazio." } };
  }
  return syncApplicationDiscStatus(input);
}
