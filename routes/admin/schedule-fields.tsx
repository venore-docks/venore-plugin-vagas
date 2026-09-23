"use client";

import { useState } from "react";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@venore/plugin-sdk/ui";
import type { ScheduleType, WeekDay } from "../../contracts/types";

const SCHEDULE_TYPE_OPTIONS: Array<{ value: ScheduleType; label: string }> = [
  { value: "weekly_hours", label: "Só carga horária semanal (ex.: 20h semanais)" },
  { value: "fixed", label: "Horário fixo (dias + horário diário)" },
];

const WEEK_DAYS: Array<{ value: WeekDay; label: string }> = [
  { value: "mon", label: "Seg" },
  { value: "tue", label: "Ter" },
  { value: "wed", label: "Qua" },
  { value: "thu", label: "Qui" },
  { value: "fri", label: "Sex" },
  { value: "sat", label: "Sáb" },
  { value: "sun", label: "Dom" },
];

export function ScheduleFields({
  defaultScheduleType = "weekly_hours",
  defaultWeeklyHours = "",
  defaultDailyStartTime = "",
  defaultDailyEndTime = "",
  defaultScheduleWeekDays = [],
}: {
  defaultScheduleType?: ScheduleType;
  defaultWeeklyHours?: string;
  defaultDailyStartTime?: string;
  defaultDailyEndTime?: string;
  defaultScheduleWeekDays?: WeekDay[];
}) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>(defaultScheduleType);
  const [weekDays, setWeekDays] = useState<Set<WeekDay>>(new Set(defaultScheduleWeekDays));

  function toggleDay(day: WeekDay) {
    setWeekDays((current) => {
      const next = new Set(current);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Horário
        <Select name="scheduleType" value={scheduleType} onValueChange={(value) => setScheduleType(value as ScheduleType)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCHEDULE_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Carga horária semanal (ex.: 36 ou 20)
        <Input name="weeklyHours" type="text" inputMode="decimal" defaultValue={defaultWeeklyHours} placeholder="ex.: 36" />
      </label>

      {scheduleType === "fixed" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              Início
              <Input name="dailyStartTime" type="time" defaultValue={defaultDailyStartTime} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              Fim
              <Input name="dailyEndTime" type="time" defaultValue={defaultDailyEndTime} />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {WEEK_DAYS.map((day) => (
              <label key={day.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  name={`scheduleWeekDay:${day.value}`}
                  value="true"
                  checked={weekDays.has(day.value)}
                  onChange={() => toggleDay(day.value)}
                />
                {day.label}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
