"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BedDouble, Clock, Flame, HeartPulse, MonitorSmartphone, Moon, Repeat, Target } from "lucide-react";
import { WeeklyCardio } from "./cardio-widgets";
import { days, daysShort, getProgram, mondayIndex } from "@/content/programs";
import { useLogs, useSettings, useTodayKey, useWeekday } from "@/lib/store";
import type { LoadType, WorkoutDay } from "@/lib/types";
import { ExerciseLogger } from "./exercise-logger";
import { useWakeLock } from "@/lib/wake-lock";
import { cn } from "@/lib/utils";

/** Minimal info about each exercise the client needs (keeps the full library out of the bundle). */
export type ExerciseMeta = Record<string, { name: string; load: LoadType }>;

function estimateMinutes(w: WorkoutDay) {
  const sec = w.exercises.reduce((t, e) => t + e.sets * (45 + e.restSec), 0);
  return Math.round((sec + 600) / 60 / 5) * 5; // + ~10 min warm-up
}

export function TodayWorkout({ meta }: { meta: ExerciseMeta }) {
  const { programId } = useSettings();
  const program = getProgram(programId);
  const weekday = useWeekday();
  const todayIdx = weekday === null ? null : mondayIndex(weekday);
  const [picked, setPicked] = useState<{ day: number; workoutId?: string } | null>(null);
  const [awake, setAwake] = useState(false);
  const logs = useLogs();
  const today = useTodayKey();
  useWakeLock(awake);

  if (todayIdx === null) {
    return <div className="h-96 animate-pulse rounded-2xl bg-muted" />;
  }

  const dayIdx = picked?.day ?? todayIdx;
  const workoutId = picked?.workoutId ?? program.schedule[dayIdx];
  const workout = program.workouts.find((w) => w.id === workoutId);

  const totalSets = workout?.exercises.reduce((t, e) => t + e.sets, 0) ?? 0;
  const doneSets =
    workout?.exercises.reduce((t, e) => {
      const s = logs[e.slug]?.find((x) => x.date === today);
      return t + Math.min(e.sets, s?.sets.length ?? 0);
    }, 0) ?? 0;
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Week strip */}
      <div className="-mx-4 overflow-x-auto px-4">
        <ol className="flex min-w-max gap-2">
          {program.schedule.map((wid, i) => {
            const w = program.workouts.find((x) => x.id === wid);
            const active = i === dayIdx && !picked?.workoutId;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setPicked(i === todayIdx ? null : { day: i })}
                  className={cn(
                    "flex w-[4.5rem] flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-colors",
                    active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50",
                  )}
                >
                  <span className={cn("text-[0.7rem] font-semibold uppercase", !active && "text-muted-foreground")}>
                    {i === todayIdx ? "Today" : daysShort[i]}
                  </span>
                  <span className="w-full truncate text-xs font-bold">
                    {w ? w.name.replace("Full Body ", "FB ") : "Rest"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {!workout ? (
        <RestDay program={program} dayName={days[dayIdx]} onPick={(id) => setPicked({ day: dayIdx, workoutId: id })} />
      ) : (
        <>
          <section className="relative overflow-hidden rounded-3xl border bg-card p-5 md:p-7">
            <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative space-y-4">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
                  {days[dayIdx]} · {program.short}
                </p>
                <h2 className="mt-1 font-heading text-3xl font-black md:text-4xl">{workout.name}</h2>
                <p className="mt-1 text-muted-foreground">{workout.focus}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                  <Flame className="size-4 text-primary" /> {workout.exercises.length} exercises · {totalSets} sets
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                  <Clock className="size-4 text-primary" /> ~{estimateMinutes(workout)} min
                </span>
                {"wakeLock" in navigator && (
                  <button
                    type="button"
                    onClick={() => setAwake((a) => !a)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors",
                      awake ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <MonitorSmartphone className="size-4" /> {awake ? "Screen stays on" : "Keep screen on"}
                  </button>
                )}
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">Workout progress</span>
                  <span className="font-mono text-muted-foreground">
                    {doneSets}/{totalSets} sets
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          </section>

          {pct === 100 && (
            <div className="rounded-2xl border border-primary bg-primary/10 p-5 text-center">
              <p className="font-heading text-2xl font-black">Workout complete 🎉</p>
              <p className="mt-1 text-muted-foreground">
                Great work. Eat a protein-rich meal, sleep well, and check{" "}
                <Link href="/progress" className="font-medium text-foreground underline underline-offset-4">
                  your progress
                </Link>
                .
              </p>
            </div>
          )}

          <Link
            href="/recovery#warm-up"
            className="flex items-center gap-3 rounded-2xl border border-dashed p-4 text-sm hover:border-primary/60"
          >
            <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
              <Flame className="size-4" />
            </span>
            <span>
              <b>Warm up first:</b> 5 min light cardio, dynamic mobility, then 2–4 ramp-up sets on your first lift.
            </span>
          </Link>

          <div className="space-y-4">
            {workout.exercises.map((rx, i) => {
              const m = meta[rx.slug];
              if (!m) return null;
              return (
                <ExerciseLogger key={`${workout.id}-${rx.slug}-${i}`} index={i} name={m.name} load={m.load} rx={rx} />
              );
            })}
          </div>

          <section className="rounded-2xl border bg-card p-5">
            <h3 className="font-heading text-lg font-bold">Finish strong (optional)</h3>
            <p className="mb-3 text-sm text-muted-foreground">Add one after your lifting — 2–3× per week each.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <FinisherLink
                href="/cardio/core-finisher"
                icon={Target}
                title="10-min abs & core"
                text="Dead bugs, side planks, crunches"
              />
              <FinisherLink
                href="/cardio/zone2"
                icon={HeartPulse}
                title="Zone 2 cardio"
                text="15–30 min easy bike or incline walk"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function RestDay({
  program,
  dayName,
  onPick,
}: {
  program: ReturnType<typeof getProgram>;
  dayName: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border bg-card p-6 md:p-8">
        <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <BedDouble className="size-6" />
        </div>
        <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">{dayName}</p>
        <h2 className="mt-1 font-heading text-3xl font-black">Rest & recover</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Muscle is built while you recover. Today, aim for a walk (7–10k steps), hit your protein target, and get 7–9
          hours of sleep.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Moon, t: "Sleep 7–9 h", d: "Most powerful recovery tool" },
            { icon: Flame, t: "Protein 1.6–2.2 g/kg", d: "Spread over 3–5 meals" },
            { icon: Repeat, t: "Light movement", d: "Walk, mobility, stretching" },
          ].map((x) => (
            <div key={x.t} className="rounded-xl bg-muted/60 p-3">
              <x.icon className="mb-2 size-5 text-primary" />
              <p className="text-sm font-semibold">{x.t}</p>
              <p className="text-xs text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-3 rounded-2xl border bg-card p-5">
        <div>
          <h3 className="font-heading text-lg font-bold">Rest-day cardio (optional)</h3>
          <p className="text-sm text-muted-foreground">
            Easy cardio on rest days builds your engine and speeds recovery.
          </p>
        </div>
        <Link
          href="/cardio/zone2"
          className="flex items-center gap-3 rounded-xl border border-primary/50 bg-primary/10 p-4 hover:bg-primary/15"
        >
          <HeartPulse className="size-6 shrink-0 text-primary" />
          <span className="flex-1">
            <span className="block font-semibold">Recommended: Zone 2 Steady Cardio · 40 min</span>
            <span className="text-sm text-muted-foreground">
              Incline walk, bike or elliptical at a conversational pace
            </span>
          </span>
          <ArrowRight className="size-4" />
        </Link>
        <div className="grid gap-2 sm:grid-cols-3">
          <FinisherLink href="/cardio/walk-run" icon={Repeat} title="Walk–Run Starter" text="34 min · beginner" />
          <FinisherLink href="/cardio/norwegian-4x4" icon={Flame} title="Norwegian 4×4" text="40 min · VO₂max" />
          <FinisherLink href="/cardio/core-finisher" icon={Target} title="Abs & core" text="10 min" />
        </div>
        <WeeklyCardio compact />
      </section>
      <section className="rounded-2xl border bg-card p-5">
        <h3 className="font-heading font-bold">Missed a session this week?</h3>
        <p className="mb-3 text-sm text-muted-foreground">Don&apos;t skip it — do it today instead:</p>
        <div className="flex flex-wrap gap-2">
          {program.workouts.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => onPick(w.id)}
              className="rounded-full border px-4 py-2 text-sm font-medium hover:border-primary hover:bg-primary/10"
            >
              {w.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function FinisherLink({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof Flame;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-primary/60"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{text}</span>
      </span>
    </Link>
  );
}
