import { exerciseMap, exercises } from "@/content/exercises";
import type { ExerciseMeta } from "@/components/today-workout";

/** Next exercise in a variation ladder, as the logger needs it. */
export function harderOf(slug: string): { slug: string; name: string } | undefined {
  const next = exerciseMap[slug]?.harder;
  return next && exerciseMap[next] ? { slug: next, name: exerciseMap[next].name } : undefined;
}

/** Server-side: slim map passed to client components (keeps the full library out of the bundle). */
export const exerciseMeta: ExerciseMeta = Object.fromEntries(
  exercises.map((e) => [
    e.slug,
    {
      name: e.name,
      load: e.load,
      ...(e.timed ? { timed: true } : {}),
      ...(harderOf(e.slug) ? { harder: harderOf(e.slug) } : {}),
    },
  ]),
);
