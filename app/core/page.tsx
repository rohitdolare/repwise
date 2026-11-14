import type { Metadata } from "next";
import { GuidePage } from "@/components/guide-page";
import { CardioCard } from "@/components/cardio-card";
import { ExerciseCard } from "@/components/exercise-card";
import { coreGuide } from "@/content/guides";
import { getCardioWorkout } from "@/content/cardio";
import { exercises } from "@/content/exercises";

export const metadata: Metadata = {
  title: "Abs & Core Training",
  description:
    "How to train your abs and core: the four core functions, best exercises, sets and reps, and a 10-minute core finisher.",
};

export default function CorePage() {
  const core = exercises.filter((e) => e.group === "core");
  const finisher = getCardioWorkout("core-finisher")!;
  return (
    <GuidePage
      guide={coreGuide}
      eyebrow="08 · Abs & core"
      top={
        <div className="space-y-6">
          <CardioCard w={finisher} highlight />
          <section>
            <h2 className="mb-3 font-heading text-xl font-bold">Core exercises</h2>
            <div className="grid gap-3">
              {core.map((e) => (
                <ExerciseCard key={e.slug} exercise={e} />
              ))}
            </div>
          </section>
        </div>
      }
    />
  );
}
