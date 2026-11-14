import type { Metadata } from "next";
import { PageHeader } from "@/components/content";
import { ProgressView, type ProgressMeta } from "@/components/progress-view";
import { exercises } from "@/content/exercises";
import { programs } from "@/content/programs";
import type { Prescription } from "@/lib/types";

export const metadata: Metadata = {
  title: "Progress",
  description: "Your logged workouts, best lifts and next progressive overload targets.",
};

function buildMeta(): ProgressMeta {
  const rxBySlug = new Map<string, Prescription>();
  for (const p of programs) for (const w of p.workouts) for (const e of w.exercises) if (!rxBySlug.has(e.slug)) rxBySlug.set(e.slug, e);
  return Object.fromEntries(
    exercises.map((e) => {
      const nums = e.prescription.reps.match(/(\d+)\D+(\d+)/);
      const rx: Prescription = rxBySlug.get(e.slug) ?? {
        slug: e.slug,
        sets: parseInt(e.prescription.sets, 10) || 3,
        repMin: nums ? +nums[1] : 8,
        repMax: nums ? +nums[2] : 12,
        rir: e.prescription.rir,
        restSec: 90,
      };
      return [e.slug, { name: e.name, load: e.load, rx }];
    }),
  );
}

export default function ProgressPage() {
  return (
    <>
      <PageHeader eyebrow="Your progress" title="Track it to grow it" description="What you've done, your best sets, and exactly what to aim for next time." />
      <div className="mx-auto max-w-3xl px-4">
        <ProgressView meta={buildMeta()} />
      </div>
    </>
  );
}
