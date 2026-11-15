import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export type ExerciseSummary = Pick<
  Exercise,
  "slug" | "name" | "group" | "primary" | "equipment" | "level" | "prescription" | "cardio" | "home"
>;

export function ExerciseCard({ exercise }: { exercise: ExerciseSummary }) {
  return (
    <Link
      href={`/exercises/${exercise.slug}`}
      className="group flex min-w-0 items-center gap-3 rounded-2xl sm:gap-4 border bg-card p-3 transition-colors hover:border-primary/50"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
        <Image
          src={`/media/exercises/${exercise.slug}/1.webp`}
          alt=""
          fill
          unoptimized
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <h3 className="font-heading leading-tight font-bold">{exercise.name}</h3>
        <p className="truncate text-sm text-muted-foreground">{exercise.primary.join(", ")}</p>
        <div className="flex flex-wrap gap-1.5">
          {exercise.cardio ? (
            <>
              <Badge variant="secondary">{exercise.prescription.reps}</Badge>
              <Badge variant="outline">{exercise.cardio.impact} impact</Badge>
            </>
          ) : (
            <Badge variant="secondary">
              {exercise.prescription.sets} × {exercise.prescription.reps}
            </Badge>
          )}
          <Badge variant="outline" className="max-w-full">
            <span className="truncate">{exercise.equipment[0]}</span>
          </Badge>
          {exercise.home && (
            <Badge variant="outline" className="border-primary/40 text-primary">
              <Home /> Home
            </Badge>
          )}
          {exercise.level === "Beginner" && <Badge variant="outline">Beginner-friendly</Badge>}
        </div>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
