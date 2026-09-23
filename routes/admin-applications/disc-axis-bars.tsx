const AXIS_LABELS: Record<"d" | "i" | "s" | "c", string> = { d: "D", i: "I", s: "S", c: "C" };

// Sem lib de gráfico (recharts/etc.) — barras simples em CSS, imprimem sem depender de canvas/svg
// renderizado por JS de terceiro. Não é o mesmo componente visual do relatório em
// venore-plugin-disc (que fica em routes/, arquivo interno — um plugin não importa arquivo
// interno de outro, só barrel/contracts), só a mesma informação (percentual por eixo).
export function DiscAxisBars({ percentual }: { percentual: { d: number; i: number; s: number; c: number } }) {
  return (
    <div className="space-y-2">
      {(["d", "i", "s", "c"] as const).map((key) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-4 text-xs font-semibold text-muted-foreground">{AXIS_LABELS[key]}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted print:border print:border-border">
            <div className="h-full rounded-full bg-primary print:bg-foreground" style={{ width: `${Math.max(0, Math.min(100, percentual[key]))}%` }} />
          </div>
          <span className="w-10 text-right text-xs text-muted-foreground">{percentual[key]}%</span>
        </div>
      ))}
    </div>
  );
}
