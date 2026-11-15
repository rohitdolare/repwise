import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { GuidePage } from "@/components/guide-page";
import { CardioCard } from "@/components/cardio-card";
import { UsePlanButton } from "@/components/plan-bits";
import { Badge } from "@/components/ui/badge";
import { homeGuide } from "@/content/guides";
import { getCardioWorkout } from "@/content/cardio";
import { programs } from "@/content/programs";

export const metadata: Metadata = {
  title: "Home Workouts",
  description:
    "No-equipment home workout plans, bodyweight variation ladders, and guided circuits — build muscle at home with just a chair and a table.",
};

export default function HomeWorkoutsPage() {
  const plans = programs.filter((p) => p.setting === "home");
  const circuits = [getCardioWorkout("home-express")!, getCardioWorkout("hiit-circuit")!];

  return (
    <GuidePage
      guide={homeGuide}
      eyebrow="09 · Home workouts"
      top={
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold">Home plans</h2>
            {plans.map((p) => (
              <div key={p.id} className="rounded-2xl border bg-card p-5">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge>{p.daysPerWeek} days / week</Badge>
                  <Badge variant="outline">{p.level}</Badge>
                </div>
                <h3 className="flex items-center gap-2 font-heading text-lg font-bold">
                  <Home className="size-4 text-primary" /> {p.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">Sessions: </span>
                  {p.workouts.map((w) => w.focus).join(" / ")}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <UsePlanButton programId={p.id} />
                  <Link
                    href={`/routine#${p.id}`}
                    className="inline-flex min-h-11 items-center justify-center gap-1 text-sm font-semibold text-primary"
                  >
                    See every exercise <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold">Short on time? Guided circuits</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {circuits.map((w, i) => (
                <CardioCard key={w.id} w={w} highlight={i === 0} />
              ))}
            </div>
          </section>

          <Link
            href="/exercises#home"
            className="flex items-center justify-between gap-3 rounded-2xl border border-dashed p-4 text-sm font-medium hover:border-primary/60"
          >
            Browse all home-friendly exercises <ArrowRight className="size-4" />
          </Link>
        </div>
      }
    />
  );
}
