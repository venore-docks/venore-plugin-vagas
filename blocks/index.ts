// Dois arquivos separados (não um só) — mesmo motivo do venore-plugin-birthdays: definitions.ts é
// dado puro (sem tocar em handler/query), renderers.ts importa o componente de render (que puxa o
// handler -> service -> store -> db).
export { blockDefinitions } from "./definitions";
export { blockRenderers } from "./renderers";
