import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/content";
import { TodayWorkout } from "@/components/today-workout";
import { exerciseMeta } from "@/lib/exercise-meta";

export const metadata: Metadata = {
  title: "Today's Workout",
  description: "Your workout for today with sets, reps, rest timer and progressive overload targets.",
};

export default function TodayPage() {
  return (
    <>
      <PageHeader eyebrow="Workout coach" title="Today's workout">
        <p className="mt-2 text-sm text-muted-foreground">
          Log each set as you go. Want a different split?{" "}
          <Link href="/routine" className="font-medium text-foreground underline underline-offset-4">
            Change plan
          </Link>
        </p>
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4">
        <TodayWorkout meta={exerciseMeta} />
      </div>
    </>
  );
}
