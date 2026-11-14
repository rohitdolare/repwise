"use client";

import { RotateCcw } from "lucide-react";
import { days } from "@/content/programs";
import { setSchedule } from "@/lib/store";
import type { Program } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Lets the user choose which workout (or rest) falls on each day of their week. */
export function ScheduleEditor({
  program,
  schedule,
  isCustom,
  onDone,
}: {
  program: Program;
  schedule: (string | null)[];
  isCustom: boolean;
  onDone: () => void;
}) {
  const change = (day: number, value: string) => {
    const next = [...schedule];
    next[day] = value || null;
    setSchedule(program.id, next);
  };

  const missing = program.workouts.filter((w) => !schedule.includes(w.id));
  const trainingDays = schedule.filter(Boolean).length;
  const backToBack = schedule.some((id, i) => id && id === schedule[(i + 1) % 7]);

  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5">
      <div>
        <h3 className="font-heading text-lg font-bold">Choose your training days</h3>
        <p className="text-sm text-muted-foreground">
          Pick which {program.short} session you do on each day. Saved on this device.
        </p>
      </div>

      <ul className="divide-y">
        {days.map((name, i) => (
          <li key={name} className="flex items-center justify-between gap-3 py-2">
            <label htmlFor={`day-${i}`} className="text-sm font-medium">
              {name}
            </label>
            <select
              id={`day-${i}`}
              value={schedule[i] ?? ""}
              onChange={(e) => change(i, e.target.value)}
              className={cn(
                "h-11 w-44 rounded-lg border bg-background px-2 text-base",
                schedule[i] ? "border-primary/60 font-semibold" : "text-muted-foreground",
              )}
            >
              <option value="">Rest</option>
              {program.workouts.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>

      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">
          {trainingDays} training day{trainingDays === 1 ? "" : "s"} · plan recommends {program.daysPerWeek}
        </p>
        {missing.length > 0 && (
          <p className="text-amber-600 dark:text-amber-400">
            Not scheduled yet: {missing.map((w) => w.name).join(", ")}
          </p>
        )}
        {backToBack && (
          <p className="text-amber-600 dark:text-amber-400">
            Tip: avoid the same session on back-to-back days — muscles need ~48 h to recover.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onDone}>Done</Button>
        {isCustom && (
          <Button variant="outline" onClick={() => setSchedule(program.id, null)}>
            <RotateCcw /> Reset to plan default
          </Button>
        )}
      </div>
    </section>
  );
}
