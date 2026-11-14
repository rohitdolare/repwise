"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const activity = [
  { v: 1.375, label: "Lifting 3×/week, mostly sitting" },
  { v: 1.55, label: "Lifting 4–5×/week, some walking" },
  { v: 1.725, label: "Training 6×/week or active job" },
];
const goals = [
  { id: "gain", label: "Build muscle", factor: 1.08 },
  { id: "maintain", label: "Maintain / recomp", factor: 1 },
  { id: "lose", label: "Lose fat", factor: 0.8 },
] as const;

const field =
  "h-11 w-full rounded-lg border bg-background px-3 text-base outline-none focus:border-primary font-mono tabular-nums";

export function NutritionCalculator() {
  const [sex, setSex] = useState<"m" | "f">("m");
  const [age, setAge] = useState("25");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");
  const [act, setAct] = useState(1.55);
  const [goal, setGoal] = useState<(typeof goals)[number]["id"]>("gain");

  const kg = Number(weight) || 0;
  const valid = kg > 30 && Number(height) > 120 && Number(age) >= 14;
  // Mifflin–St Jeor
  const bmr = 10 * kg + 6.25 * (Number(height) || 0) - 5 * (Number(age) || 0) + (sex === "m" ? 5 : -161);
  const maintenance = Math.round((bmr * act) / 10) * 10;
  const g = goals.find((x) => x.id === goal)!;
  const target = Math.round((maintenance * g.factor) / 10) * 10;
  const proteinLo = Math.round(kg * 1.6);
  const proteinHi = Math.round(kg * (goal === "lose" ? 2.4 : 2.2));
  const fat = Math.round(kg * 0.8);
  const carbs = Math.max(0, Math.round((target - proteinHi * 4 - fat * 9) / 4));
  const water = (kg * 0.035).toFixed(1);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="font-heading text-xl font-bold">Your daily targets</h2>
      <p className="mb-4 text-sm text-muted-foreground">A starting estimate — adjust based on your weekly weigh-ins.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2 space-y-1 text-sm sm:col-span-1">
          <span className="font-medium">Sex</span>
          <div className="flex h-11 overflow-hidden rounded-lg border">
            {(
              [
                ["m", "Male"],
                ["f", "Female"],
              ] as const
            ).map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => setSex(v)}
                className={cn("flex-1 text-sm font-medium", sex === v && "bg-primary text-primary-foreground")}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Age</span>
          <input className={field} type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Height (cm)</span>
          <input className={field} type="number" inputMode="numeric" value={height} onChange={(e) => setHeight(e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Weight (kg)</span>
          <input className={field} type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </label>
      </div>
      <label className="mt-3 block space-y-1 text-sm">
        <span className="font-medium">Activity</span>
        <select className={cn(field, "font-sans")} value={act} onChange={(e) => setAct(Number(e.target.value))}>
          {activity.map((a) => (
            <option key={a.v} value={a.v}>
              {a.label}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {goals.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setGoal(x.id)}
            className={cn(
              "rounded-lg border px-2 py-2.5 text-sm font-medium",
              goal === x.id ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50",
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      {valid ? (
        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Calories", `${target}`, `kcal · maintenance ≈ ${maintenance}`],
            ["Protein", `${proteinLo}–${proteinHi} g`, `${goal === "lose" ? "1.6–2.4" : "1.6–2.2"} g/kg`],
            ["Fat", `≥ ${fat} g`, "≈ 0.8 g/kg minimum"],
            ["Carbs", `~${carbs} g`, "the remaining calories"],
          ].map(([k, v, s]) => (
            <div key={k} className="rounded-xl bg-muted/60 p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="font-heading text-xl font-black">{v}</dd>
              <dd className="text-[0.7rem] text-muted-foreground">{s}</dd>
            </div>
          ))}
          <div className="col-span-2 rounded-xl bg-muted/60 p-3 sm:col-span-4">
            <p className="text-sm">
              💧 Water: about <b>{water} L/day</b> plus extra around training. 🍽️ Split protein into 3–5 meals of{" "}
              <b>{Math.round(kg * 0.3)}–{Math.round(kg * 0.4)} g</b>.
            </p>
          </div>
        </dl>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">Enter your details to see your targets.</p>
      )}
    </div>
  );
}
