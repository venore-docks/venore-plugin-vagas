import type { ContractType, SalaryType, ScheduleType, WeekDay } from "../contracts/types";

const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  mon: "seg",
  tue: "ter",
  wed: "qua",
  thu: "qui",
  fri: "sex",
  sat: "sáb",
  sun: "dom",
};

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  indeterminate: "Indeterminado",
  determinate: "Determinado",
};

function formatMoney(amount: string): string {
  const value = Number(amount);
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatSalary(salaryType: SalaryType, salaryAmount: string | null): string {
  if (salaryType === "negotiable") return "A combinar";
  if (salaryType === "interview") return "Proposta em entrevista";
  if (!salaryAmount) return salaryType === "hourly" ? "Por hora — a combinar" : "A combinar";
  return salaryType === "hourly" ? `${formatMoney(salaryAmount)}/h` : formatMoney(salaryAmount);
}

export function formatContractType(contractType: ContractType | null): string | null {
  return contractType ? CONTRACT_TYPE_LABELS[contractType] : null;
}

// Condensa dias consecutivos em intervalo ("seg a sáb") — cai pra lista separada por vírgula
// quando os dias não formam uma sequência única (ex.: só ter/qui).
function formatWeekDayRange(days: WeekDay[]): string {
  const order: WeekDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const sorted = order.filter((day) => days.includes(day));
  if (sorted.length === 0) return "";
  const indices = sorted.map((day) => order.indexOf(day));
  const isConsecutiveRange = indices.every((index, position) => position === 0 || index === indices[position - 1] + 1);
  if (isConsecutiveRange && sorted.length > 1) {
    return `${WEEK_DAY_LABELS[sorted[0]]} a ${WEEK_DAY_LABELS[sorted[sorted.length - 1]]}`;
  }
  return sorted.map((day) => WEEK_DAY_LABELS[day]).join(", ");
}

export function formatSchedule(input: {
  scheduleType: ScheduleType;
  weeklyHours: string | null;
  dailyStartTime: string | null;
  dailyEndTime: string | null;
  scheduleWeekDays: WeekDay[];
}): string | null {
  const hoursLabel = input.weeklyHours ? `${input.weeklyHours}h semanais` : null;

  if (input.scheduleType === "weekly_hours") {
    return hoursLabel;
  }

  const parts = [hoursLabel, formatWeekDayRange(input.scheduleWeekDays) || null];
  if (input.dailyStartTime && input.dailyEndTime) {
    parts.push(`${input.dailyStartTime}–${input.dailyEndTime}`);
  }
  const filtered = parts.filter((part): part is string => Boolean(part));
  return filtered.length > 0 ? filtered.join(" · ") : null;
}
