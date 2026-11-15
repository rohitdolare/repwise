import type { Metadata } from "next";
import { PageHeader } from "@/components/content";
import { ExerciseBrowser } from "@/components/exercise-browser";
import { exercises, muscleGroups } from "@/content/exercises";
import { cardioWorkouts } from "@/content/cardio";

export const metadata: Metadata = {
  title: "Exercise Library",
  description: "Exercises by muscle group with step-by-step technique, breathing, common mistakes, sets, reps and rest.",
};

export default function ExercisesPage() {
  const items = exercises.map(({ slug, name, group, primary, equipment, level, prescription, cardio, home }) => ({
    ...(home ? { home } : {}),
    slug,
    name,
    group,
    primary,
    equipment,
    level,
    prescription,
    cardio,
  }));
  // Guided sessions (yoga, circuits, cardio) show up in search too — e.g. "surya" or "yoga".
  const sessions = cardioWorkouts.map(({ id, name, type, summary }) => ({ id, name, type, summary }));
  return (
    <>
      <PageHeader
        eyebrow="02 · Exercise library"
        title="Know exactly how to do every lift"
        description={`${exercises.length} essential exercises. Each page follows the same 10-part format, so you can find what you need fast — even mid-set.`}
      />
      <div className="mx-auto max-w-6xl px-4">
        <ExerciseBrowser items={items} groups={muscleGroups} sessions={sessions} />
      </div>
    </>
  );
}
