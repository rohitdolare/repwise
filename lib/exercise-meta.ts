import { exercises } from "@/content/exercises";
import type { ExerciseMeta } from "@/components/today-workout";

/** Server-side: slim name/load map passed to client components. */
export const exerciseMeta: ExerciseMeta = Object.fromEntries(
  exercises.map((e) => [e.slug, { name: e.name, load: e.load }]),
);
