import type { BlockDefinition } from "@venore/plugin-sdk/cms";

export const vagasOpenPositionsBlockDefinition: BlockDefinition = {
  key: "vagas.open-positions",
  label: "Vagas de emprego — Abertas no momento",
  category: "vagas",
  structure: "leaf",
  allowedInRoot: true,
  defaultData: {
    title: "Vagas abertas",
    description: "Confira as oportunidades disponíveis hoje na FEM.",
    emptyMessage: "Não há vagas abertas no momento.",
    limit: 6,
  },
  editorFields: [
    { name: "title", type: "text", label: "Título" },
    { name: "description", type: "richtext", label: "Descrição" },
    { name: "emptyMessage", type: "richtext", label: "Mensagem quando não há vagas abertas" },
    { name: "limit", type: "number", label: "Quantidade máxima exibida" },
  ],
};
