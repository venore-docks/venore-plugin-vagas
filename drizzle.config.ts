import { defineConfig } from "drizzle-kit";

// Migrations próprias do plugin (mesmo padrão de venore-plugin-birthdays/drizzle.config.ts):
// separado do drizzle.config.ts raiz de propósito, pra core e vagas não competirem pela mesma
// história de migration.
export default defineConfig({
  schema: ["./database/schema/index.ts"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  // Mesmo racional de venore-plugin-birthdays/drizzle.config.ts: tabela de tracking própria, pra
  // não compartilhar o cursor de "última migration aplicada" com core (nem com outro plugin).
  migrations: { schema: "vagas_migrations", table: "__drizzle_migrations" },
});
