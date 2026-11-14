"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { days, getProgram, mondayIndex } from "@/content/programs";
import { updateSettings, useHasChosenPlan, useSettings, useWeekday } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UsePlanButton({ programId }: { programId: string }) {
  const { programId: current } = useSettings();
  const chosen = useHasChosenPlan();
  const active = chosen && current === programId;
  return (
    <Button
      size="lg"
      variant={active ? "secondary" : "default"}
      className="h-11 w-full px-4 sm:w-auto"
      onClick={() => updateSettings({ programId })}
    >
      {active ? (
        <>
          <Check /> Your current plan
        </>
      ) : (
        "Use this plan"
      )}
    </Button>
  );
}

export function TodayPreview() {
  const { programId } = useSettings();
  const weekday = useWeekday();
  const program = getProgram(programId);

  if (weekday === null) return <div className="h-40 animate-pulse rounded-3xl bg-muted" />;
  const idx = mondayIndex(weekday);
  const workout = program.workouts.find((w) => w.id === program.schedule[idx]);

  return (
    <Link
      href="/today"
      className="group block rounded-3xl border bg-card p-5 transition-colors hover:border-primary/60 md:p-6"
    >
      <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
        Today · {days[idx]} · {program.short}
      </p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black md:text-3xl">{workout ? workout.name : "Rest day"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {workout ? `${workout.focus} · ${workout.exercises.length} exercises` : "Recover, walk, eat well, sleep."}
          </p>
        </div>
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-0.5",
          )}
        >
          <ArrowRight className="size-5" />
        </span>
      </div>
    </Link>
  );
}
