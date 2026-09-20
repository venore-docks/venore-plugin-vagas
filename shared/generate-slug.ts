// Slug determinístico a partir do título — sem acento, minúsculo, hifenizado. Unicidade é
// garantida pela constraint `unique()` da coluna (features/create-job/store.ts trata o erro de
// violação como "título já cadastrado", não deixa o Postgres estourar exception crua pro handler).
export function generateJobSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}
