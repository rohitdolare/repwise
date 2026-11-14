import type { LoadType, Session } from "./types";
import type { Unit } from "./store";
import { startWeight } from "@/content/start-weights";

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


/**
 * Double progression against the PREVIOUS session only:
 *  - No previous → suggested beginner start weight.
 *  - All sets at the top of the range → add weight, restart at the bottom.
 *  - Otherwise keep the weight: match or beat last time's reps.
 * `targetReps` is what each set row is pre-filled with (previous reps = "match").
 */
export function recommend(
  target: Target & { slug?: string },
  load: LoadType,
  previous: Session | undefined,
  unit: Unit,
): Recommendation {
  const bottom = Array(target.sets).fill(target.repMin);

  if (!previous || previous.sets.length === 0) {
    const start = target.slug ? startWeight(target.slug, unit) : null;
    if (!start) {
      return {
        kind: "start",
        weight: null,
        targetReps: bottom,
        headline: "First session — find your level",
        detail: `Do ${target.repMin}–${target.repMax} good reps per set, stopping 1–2 reps before failure. Next time you'll see these numbers to match or beat.`,
      };
    }
    return {
      kind: "start",
      weight: start.weight,
      targetReps: bottom,
      headline: `Suggested start: ${start.weight} ${unit}${start.perHand ? " per hand" : ""}`,
      detail: `Light on purpose. If every rep feels easy (4+ reps left in the tank), go up a step on the next set. Whatever you log today becomes your number to beat next time.`,
    };
  }

  const sets = previous.sets.slice(0, target.sets);
  const reps = Array.from({ length: target.sets }, (_, i) => sets[i]?.reps ?? sets[sets.length - 1]?.reps ?? target.repMin);
  const weight = Math.max(...sets.map((s) => s.weight || 0));
  const allTop = sets.length >= target.sets && reps.every((r) => r >= target.repMax);
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
      detail: `Last time you hit ${target.repMax} reps on every set (${reps.join(", ")}). Add ${inc} ${unit} and aim for ${target.repMin}+ reps per set. If the jump feels too big, use the smallest increment available.`,
    };
  }

  const last = sets.map((x) => (x.weight ? `${x.weight}×${x.reps}` : `${x.reps}`)).join(", ");
  return {
    kind: belowMin ? "reduce" : "build",
    weight: weight || null,
    targetReps: reps,
    headline: weight ? `Match or beat: ${weight} ${unit} × ${reps.join(", ")}` : `Match or beat: ${reps.join(", ")} reps`,
    detail: belowMin
      ? `Last time (${last}) was below ${target.repMin} reps. Keep the weight and get back into the range — if you miss it again, drop about 10%.`
      : `Last time: ${last}. Same numbers = matched; even one extra rep = beaten. When every set reaches ${target.repMax}, the weight goes up.`,
  };
}

export interface BestSet {
  weight: number;
  reps: number;
  e1rm: number;
  date: string;
}

/** Epley estimated 1RM (0 for bodyweight sets). */
const e1rm = (weight: number, reps: number) => weight * (1 + reps / 30);

/** The stronger of two sets (by estimated 1RM, then reps). */
export function betterSet(a: BestSet | undefined, b: { weight: number; reps: number; date: string }): BestSet {
  const cand = { weight: b.weight, reps: b.reps, date: b.date, e1rm: e1rm(b.weight, b.reps) };
  if (!a) return cand;
  if (cand.e1rm !== a.e1rm) return cand.e1rm > a.e1rm ? cand : a;
  return cand.reps > a.reps ? cand : a;
}

/** Compare today's set with the previous one: 1 = beat, 0 = matched, -1 = below. */
export function compareSet(today: { weight: number; reps: number }, prev: { weight: number; reps: number }): -1 | 0 | 1 {
  if (today.weight === prev.weight) return Math.sign(today.reps - prev.reps) as -1 | 0 | 1;
  const d = e1rm(today.weight, today.reps) - e1rm(prev.weight, prev.reps);
  return d > 0 ? 1 : d < 0 ? -1 : today.weight > prev.weight ? 1 : -1;
}
