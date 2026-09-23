// "YYYY-MM-DD" pra <input type="date">defaultValue — Date.toISOString() já vem nesse formato nos
// primeiros 10 chars, só precisa cortar a parte de hora/timezone.
export function formatDateForInput(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}
