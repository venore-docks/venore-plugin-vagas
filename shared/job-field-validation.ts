import type { JobValidationError } from "../features/create-job/validation";

const DECIMAL_PATTERN = /^\d+(\.\d{1,2})?$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// Compartilhado entre create-job e update-job — os dois aceitam o mesmo shape solto de
// salário/horário vindo do form (string | null, sem parse de Date/number ainda feito).
export function validateSalaryAndScheduleFields(input: {
  salaryAmount?: string | null;
  weeklyHours?: string | null;
  dailyStartTime?: string | null;
  dailyEndTime?: string | null;
}): JobValidationError | null {
  if (input.salaryAmount && !DECIMAL_PATTERN.test(input.salaryAmount)) {
    return { code: "vagas.invalid_salary_amount", message: "Valor de salário inválido — use algo como 1500.00." };
  }
  if (input.weeklyHours && !DECIMAL_PATTERN.test(input.weeklyHours)) {
    return { code: "vagas.invalid_weekly_hours", message: "Carga horária semanal inválida." };
  }
  if (input.dailyStartTime && !TIME_PATTERN.test(input.dailyStartTime)) {
    return { code: "vagas.invalid_daily_start_time", message: "Horário de início inválido — use HH:mm." };
  }
  if (input.dailyEndTime && !TIME_PATTERN.test(input.dailyEndTime)) {
    return { code: "vagas.invalid_daily_end_time", message: "Horário de término inválido — use HH:mm." };
  }
  return null;
}
