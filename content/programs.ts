import type { Prescription, Program } from "@/lib/types";

const p = (slug: string, sets: number, repMin: number, repMax: number, rir: string, restSec: number): Prescription => ({
  slug,
  sets,
  repMin,
  repMax,
  rir,
  restSec,
});

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const programs: Program[] = [
  {
    id: "full-body-3",
    name: "Full Body Foundation",
    short: "Full Body",
    level: "Beginner",
    daysPerWeek: 3,
    summary:
      "Three full-body sessions a week. You train each muscle 3× per week, which is ideal for learning technique and fast beginner progress.",
    whoFor: "New lifters, or anyone returning after a long break. Also great if you can only train 3 days.",
    schedule: ["fb-a", null, "fb-b", null, "fb-c", null, null],
    cardio: [
      "Tue & Thu: 30–40 min Zone 2 (incline walk or bike)",
      "Sat: Walk–Run Starter or a long walk",
      "Core finisher after 2 of your lifting sessions",
    ],
    workouts: [
      {
        id: "fb-a",
        name: "Full Body A",
        focus: "Squat pattern · Horizontal press · Vertical pull",
        exercises: [
          p("goblet-squat", 3, 8, 12, "2–3", 120),
          p("dumbbell-bench-press", 3, 8, 12, "2–3", 120),
          p("lat-pulldown", 3, 8, 12, "2–3", 90),
          p("romanian-deadlift", 2, 8, 10, "2–3", 120),
          p("lateral-raise", 2, 12, 15, "1–2", 60),
          p("plank", 2, 20, 40, "—", 60),
        ],
      },
      {
        id: "fb-b",
        name: "Full Body B",
        focus: "Leg press · Overhead press · Horizontal pull",
        exercises: [
          p("leg-press", 3, 10, 15, "2–3", 120),
          p("seated-dumbbell-shoulder-press", 3, 8, 12, "2–3", 90),
          p("seated-cable-row", 3, 8, 12, "2–3", 90),
          p("hip-thrust", 3, 8, 12, "2–3", 90),
          p("triceps-pushdown", 2, 10, 15, "1–2", 60),
          p("barbell-curl", 2, 10, 12, "1–2", 60),
        ],
      },
      {
        id: "fb-c",
        name: "Full Body C",
        focus: "Hinge · Incline press · Row",
        exercises: [
          p("romanian-deadlift", 3, 8, 10, "2–3", 120),
          p("incline-dumbbell-press", 3, 8, 12, "2–3", 90),
          p("one-arm-dumbbell-row", 3, 8, 12, "2–3", 90),
          p("goblet-squat", 2, 10, 15, "2–3", 90),
          p("face-pull", 2, 12, 20, "1–2", 60),
          p("hanging-knee-raise", 2, 8, 15, "1–2", 60),
        ],
      },
    ],
  },
  {
    id: "upper-lower-4",
    name: "Upper / Lower Split",
    short: "Upper/Lower",
    level: "Beginner → Intermediate",
    daysPerWeek: 4,
    summary:
      "Four days: two upper, two lower. Every muscle is trained twice a week with more weekly volume than a 3-day plan.",
    whoFor: "Lifters with 3+ months of consistent training who can commit to 4 days.",
    schedule: ["ul-upper-a", "ul-lower-a", null, "ul-upper-b", "ul-lower-b", null, null],
    cardio: [
      "Wed: 30–40 min Zone 2",
      "Sat: Norwegian 4×4 or 10-20-30 intervals on the bike or rower",
      "Core finisher after both Upper days",
    ],
    workouts: [
      {
        id: "ul-upper-a",
        name: "Upper A",
        focus: "Strength-biased · Bench & row",
        exercises: [
          p("barbell-bench-press", 3, 6, 10, "1–3", 180),
          p("barbell-row", 3, 6, 10, "1–3", 150),
          p("seated-dumbbell-shoulder-press", 2, 8, 12, "1–2", 90),
          p("lat-pulldown", 2, 10, 12, "1–2", 90),
          p("triceps-pushdown", 2, 10, 15, "0–2", 60),
          p("barbell-curl", 2, 10, 12, "0–2", 60),
        ],
      },
      {
        id: "ul-lower-a",
        name: "Lower A",
        focus: "Squat-focused",
        exercises: [
          p("back-squat", 3, 5, 8, "1–3", 180),
          p("romanian-deadlift", 3, 8, 10, "1–3", 150),
          p("leg-press", 2, 10, 15, "1–2", 120),
          p("leg-curl", 3, 10, 15, "0–2", 60),
          p("calf-raise", 3, 10, 15, "0–2", 60),
          p("plank", 2, 20, 45, "—", 60),
        ],
      },
      {
        id: "ul-upper-b",
        name: "Upper B",
        focus: "Hypertrophy-biased · Incline & pull-ups",
        exercises: [
          p("incline-dumbbell-press", 3, 8, 12, "1–2", 120),
          p("pull-up", 3, 6, 10, "1–2", 150),
          p("seated-cable-row", 3, 8, 12, "1–2", 90),
          p("lateral-raise", 3, 12, 20, "0–2", 60),
          p("overhead-triceps-extension", 2, 10, 15, "0–2", 60),
          p("hammer-curl", 2, 10, 15, "0–2", 60),
        ],
      },
      {
        id: "ul-lower-b",
        name: "Lower B",
        focus: "Hinge-focused",
        exercises: [
          p("deadlift", 3, 4, 6, "2–3", 210),
          p("bulgarian-split-squat", 3, 8, 12, "1–2", 90),
          p("hip-thrust", 3, 8, 12, "1–2", 90),
          p("leg-curl", 2, 10, 15, "0–2", 60),
          p("calf-raise", 3, 10, 15, "0–2", 60),
          p("hanging-knee-raise", 3, 8, 15, "1–2", 60),
        ],
      },
    ],
  },
  {
    id: "ppl-ul-5",
    name: "Push · Pull · Legs + Upper/Lower",
    short: "PPL + U/L",
    level: "Intermediate",
    daysPerWeek: 5,
    summary:
      "The RepWise signature week: Push, Pull, Legs, a rest day, then Upper and Lower. Each muscle is hit about twice per week with plenty of volume.",
    whoFor: "Consistent lifters who enjoy training 5 days and want more volume per muscle.",
    schedule: ["ppl-push", "ppl-pull", "ppl-legs", null, "ppl-upper", "ppl-lower", null],
    cardio: [
      "Thu: 30–40 min Zone 2 (active recovery)",
      "Sun: optional easy walk, or Norwegian 4×4 if recovery is good",
      "Core finisher after Push and Upper days; cable crunches are on Legs day",
    ],
    workouts: [
      {
        id: "ppl-push",
        name: "Push",
        focus: "Chest · Shoulders · Triceps",
        exercises: [
          p("barbell-bench-press", 3, 6, 10, "1–3", 180),
          p("incline-dumbbell-press", 3, 8, 12, "1–2", 120),
          p("seated-dumbbell-shoulder-press", 2, 8, 12, "1–2", 90),
          p("lateral-raise", 3, 12, 20, "0–2", 60),
          p("triceps-pushdown", 2, 10, 15, "0–2", 60),
          p("overhead-triceps-extension", 2, 10, 15, "0–2", 60),
        ],
      },
      {
        id: "ppl-pull",
        name: "Pull",
        focus: "Back · Rear delts · Biceps",
        exercises: [
          p("pull-up", 3, 6, 10, "1–2", 150),
          p("barbell-row", 3, 6, 10, "1–3", 150),
          p("seated-cable-row", 2, 10, 12, "1–2", 90),
          p("face-pull", 3, 12, 20, "1–2", 60),
          p("barbell-curl", 2, 8, 12, "0–2", 60),
          p("hammer-curl", 2, 10, 15, "0–2", 60),
        ],
      },
      {
        id: "ppl-legs",
        name: "Legs",
        focus: "Quads · Hamstrings · Glutes · Calves",
        exercises: [
          p("back-squat", 3, 5, 8, "1–3", 180),
          p("romanian-deadlift", 3, 8, 10, "1–3", 150),
          p("leg-press", 2, 10, 15, "1–2", 120),
          p("leg-curl", 3, 10, 15, "0–2", 60),
          p("calf-raise", 4, 10, 15, "0–2", 60),
          p("cable-crunch", 3, 10, 15, "0–2", 60),
        ],
      },
      {
        id: "ppl-upper",
        name: "Upper",
        focus: "Overhead press · Back width · Chest",
        exercises: [
          p("overhead-press", 3, 6, 10, "1–3", 150),
          p("lat-pulldown", 3, 8, 12, "1–2", 90),
          p("dumbbell-bench-press", 3, 8, 12, "1–2", 120),
          p("one-arm-dumbbell-row", 3, 8, 12, "1–2", 90),
          p("cable-fly", 2, 12, 15, "0–2", 60),
          p("lateral-raise", 2, 15, 20, "0–2", 60),
        ],
      },
      {
        id: "ppl-lower",
        name: "Lower",
        focus: "Deadlift · Single-leg · Glutes",
        exercises: [
          p("deadlift", 3, 4, 6, "2–3", 210),
          p("bulgarian-split-squat", 3, 8, 12, "1–2", 90),
          p("hip-thrust", 3, 8, 12, "1–2", 90),
          p("leg-curl", 2, 10, 15, "0–2", 60),
          p("calf-raise", 3, 10, 15, "0–2", 60),
          p("hanging-knee-raise", 3, 10, 15, "1–2", 60),
        ],
      },
    ],
  },
];

export const defaultProgramId = "ppl-ul-5";

export function getProgram(id: string | null | undefined): Program {
  return programs.find((p) => p.id === id) ?? programs.find((p) => p.id === defaultProgramId)!;
}

/** JS getDay() (0 = Sunday) → schedule index (0 = Monday). */
export function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}
