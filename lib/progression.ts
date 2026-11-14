import type { LoadType, Session } from "./types";
import type { Unit } from "./store";

export interface Target {
  sets: number;
  repMin: number;
  repMax: number;
}

export type RecKind = "start" | "increase" | "build" | "reduce" | "bodyweight-up";

export interface Recommendation {
  kind: RecKind;
  weight: number | null;
  targetReps: number[];
  headline: string;
  detail: string;
}

export function increment(load: LoadType, weight: number, unit: Unit): number {
  const kg = unit === "kg";
  switch (load) {
    case "lower":
      return kg ? (weight < 60 ? 2.5 : 5) : weight < 135 ? 5 : 10;
    case "upper":
      return kg ? 2.5 : 5;
    case "isolation":
      return kg ? 1 : 2.5;
    default:
      return 0; // bodyweight & cardio
  }
}

const round = (n: number, step: number) => Math.round(n / step) * step;

/**
 * Double progression:
 *  - All sets at the top of the range → add weight, restart at the bottom.
 *  - Otherwise keep the weight and add a rep to each set below the top.
 *  - Below the range two sessions running at the same weight → drop ~10%.
 */
export function recommend(
  target: Target,
  load: LoadType,
  history: Session[],
  unit: Unit,
  today: string | null,
): Recommendation {
  const past = history.filter((s) => s.date !== today);
  const last = past[past.length - 1];
  const bottom = Array(target.sets).fill(target.repMin);

  if (!last || last.sets.length === 0) {
    return {
      kind: "start",
      weight: null,
      targetReps: bottom,
      headline: "First session — find your working weight",
      detail:
        load === "bodyweight"
          ? `Do as many good reps as you can within ${target.repMin}–${target.repMax}, stopping 1–2 reps before failure.`
          : `Choose a weight you can lift for ${target.repMin}–${target.repMax} reps with 2–3 reps left in the tank. Log it — next time RepWise tells you what to do.`,
    };
  }

  const sets = last.sets.slice(0, target.sets);
  const reps = Array.from({ length: target.sets }, (_, i) => sets[i]?.reps ?? 0);
  const weight = Math.max(...sets.map((s) => s.weight || 0));
  const allTop = reps.every((r) => r >= target.repMax);
  const belowMin = reps.some((r) => r < target.repMin);

  if (allTop) {
    if (load === "bodyweight" || weight === 0) {
      return {
        kind: "bodyweight-up",
        weight: weight || null,
        targetReps: bottom,
        headline: "Top of the range — make it harder",
        detail:
          "You hit every set at the top of the range. Add load (vest, belt or dumbbell), slow the tempo, or move to a harder variation, then build reps again.",
      };
    }
    const inc = increment(load, weight, unit);
    const next = weight + inc;
    return {
      kind: "increase",
      weight: next,
      targetReps: bottom,
      headline: `Increase to ${next} ${unit}`,
      detail: `You hit ${target.repMax} reps on every set last time (${reps.join(", ")}). Add ${inc} ${unit} and aim for ${target.repMin}+ reps per set. If the jump feels too big, use the smallest increment available.`,
    };
  }

  // Two sessions in a row below the minimum at the same (or higher) weight → back off.
  const prev = past[past.length - 2];
  if (belowMin && prev && weight > 0) {
    const prevWeight = Math.max(...prev.sets.map((s) => s.weight || 0));
    const prevBelow = prev.sets.slice(0, target.sets).some((s) => s.reps < target.repMin);
    if (prevBelow && prevWeight >= weight) {
      const step = unit === "kg" ? 2.5 : 5;
      const next = Math.max(step, round(weight * 0.9, step));
      return {
        kind: "reduce",
        weight: next,
        targetReps: Array(target.sets).fill(target.repMin + 1),
        headline: `Reset to ${next} ${unit}`,
        detail:
          "You've been below the rep range for two sessions. Drop about 10% and build back up with clean reps. Also check sleep, food and stress — a deload may be due.",
      };
    }
  }

  const goal = reps.map((r) => Math.min(Math.max(r + 1, target.repMin), target.repMax));
  return {
    kind: "build",
    weight: weight || null,
    targetReps: goal,
    headline: weight ? `Stay at ${weight} ${unit} — beat last time` : "Beat last time",
    detail: `Last time: ${reps.join(", ")} reps. Aim for ${goal.join(", ")} — even one extra rep is progress. When every set reaches ${target.repMax}, the weight goes up.`,
  };
}

export function bestSet(sessions: Session[]) {
  let best: { weight: number; reps: number; e1rm: number; date: string } | null = null;
  for (const s of sessions) {
    for (const set of s.sets) {
      // Epley estimated 1RM
      const e1rm = set.weight * (1 + set.reps / 30);
      if (!best || e1rm > best.e1rm) best = { ...set, e1rm, date: s.date };
    }
  }
  return best;
}
