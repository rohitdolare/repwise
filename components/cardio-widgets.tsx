"use client";

import { useState } from "react";
import { HeartPulse, Plus, Trash2 } from "lucide-react";
import { heartRateZones } from "@/content/cardio";
import { logCardio, removeCardio, useCardioLog, useTodayKey, weeklyCardioMinutes } from "@/lib/store";
import { cn } from "@/lib/utils";

const field = "h-11 w-full rounded-lg border bg-background px-3 text-base outline-none focus:border-primary";
const GOAL = 150;

export function HeartRateZones() {
  const [age, setAge] = useState("25");
  const [rest, setRest] = useState("");
  const a = Number(age);
  const r = Number(rest);
  const valid = a >= 12 && a <= 90;
  const max = Math.round(208 - 0.7 * a); // Tanaka et al. 2001
  const karvonen = r >= 35 && r <= 110;
  const bpm = (pct: number) => Math.round(karvonen ? r + (max - r) * pct : max * pct);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="flex items-center gap-2 font-heading text-xl font-bold">
        <HeartPulse className="size-5 text-primary" /> Your heart-rate zones
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Max HR estimated with the Tanaka formula (208 − 0.7 × age). Add your resting heart rate for more personal zones
        (Karvonen method).
      </p>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Age</span>
          <input
            className={cn(field, "font-mono")}
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Resting HR (optional)</span>
          <input
            className={cn(field, "font-mono")}
            type="number"
            inputMode="numeric"
            placeholder="e.g. 62"
            value={rest}
            onChange={(e) => setRest(e.target.value)}
          />
        </label>
      </div>
      {valid && (
        <>
          <p className="mt-4 text-sm">
            Estimated max heart rate: <b className="font-mono">{max} bpm</b>
          </p>
          <ul className="mt-3 space-y-2">
            {heartRateZones.map((z) => (
              <li
                key={z.zone}
                className={cn(
                  "grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-xl border p-3",
                  z.zone === 2 && "border-primary/60 bg-primary/10",
                )}
              >
                <span className="grid size-10 place-items-center rounded-lg bg-muted font-heading font-black">
                  Z{z.zone}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {z.name} · {Math.round(z.lo * 100)}–{Math.round(z.hi * 100)}%
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {z.feel} — {z.use}
                  </span>
                </span>
                <span className="font-mono text-sm font-bold whitespace-nowrap">
                  {bpm(z.lo)}–{bpm(z.hi)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            No heart-rate monitor? Use the talk test: Zone 2 = you can speak in full sentences; Zone 4 = only a few
            words.
          </p>
        </>
      )}
    </div>
  );
}

export function WeeklyCardio({ compact = false }: { compact?: boolean }) {
  const log = useCardioLog();
  const today = useTodayKey();
  const minutes = weeklyCardioMinutes(log, today);
  const pct = Math.min(100, (minutes / GOAL) * 100);
  return (
    <div className={cn("rounded-2xl border bg-card", compact ? "p-4" : "p-5")}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-heading font-bold">Cardio this week</p>
        <p className="font-mono text-sm">
          <b className="text-lg">{minutes}</b> / {GOAL} min
        </p>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {minutes >= GOAL
          ? "Weekly WHO target reached. Great work! 💚"
          : `Last 7 days. WHO target: 150 min moderate (or 75 min vigorous). ${GOAL - minutes} min to go.`}
      </p>
    </div>
  );
}

const quickTypes = ["Zone 2 cardio", "Running", "Cycling", "Walking", "Sport", "Swimming", "HIIT"];

export function LogCardioForm() {
  const [label, setLabel] = useState(quickTypes[0]);
  const [minutes, setMinutes] = useState("30");
  const [done, setDone] = useState(false);
  return (
    <form
      className="rounded-2xl border bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const n = Math.round(Number(minutes));
        if (!n || n <= 0 || n > 600) return;
        logCardio({ workoutId: null, label, minutes: n });
        setDone(true);
        setTimeout(() => setDone(false), 2500);
      }}
    >
      <p className="font-heading font-bold">Log other cardio</p>
      <p className="mb-3 text-sm text-muted-foreground">Did a run, a match or a swim? Add it to your weekly minutes.</p>
      <div className="flex flex-wrap gap-2">
        {quickTypes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setLabel(t)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm",
              label === t ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Minutes</span>
          <input
            className={cn(field, "font-mono")}
            type="number"
            inputMode="numeric"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> {done ? "Logged!" : "Log min"}
        </button>
      </div>
    </form>
  );
}

export function CardioHistory() {
  const log = useCardioLog();
  if (!log.length) return <p className="text-sm text-muted-foreground">No cardio logged yet.</p>;
  return (
    <ul className="divide-y rounded-xl border text-sm">
      {log
        .map((e, i) => ({ e, i }))
        .slice(-8)
        .reverse()
        .map(({ e, i }) => (
          <li key={i} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <span>
              <span className="font-medium">{e.label}</span>
              <span className="ml-2 text-muted-foreground">
                {new Date(e.date + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })}
              </span>
            </span>
            <span className="flex items-center gap-3">
              <span className="font-mono">{e.minutes} min</span>
              <button
                type="button"
                onClick={() => removeCardio(i)}
                aria-label="Remove entry"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </span>
          </li>
        ))}
    </ul>
  );
}
