import type { PluginContributions } from "@venore/plugin-sdk";
import { vagasBreadcrumbSegments } from "./breadcrumbs";
import { blockDefinitions } from "./blocks/definitions";
import { vagasSeeds } from "./seeds";

// O que o vagas contribui pro core. `blockDefinitions` é dado puro (serializável) e entra direto;
// `blockRenderers` puxa o componente de render (handler -> query -> db), então é um loader
// preguiçoso — só block-renderers.tsx do core o chama. Mesmo padrão de venore-plugin-birthdays.
export const vagasContributions: PluginContributions = {
  breadcrumbSegments: vagasBreadcrumbSegments,
  blockDefinitions,
  blockRenderers: async () => (await import("./blocks/renderers")).blockRenderers,
  seeds: vagasSeeds,
};
