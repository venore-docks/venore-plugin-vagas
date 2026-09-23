import type { PluginManifest } from "@venore/plugin-sdk";

// Faixa escrita à mão, não importada de platform/plugin-engine/core-version.ts — mesmo motivo do
// birthdaysManifest (venore-plugin-birthdays/manifest.ts): importar o CORE_VERSION corrente
// tornaria a checagem de compatibilidade sempre trivialmente satisfeita.
export const vagasManifest: PluginManifest = {
  manifestVersion: "1.0.0",
  key: "vagas",
  name: "Vagas de emprego",
  version: "1.1.0",
  description: "Cadastro de vagas de emprego pelo RH, com listagem pública sem login.",
  compatibility: { coreVersion: ">=2.0.0 <3.0.0" },
  // Opcional: candidatura cria uma instância de Test DISC vinculada (shared/disc-bridge.ts) só
  // quando isPluginActive("disc") — sem o disc instalado, a candidatura completa normalmente sem
  // a etapa (dependência nunca bloqueia o vagas em si, só desliga essa funcionalidade).
  dependencies: [{ pluginKey: "disc", type: "optional" }],
  // Autoriza upload SEM SESSÃO só nesta categoria reservada própria (currículo de candidato, que
  // nunca tem conta) — uploadReservedCategoryAssetPublic recusa qualquer categoryKey não listada
  // aqui por nenhum plugin. Ver venore-docks/src/platform/plugin-engine/manifest-schema.ts.
  anonymousUploadCategories: ["vagas.applications"],
  // Schema próprio do plugin — aplicado no install (run-plugin-migrations.ts), não no
  // vercel-build. Default de migrationsSchema ("vagas_migrations") já bate com
  // venore-plugin-vagas/drizzle.config.ts.
  migrationsPath: "./migrations",
  permissions: [
    { key: "vagas.read", label: "Ver vagas cadastradas" },
    { key: "vagas.manage", label: "Cadastrar, editar e remover vagas e categorias" },
    // Separada de vagas.manage — candidatura carrega PII/currículo, faz sentido dar acesso de
    // gerenciar vagas sem dar acesso a currículo de candidato.
    { key: "vagas.applications.review", label: "Ver candidaturas e currículos recebidos" },
  ],
  navigation: [
    {
      key: "vagas.admin",
      label: "Vagas de emprego",
      href: "/admin/vagas",
      icon: "briefcase",
      groupKey: "plugins",
      groupLabel: "Plugins",
      groupOrder: 30,
      order: 30,
      requiredPermission: "vagas.read",
    },
  ],
  seeds: [
    { key: "example", label: "Dados de exemplo", description: "Três vagas de exemplo em áreas diferentes." },
  ],
  blocks: [{ key: "vagas.open-positions", label: "Vagas de emprego — Abertas no momento" }],
};
