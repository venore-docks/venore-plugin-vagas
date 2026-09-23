"use client";

import { Printer } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";

// Mesmo padrão de venore-plugin-disc/routes/disc-report/print-button.tsx — window.print() do
// navegador (o "Salvar como PDF" já embutido em qualquer browser), não uma lib de geração de PDF
// no servidor. Página própria (não a dialog de detalhe) de propósito: imprimir de dentro de uma
// dialog Radix (position: fixed, overflow controlado) é inconsistente entre navegadores.
export function DiscReportPrintButton() {
  return (
    <Button variant="outline" size="sm" className="gap-2 print:hidden" onClick={() => window.print()}>
      <Printer className="size-4" />
      Baixar PDF
    </Button>
  );
}
