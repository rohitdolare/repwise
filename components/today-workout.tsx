"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  CalendarCog,
  Clock,
  Flame,
  HeartPulse,
  MonitorSmartphone,
  Moon,
  Repeat,
  Target,
} from "lucide-react";
import { WeeklyCardio } from "./cardio-widgets";
import { days, daysShort, getProgram, mondayIndex, shortWorkoutName } from "@/content/programs";
import { isCustomSchedule, useLogs, useSchedule, useSettings, useTodayKey, useWeekday } from "@/lib/store";
import { ScheduleEditor } from "./schedule-editor";
import type { LoadType, WorkoutDay } from "@/lib/types";
import { ExerciseLogger } from "./exercise-logger";
import { useWakeLock } from "@/lib/wake-lock";
import { cn } from "@/lib/utils";

/** Minimal info about each exercise the client needs (keeps the full library out of the bundle). */
export type ExerciseMeta = Record<
  string,
  { name: string; load: LoadType; timed?: boolean; harder?: { slug: string; name: string } }
>;

function estimateMinutes(w: WorkoutDay) {
  const sec = w.exercises.reduce((t, e) => t + e.sets * (45 + e.restSec), 0);
  return Math.round((sec + 600) / 60 / 5) * 5; // + ~10 min warm-up
}

export function TodayWorkout({ meta }: { meta: ExerciseMeta }) {
  const settings = useSettings();
  const program = getProgram(settings.programId);
  const schedule = useSchedule(program);
  const [editing, setEditing] = useState(false);
  const weekday = useWeekday();
  const todayIdx = weekday === null ? null : mondayIndex(weekday);
  const [picked, setPicked] = useState<{ day: number; workoutId?: string } | null>(null);
  // null = automatic: keep the screen on once the workout has started.
  const [awakePref, setAwakePref] = useState<boolean | null>(null);
  const logs = useLogs();
  const today = useTodayKey();
  const stripRef = useRef<HTMLDivElement>(null);

  // Scroll the week strip so "Today" is visible on narrow phones.
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.querySelector<HTMLElement>("[data-today]");
    if (strip && el) strip.scrollLeft = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
  }, [todayIdx]);

  if (todayIdx === null) {
    return <div className="h-96 animate-pulse rounded-2xl bg-muted" />;
  }

  const dayIdx = picked?.day ?? todayIdx;
  const workoutId = picked?.workoutId ?? schedule[dayIdx];
  const workout = program.workouts.find((w) => w.id === workoutId);

  const totalSets = workout?.exercises.reduce((t, e) => t + e.sets, 0) ?? 0;
  const doneSets =
    workout?.exercises.reduce((t, e) => {
      const s = logs[e.slug]?.find((x) => x.date === today);
      return t + Math.min(e.sets, s?.sets.length ?? 0);
    }, 0) ?? 0;
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;
  const awake = awakePref ?? (doneSets > 0 && pct < 100);

  return (
    <div className="space-y-6">
      {/* Week strip */}
      <div ref={stripRef} className="no-scrollbar -mx-4 overflow-x-auto scroll-smooth px-4">
        <ol className="flex min-w-max gap-2">
          {schedule.map((wid, i) => {
            const w = program.workouts.find((x) => x.id === wid);
            const active = i === dayIdx && !picked?.workoutId;
            return (
              <li key={i}>
                <button
                  type="button"
                  data-today={i === todayIdx ? "" : undefined}
                  aria-pressed={active}
                  onClick={() => setPicked(i === todayIdx ? null : { day: i })}
                  className={cn(
                    "flex w-[4.5rem] flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-colors",
                    active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50",
                  )}
                >
                  <span className={cn("text-[0.7rem] font-semibold uppercase", !active && "text-muted-foreground")}>
                    {i === todayIdx ? "Today" : daysShort[i]}
                  </span>
                  <span className="w-full truncate text-xs font-bold">{w ? shortWorkoutName(w.name) : "Rest"}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="-mt-5 -mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <CalendarCog className="size-4" /> {editing ? "Close" : "Change my training days"}
        </button>
      </div>

      {editing && (
        <ScheduleEditor
          program={program}
          schedule={schedule}
          isCustom={isCustomSchedule(settings, program)}
          onDone={() => setEditing(false)}
        />
      )}

      {!workout ? (
        <RestDay program={program} dayName={days[dayIdx]} onPick={(id) => setPicked({ day: dayIdx, workoutId: id })} />
      ) : (
        <>
          <WakeLock on={awake} />
          {/* Phone: compact progress that stays visible while you scroll through exercises. */}
          <div className="top-header sticky z-30 -mx-4 border-b bg-background/90 px-4 py-2 backdrop-blur-lg md:hidden">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-heading font-bold">{workout.name}</span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                {doneSets}/{totalSets} sets · {pct}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <section className="relative -mt-3 overflow-hidden rounded-3xl border bg-card p-5 md:mt-0 md:p-7">
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
                    onClick={() => setAwakePref(!awake)}
                    className={cn(
                      "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 py-1 transition-colors",
                      awake ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <MonitorSmartphone className="size-4" /> {awake ? "Screen stays on" : "Keep screen on"}
                  </button>
                )}
              </div>
              <div className="hidden md:block">
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
              <b>Warm up first:</b>{" "}
              {program.setting === "home"
                ? "5 min — march or jog in place, arm circles, 10 slow squats and hip openers."
                : "5 min light cardio, dynamic mobility, then 2–4 ramp-up sets on your first lift."}
            </span>
          </Link>

          <div className="space-y-4">
            {workout.exercises.map((rx, i) => {
              const m = meta[rx.slug];
              if (!m) return null;
              return (
                <ExerciseLogger
                  key={`${workout.id}-${rx.slug}-${i}`}
                  index={i}
                  name={m.name}
                  load={m.load}
                  timed={m.timed}
                  harder={m.harder}
                  rx={rx}
                />
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

function WakeLock({ on }: { on: boolean }) {
  useWakeLock(on);
  return null;
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
        {program.setting === "home" ? (
          <>
            <Link
              href="/cardio/home-express"
              className="flex items-center gap-3 rounded-xl border border-primary/50 bg-primary/10 p-4 hover:bg-primary/15"
            >
              <HeartPulse className="size-6 shrink-0 text-primary" />
              <span className="flex-1">
                <span className="block font-semibold">Recommended: Home Express Circuit · 25 min</span>
                <span className="text-sm text-muted-foreground">
                  Guided bodyweight circuit — or a 30–45 min brisk walk outdoors
                </span>
              </span>
              <ArrowRight className="size-4" />
            </Link>
            <div className="grid gap-2 sm:grid-cols-3">
              <FinisherLink
                href="/cardio/hiit-circuit"
                icon={Flame}
                title="No-equipment HIIT"
                text="20 min · intense"
              />
              <FinisherLink href="/cardio/core-finisher" icon={Target} title="Abs & core" text="10 min" />
              <FinisherLink href="/home-workouts" icon={Repeat} title="Home guide" text="Progress without weights" />
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
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
