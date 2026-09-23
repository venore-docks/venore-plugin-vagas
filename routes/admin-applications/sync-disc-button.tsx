"use client";

import { useActionState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { useActionToast } from "@venore/plugin-sdk/ui";
import { syncApplicationDiscStatusAction, type VagasActionState } from "../admin/actions";

const initialState: VagasActionState = { error: null };

// Cobre o candidato que terminou o Test DISC mas não voltou pra página de confirmação do vagas
// (fechou a aba, por exemplo) — sync-application-disc-status é idempotente, então "verificar" de
// novo numa candidatura já completa não faz nada.
export function SyncDiscButton({ jobId, applicationId }: { jobId: string; applicationId: string }) {
  const [state, formAction, pending] = useActionState(syncApplicationDiscStatusAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: "Status do DISC verificado." });

  return (
    <form action={formAction}>
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="applicationId" value={applicationId} />
      <Button type="submit" variant="ghost" size="sm" disabled={pending}>
        <RefreshCw className="size-3.5" />
        Verificar DISC
      </Button>
    </form>
  );
}
