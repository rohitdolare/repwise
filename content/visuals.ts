import type { Muscle } from "react-body-highlighter";

export interface ExerciseVisual {
  /** Folder id in Free Exercise DB (public domain) — used for attribution. */
  source: string;
  primary: Muscle[];
  secondary: Muscle[];
  /** Shown when the photo is a close variation rather than the exact exercise. */
  note?: string;
}

export const IMAGE_CREDIT = {
  name: "Free Exercise DB",
  url: "https://github.com/yuhonas/free-exercise-db",
  license: "Public domain (Unlicense)",
};

export const exerciseImages = (slug: string) =>
  [`/media/exercises/${slug}/0.webp`, `/media/exercises/${slug}/1.webp`] as const;

export const visuals: Record<string, ExerciseVisual> = {
  "barbell-bench-press": {
    source: "Barbell_Bench_Press_-_Medium_Grip",
    primary: ["chest"],
    secondary: ["front-deltoids", "triceps"],
  },
  "dumbbell-bench-press": {
    source: "Dumbbell_Bench_Press",
    primary: ["chest"],
    secondary: ["front-deltoids", "triceps"],
  },
  "incline-dumbbell-press": {
    source: "Incline_Dumbbell_Press",
    primary: ["chest", "front-deltoids"],
    secondary: ["triceps"],
  },
  "push-up": { source: "Pushups", primary: ["chest"], secondary: ["triceps", "front-deltoids", "abs"] },
  "cable-fly": {
    source: "Cable_Crossover",
    primary: ["chest"],
    secondary: ["front-deltoids"],
    note: "Shown: high-to-low cable crossover. Set pulleys at shoulder height for the standard fly.",
  },
  "pull-up": {
    source: "Pullups",
    primary: ["upper-back"],
    secondary: ["biceps", "back-deltoids", "forearm", "trapezius"],
  },
  "lat-pulldown": { source: "Wide-Grip_Lat_Pulldown", primary: ["upper-back"], secondary: ["biceps", "back-deltoids"] },
  "barbell-row": {
    source: "Bent_Over_Barbell_Row",
    primary: ["upper-back", "trapezius"],
    secondary: ["back-deltoids", "biceps", "lower-back"],
  },
  "one-arm-dumbbell-row": {
    source: "One-Arm_Dumbbell_Row",
    primary: ["upper-back"],
    secondary: ["back-deltoids", "biceps", "trapezius"],
  },
  "seated-cable-row": {
    source: "Seated_Cable_Rows",
    primary: ["upper-back", "trapezius"],
    secondary: ["back-deltoids", "biceps"],
  },
  "face-pull": { source: "Face_Pull", primary: ["back-deltoids"], secondary: ["trapezius", "upper-back"] },
  "overhead-press": {
    source: "Standing_Military_Press",
    primary: ["front-deltoids"],
    secondary: ["triceps", "trapezius", "abs"],
  },
  "seated-dumbbell-shoulder-press": {
    source: "Dumbbell_Shoulder_Press",
    primary: ["front-deltoids"],
    secondary: ["triceps", "trapezius"],
  },
  "lateral-raise": {
    source: "Side_Lateral_Raise",
    primary: ["front-deltoids", "back-deltoids"],
    secondary: ["trapezius"],
    note: "The side delt sits between the front and rear delts on the map.",
  },
  "back-squat": {
    source: "Barbell_Squat",
    primary: ["quadriceps", "gluteal"],
    secondary: ["adductor", "lower-back", "abs"],
  },
  "goblet-squat": { source: "Goblet_Squat", primary: ["quadriceps", "gluteal"], secondary: ["adductor", "abs"] },
  "leg-press": { source: "Leg_Press", primary: ["quadriceps", "gluteal"], secondary: ["adductor"] },
  "romanian-deadlift": {
    source: "Romanian_Deadlift",
    primary: ["hamstring", "gluteal"],
    secondary: ["lower-back", "forearm", "adductor"],
  },
  "bulgarian-split-squat": {
    source: "Split_Squat_with_Dumbbells",
    primary: ["quadriceps", "gluteal"],
    secondary: ["adductor", "hamstring"],
  },
  "leg-curl": { source: "Seated_Leg_Curl", primary: ["hamstring"], secondary: ["calves"] },
  "hip-thrust": { source: "Barbell_Hip_Thrust", primary: ["gluteal"], secondary: ["hamstring", "quadriceps"] },
  "calf-raise": { source: "Standing_Calf_Raises", primary: ["calves"], secondary: ["left-soleus", "right-soleus"] },
  deadlift: {
    source: "Barbell_Deadlift",
    primary: ["gluteal", "hamstring", "lower-back"],
    secondary: ["quadriceps", "trapezius", "upper-back", "forearm"],
  },
  "barbell-curl": { source: "Barbell_Curl", primary: ["biceps"], secondary: ["forearm"] },
  "hammer-curl": { source: "Hammer_Curls", primary: ["biceps", "forearm"], secondary: [] },
  "triceps-pushdown": { source: "Triceps_Pushdown_-_Rope_Attachment", primary: ["triceps"], secondary: [] },
  "overhead-triceps-extension": {
    source: "Cable_Rope_Overhead_Triceps_Extension",
    primary: ["triceps"],
    secondary: [],
  },
  plank: { source: "Plank", primary: ["abs"], secondary: ["obliques", "quadriceps"] },
  "hanging-knee-raise": {
    source: "Hanging_Leg_Raise",
    primary: ["abs"],
    secondary: ["obliques", "forearm"],
    note: "Shown: straight-leg version (harder). Bend your knees for the knee raise.",
  },
  // Core & abs
  "cable-crunch": { source: "Cable_Crunch", primary: ["abs"], secondary: ["obliques"] },
  "ab-wheel-rollout": {
    source: "Ab_Roller",
    primary: ["abs"],
    secondary: ["obliques", "upper-back", "front-deltoids"],
  },
  "dead-bug": { source: "Dead_Bug", primary: ["abs"], secondary: ["obliques", "quadriceps"] },
  "side-plank": { source: "Side_Bridge", primary: ["obliques"], secondary: ["abs", "abductors", "front-deltoids"] },
  "pallof-press": { source: "Pallof_Press", primary: ["obliques", "abs"], secondary: ["gluteal"] },
  "reverse-crunch": { source: "Reverse_Crunch", primary: ["abs"], secondary: ["obliques"] },
  "bicycle-crunch": { source: "Air_Bike", primary: ["obliques", "abs"], secondary: ["quadriceps"] },
  // Cardio
  "incline-walk": {
    source: "Walking_Treadmill",
    primary: ["gluteal", "calves"],
    secondary: ["hamstring", "quadriceps"],
    note: "Shown on a flat treadmill — raise the incline to 6–12%.",
  },
  "treadmill-run": {
    source: "Running_Treadmill",
    primary: ["quadriceps", "calves"],
    secondary: ["gluteal", "hamstring", "abs"],
  },
  "stationary-bike": {
    source: "Bicycling_Stationary",
    primary: ["quadriceps"],
    secondary: ["gluteal", "calves", "hamstring"],
  },
  "rowing-machine": {
    source: "Rowing_Stationary",
    primary: ["upper-back", "quadriceps"],
    secondary: ["gluteal", "hamstring", "biceps", "back-deltoids"],
  },
  elliptical: {
    source: "Elliptical_Trainer",
    primary: ["quadriceps", "gluteal"],
    secondary: ["hamstring", "calves", "biceps", "triceps"],
  },
  "stair-climber": { source: "Stairmaster", primary: ["gluteal", "quadriceps"], secondary: ["calves", "hamstring"] },
  "jump-rope": { source: "Rope_Jumping", primary: ["calves"], secondary: ["front-deltoids", "forearm", "quadriceps"] },
  "mountain-climber": {
    source: "Mountain_Climbers",
    primary: ["abs"],
    secondary: ["front-deltoids", "quadriceps", "obliques"],
  },
  "kettlebell-swing": {
    source: "One-Arm_Kettlebell_Swings",
    primary: ["gluteal", "hamstring"],
    secondary: ["lower-back", "abs", "forearm"],
    note: "Shown one-arm. Start with two hands on the handle.",
  },
  "jump-squat": {
    source: "Freehand_Jump_Squat",
    primary: ["quadriceps", "gluteal"],
    secondary: ["calves", "hamstring"],
  },
  "battle-ropes": {
    source: "Battling_Ropes",
    primary: ["front-deltoids"],
    secondary: ["biceps", "triceps", "forearm", "abs"],
  },
};
