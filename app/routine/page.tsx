import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, HeartPulse, Users } from "lucide-react";
import { PageHeader, Blocks } from "@/components/content";
import { PlanWeek, UsePlanButton } from "@/components/plan-bits";
import { Badge } from "@/components/ui/badge";
import { programs } from "@/content/programs";
import { exerciseMap } from "@/content/exercises";
import { formatRest } from "@/lib/format";

export const metadata: Metadata = {
  title: "Workout Routines",
  description:
    "Structured weekly training plans: 3-day full body, 4-day upper/lower and 5-day push/pull/legs + upper/lower.",
};

export default function RoutinePage() {
  return (
    <>
      <PageHeader
        eyebrow="01 · Workout routine"
        title="Pick a plan. Follow it. Progress."
        description="Each plan trains every muscle about twice a week with enough volume to grow. Choose the one that fits your schedule — consistency beats perfection."
      />
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4" aria-label="Plans">
          {programs.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="shrink-0 rounded-full border bg-card px-4 py-2 text-sm font-medium whitespace-nowrap"
            >
              {p.daysPerWeek} days · {p.short}
            </a>
          ))}
        </nav>

        {programs.map((p) => (
          <section key={p.id} id={p.id} className="scroll-mt-20 rounded-3xl border bg-card p-5 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge>{p.daysPerWeek} days / week</Badge>
                  <Badge variant="outline">{p.level}</Badge>
                </div>
                <h2 className="font-heading text-2xl font-black md:text-3xl">{p.name}</h2>
                <p className="mt-2 text-muted-foreground">{p.summary}</p>
                <p className="mt-2 flex items-start gap-2 text-sm">
                  <Users className="mt-0.5 size-4 shrink-0 text-primary" /> {p.whoFor}
                </p>
              </div>
              <UsePlanButton programId={p.id} />
            </div>

            <PlanWeek program={p} />

            <div className="mt-4 rounded-2xl border border-dashed p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <HeartPulse className="size-4 text-primary" /> Cardio & core for this plan
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {p.cardio.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
              <Link href="/cardio" className="mt-2 inline-block text-sm font-semibold text-primary">
                Open cardio sessions →
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {p.workouts.map((w) => (
                <div key={w.id} className="rounded-2xl border p-4">
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <h3 className="font-heading text-lg font-bold">{w.name}</h3>
                    <span className="text-xs text-muted-foreground">{w.focus}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs text-muted-foreground">
                        <tr>
                          <th className="pb-2 text-left font-medium">Exercise</th>
                          <th className="pb-2 font-medium">Sets × Reps</th>
                          <th className="pb-2 font-medium">RIR</th>
                          <th className="pb-2 font-medium">Rest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {w.exercises.map((e) => (
                          <tr key={e.slug} className="border-t">
                            <td className="py-2 pr-2">
                              <Link
                                href={`/exercises/${e.slug}`}
                                className="flex items-center gap-2.5 font-medium underline-offset-4 hover:underline"
                              >
                                <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                                  <Image
                                    src={`/media/exercises/${e.slug}/1.webp`}
                                    alt=""
                                    fill
                                    unoptimized
                                    loading="lazy"
                                    className="object-cover"
                                  />
                                </span>
                                {exerciseMap[e.slug]?.name ?? e.slug}
                              </Link>
                            </td>
                            <td className="py-2 text-center font-mono whitespace-nowrap">
                              {e.sets} × {e.repMin}–{e.repMax}
                            </td>
                            <td className="py-2 text-center font-mono">{e.rir}</td>
                            <td className="py-2 text-center whitespace-nowrap">{formatRest(e.restSec)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl border bg-card p-5 md:p-8">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
            <CalendarDays className="size-5 text-primary" /> Plan rules
          </h2>
          <Blocks
            blocks={[
              {
                type: "list",
                items: [
                  "Warm up before every session (see Warm-up & Recovery).",
                  "Stay within the given RIR — most sets end 1–3 reps short of failure.",
                  "Use double progression: add reps until you hit the top of the range on all sets, then add weight.",
                  "Train on the days that suit you — set your own days on the Today page. Just keep a rest day between sessions that hit the same muscles where you can.",
                  "Missed a day? Shift the week rather than skipping the session.",
                  "Every 4–8 weeks, or when fatigue builds up, take a deload week (half the sets, easier effort).",
                  "Swap any exercise for a listed alternative if equipment is busy or it causes pain.",
                ],
              },
            ]}
          />
        </section>
      </div>
    </>
  );
}
