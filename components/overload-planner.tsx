"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { recommend } from "@/lib/progression";
import type { LoadType } from "@/lib/types";
import type { Unit } from "@/lib/store";
import { cn } from "@/lib/utils";

const field =
  "h-11 w-full rounded-lg border bg-background px-3 font-mono text-base tabular-nums outline-none focus:border-primary";

/** "What should I do next session?" — interactive double-progression calculator. */
export function OverloadPlanner() {
  const [unit, setUnit] = useState<Unit>("kg");
  const [load, setLoad] = useState<LoadType>("upper");
  const [weight, setWeight] = useState("60");
  const [repMin, setRepMin] = useState("8");
  const [repMax, setRepMax] = useState("12");
  const [reps, setReps] = useState(["10", "10", "9"]);

  const target = { sets: reps.length, repMin: Number(repMin) || 1, repMax: Math.max(Number(repMax) || 1, Number(repMin) || 1) };
  const session = { date: "2000-01-01", sets: reps.map((r) => ({ weight: Number(weight) || 0, reps: Number(r) || 0 })) };
  const rec = recommend(target, load, session, unit);
  const Icon = rec.kind === "increase" || rec.kind === "bodyweight-up" ? ArrowUpRight : rec.kind === "reduce" ? ArrowDownRight : TrendingUp;

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="font-heading text-xl font-bold">Overload planner</h3>
      <p className="mb-4 text-sm text-muted-foreground">Enter your last session and see exactly what to do next time.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Exercise type</span>
          <select className={cn(field, "font-sans")} value={load} onChange={(e) => setLoad(e.target.value as LoadType)}>
            <option value="upper">Upper-body compound</option>
            <option value="lower">Lower-body compound</option>
            <option value="isolation">Isolation</option>
            <option value="bodyweight">Bodyweight</option>
          </select>
        </label>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Weight used</span>
            <input className={field} inputMode="decimal" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </label>
          <div className="space-y-1 text-sm">
            <span className="font-medium">Unit</span>
            <div className="flex h-11 overflow-hidden rounded-lg border">
              {(["kg", "lb"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={cn("px-3 font-medium", unit === u && "bg-primary text-primary-foreground")}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Rep range — min</span>
          <input className={field} inputMode="numeric" type="number" value={repMin} onChange={(e) => setRepMin(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Rep range — max</span>
          <input className={field} inputMode="numeric" type="number" value={repMax} onChange={(e) => setRepMax(e.target.value)} />
        </label>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">Reps you got on each set</span>
          <span className="flex gap-1">
            <button
              type="button"
              className="rounded-md border px-2 py-0.5 disabled:opacity-40"
              disabled={reps.length <= 1}
              onClick={() => setReps((r) => r.slice(0, -1))}
            >
              − set
            </button>
            <button
              type="button"
              className="rounded-md border px-2 py-0.5 disabled:opacity-40"
              disabled={reps.length >= 6}
              onClick={() => setReps((r) => [...r, r[r.length - 1] ?? "8"])}
            >
              + set
            </button>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {reps.map((r, i) => (
            <input
              key={i}
              aria-label={`Set ${i + 1} reps`}
              className={cn(field, "text-center")}
              inputMode="numeric"
              type="number"
              value={r}
              onChange={(e) => setReps((all) => all.map((x, j) => (j === i ? e.target.value : x)))}
            />
          ))}
        </div>
      </div>

      <div
        className={cn(
          "mt-5 flex gap-3 rounded-xl border p-4",
          rec.kind === "increase" || rec.kind === "bodyweight-up"
            ? "border-primary/50 bg-primary/10"
            : rec.kind === "reduce"
              ? "border-warning/50 bg-warning/10"
              : "bg-muted/50",
        )}
      >
        <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="font-heading text-lg font-bold">Next session: {rec.headline}</p>
          <p className="text-sm text-muted-foreground">{rec.detail}</p>
          <p className="mt-2 font-mono text-sm">
            Target: {rec.weight ? `${rec.weight} ${unit} × ` : ""}
            {rec.targetReps.join(" / ")}
          </p>
        </div>
      </div>
    </div>
  );
}
