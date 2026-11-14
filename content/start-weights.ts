import type { Unit } from "@/lib/store";

/**
 * Conservative beginner starting loads in kg, used when an exercise has never been
 * logged. Light on purpose: learn the movement, then progress. Dumbbell and
 * kettlebell values are per hand. Machine values are the stack/plate setting.
 * Bodyweight and cardio exercises are not listed (reps only).
 */
const startWeightsKg: Record<string, { kg: number; perHand?: boolean }> = {
  // Chest
  "barbell-bench-press": { kg: 20 }, // empty bar
  "dumbbell-bench-press": { kg: 10, perHand: true },
  "incline-dumbbell-press": { kg: 8, perHand: true },
  "cable-fly": { kg: 5, perHand: true },
  // Back
  "lat-pulldown": { kg: 25 },
  "barbell-row": { kg: 30 },
  "one-arm-dumbbell-row": { kg: 12 },
  "seated-cable-row": { kg: 25 },
  "face-pull": { kg: 10 },
  // Shoulders
  "overhead-press": { kg: 20 },
  "seated-dumbbell-shoulder-press": { kg: 6, perHand: true },
  "lateral-raise": { kg: 4, perHand: true },
  // Legs
  "back-squat": { kg: 20 },
  "goblet-squat": { kg: 12 },
  "leg-press": { kg: 40 },
  "romanian-deadlift": { kg: 30 },
  "bulgarian-split-squat": { kg: 6, perHand: true },
  "leg-curl": { kg: 20 },
  "hip-thrust": { kg: 30 },
  "calf-raise": { kg: 20 },
  deadlift: { kg: 40 },
  // Arms
  "barbell-curl": { kg: 15 },
  "hammer-curl": { kg: 6, perHand: true },
  "triceps-pushdown": { kg: 15 },
  "overhead-triceps-extension": { kg: 10 },
  // Core & conditioning
  "cable-crunch": { kg: 15 },
  "pallof-press": { kg: 5 },
  "kettlebell-swing": { kg: 12 },
};

/** Suggested first-session weight in the user's unit, or null for bodyweight/cardio. */
export function startWeight(slug: string, unit: Unit): { weight: number; perHand: boolean } | null {
  const s = startWeightsKg[slug];
  if (!s) return null;
  const weight = unit === "kg" ? s.kg : Math.max(5, Math.round((s.kg * 2.2) / 5) * 5);
  return { weight, perHand: !!s.perHand };
}
