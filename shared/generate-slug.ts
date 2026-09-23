// Slug determinístico a partir de um texto — sem acento, minúsculo, hifenizado. Unicidade é
// garantida pela constraint `unique()` da coluna que usa (create-job/create-job-category tratam o
// erro de violação como "já cadastrado", não deixam o Postgres estourar exception crua pro handler).
export function generateSlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function generateJobSlug(title: string): string {
  return generateSlug(title);
}
