"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CalendarCheck, Download, Dumbbell, Trash2, Trophy, Upload } from "lucide-react";
import type { LoadType, Prescription } from "@/lib/types";
import { bestSet, recommend } from "@/lib/progression";
import { clearAll, exportData, importData, updateSettings, useLogs, useSettings, useTodayKey } from "@/lib/store";
import { getProgram } from "@/content/programs";
import { CardioHistory, WeeklyCardio } from "./cardio-widgets";
import { cn } from "@/lib/utils";

export type ProgressMeta = Record<string, { name: string; load: LoadType; rx: Prescription }>;

export function ProgressView({ meta }: { meta: ProgressMeta }) {
  const logs = useLogs();
  const { unit, programId } = useSettings();
  const today = useTodayKey();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const slugs = Object.keys(logs).filter((s) => meta[s] && logs[s].length);
  const dates = new Set(slugs.flatMap((s) => logs[s].map((x) => x.date)));
  const totalSets = slugs.reduce((t, s) => t + logs[s].reduce((n, x) => n + x.sets.length, 0), 0);
  const last7 = [...dates].filter((d) => today && daysBetween(d, today) < 7).length;

  const rows = slugs
    .map((s) => ({ slug: s, sessions: logs[s], last: logs[s][logs[s].length - 1] }))
    .sort((a, b) => b.last.date.localeCompare(a.last.date));

  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-3 gap-2">
        {[
          { icon: CalendarCheck, k: "Workout days", v: dates.size },
          { icon: Dumbbell, k: "Sets logged", v: totalSets },
          { icon: Trophy, k: "Days this week", v: last7 },
        ].map((x) => (
          <div key={x.k} className="rounded-2xl border bg-card p-4">
            <x.icon className="mb-2 size-5 text-primary" />
            <dd className="font-heading text-3xl font-black">{x.v}</dd>
            <dt className="text-xs text-muted-foreground">{x.k}</dt>
          </div>
        ))}
      </dl>

      <section className="space-y-3">
        <h2 className="font-heading text-xl font-bold">Cardio</h2>
        <WeeklyCardio />
        <CardioHistory />
        <Link href="/cardio" className="inline-block text-sm font-semibold text-primary">
          Start a cardio session →
        </Link>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-xl font-bold">Exercises & next targets</h2>
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <p className="font-medium">No workouts logged yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">Log your first set and your progress shows up here.</p>
            <Link
              href="/today"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Go to today&apos;s workout
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ slug, sessions, last }) => {
              const m = meta[slug];
              const best = bestSet(sessions);
              const rec = recommend(m.rx, m.load, sessions, unit, null);
              return (
                <li key={slug} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/exercises/${slug}`}
                      className="font-heading font-bold underline-offset-4 hover:underline"
                    >
                      {m.name}
                    </Link>
                    <span className="shrink-0 text-xs text-muted-foreground">{sessions.length} sessions</span>
                  </div>
                  <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
                    <p>
                      <span className="block text-xs text-muted-foreground">Last ({formatDate(last.date)})</span>
                      <span className="font-mono">
                        {last.sets.map((x) => (x.weight ? `${x.weight}×${x.reps}` : x.reps)).join(" · ")}
                      </span>
                    </p>
                    <p>
                      <span className="block text-xs text-muted-foreground">Best set</span>
                      <span className="font-mono">
                        {best && best.weight
                          ? `${best.weight} ${unit} × ${best.reps}`
                          : best
                            ? `${best.reps} reps`
                            : "—"}
                      </span>
                    </p>
                    <p>
                      <span className="block text-xs text-muted-foreground">Next time</span>
                      <span className={cn("font-semibold", rec.kind === "increase" && "text-primary")}>
                        {rec.headline}
                      </span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-4 font-heading text-xl font-bold">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Weight unit</p>
              <p className="text-sm text-muted-foreground">Used for logging and weight jumps.</p>
            </div>
            <div className="flex overflow-hidden rounded-lg border">
              {(["kg", "lb"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => updateSettings({ unit: u })}
                  className={cn("px-4 py-2 text-sm font-semibold", unit === u && "bg-primary text-primary-foreground")}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">Current plan</p>
              <p className="text-sm text-muted-foreground">{getProgram(programId).name}</p>
            </div>
            <Link href="/routine" className="rounded-lg border px-4 py-2 text-sm font-semibold">
              Change
            </Link>
          </div>
          <div className="border-t pt-4">
            <p className="font-medium">Your data</p>
            <p className="mb-3 text-sm text-muted-foreground">
              Everything is stored privately on this device. Export a backup to move it to another phone.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([exportData()], { type: "application/json" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = `repwise-backup-${today ?? "data"}.json`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
              >
                <Download className="size-4" /> Export
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
              >
                <Upload className="size-4" /> Import
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    importData(await f.text());
                    setMsg("Backup restored.");
                  } catch {
                    setMsg("That file isn't a valid RepWise backup.");
                  }
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete all logged workouts on this device? This can't be undone.")) {
                    clearAll();
                    setMsg("All workout data cleared.");
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive"
              >
                <Trash2 className="size-4" /> Clear all
              </button>
            </div>
            {msg && <p className="mt-2 text-sm text-muted-foreground">{msg}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(b + "T00:00") - Date.parse(a + "T00:00")) / 86_400_000);
}

function formatDate(d: string) {
  return new Date(d + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
