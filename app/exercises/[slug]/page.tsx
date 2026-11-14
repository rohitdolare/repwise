import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleX, PlayCircle, Wind } from "lucide-react";
import { exerciseMap, exercises, getExercise, muscleGroups } from "@/content/exercises";
import { programs } from "@/content/programs";
import type { Exercise, Prescription } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ExerciseLogger } from "@/components/exercise-logger";
import { ExerciseHistory } from "@/components/exercise-history";
import { ExerciseMedia } from "@/components/exercise-media";
import { videos } from "@/content/videos";
import { MuscleLegend, MuscleMap } from "@/components/muscle-map";
import { visuals } from "@/content/visuals";
import { getCardioWorkout } from "@/content/cardio";
import { CardioCard } from "@/components/cardio-card";

export function generateStaticParams() {
  return exercises.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exercises/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ex = getExercise(slug);
  if (!ex) return {};
  return { title: `${ex.name} — How to, Sets & Reps`, description: ex.overview };
}

/** Use the prescription from a RepWise plan if the exercise appears in one, otherwise derive it. */
function prescriptionFor(ex: Exercise): Prescription {
  for (const p of programs)
    for (const w of p.workouts) {
      const hit = w.exercises.find((e) => e.slug === ex.slug);
      if (hit) return hit;
    }
  const nums = ex.prescription.reps.match(/(\d+)\D+(\d+)/);
  return {
    slug: ex.slug,
    sets: parseInt(ex.prescription.sets, 10) || 3,
    repMin: nums ? +nums[1] : 8,
    repMax: nums ? +nums[2] : 12,
    rir: ex.prescription.rir,
    restSec: 90,
  };
}

export default async function ExercisePage({ params }: PageProps<"/exercises/[slug]">) {
  const { slug } = await params;
  const ex = getExercise(slug);
  if (!ex) notFound();

  const group = muscleGroups.find((g) => g.id === ex.group);
  const alternatives = ex.alternatives.map((s) => exerciseMap[s]).filter(Boolean);
  const rx = prescriptionFor(ex);
  const visual = visuals[ex.slug];
  const demo = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${ex.name} proper form`)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <Link
        href="/exercises"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Exercise library
      </Link>

      {/* 1. Overview */}
      <header className="mb-6 grid items-center gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge>{group?.label}</Badge>
            <Badge variant="outline">{ex.level}</Badge>
          </div>
          <h1 className="font-heading text-3xl font-black md:text-5xl">{ex.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-pretty text-muted-foreground">{ex.overview}</p>
        </div>
        {visual && <ExerciseMedia slug={ex.slug} name={ex.name} note={visual.note} video={videos[ex.slug]} />}
      </header>

      {/* Quick facts: 8. sets & reps, 9. rest */}
      <dl className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(ex.cardio
          ? [
              ["How often", ex.prescription.sets],
              ["Duration", ex.prescription.reps],
              ["Intensity", ex.prescription.rir],
              ["Impact", ex.cardio.impact],
            ]
          : [
              ["Sets", ex.prescription.sets],
              ["Reps", ex.prescription.reps],
              ["Effort (RIR)", ex.prescription.rir],
              ["Rest", ex.rest],
            ]
        ).map(([k, v]) => (
          <div key={k} className="rounded-2xl border bg-card p-4">
            <dt className="text-xs font-medium text-muted-foreground">{k}</dt>
            <dd className="mt-1 font-heading text-xl font-black">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <Section n={2} title="Target muscles">
            {visual && (
              <div className="mb-4 space-y-2 rounded-xl bg-muted/40 py-4">
                <MuscleMap primary={visual.primary} secondary={visual.secondary} />
                <MuscleLegend />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {ex.primary.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground"
                >
                  {m}
                </span>
              ))}
              {ex.secondary.map((m) => (
                <span key={m} className="rounded-full border px-3 py-1 text-sm">
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Filled = primary · Outlined = secondary</p>
          </Section>

          <Section n={3} title="Equipment">
            <ul className="flex flex-wrap gap-2 text-sm">
              {ex.equipment.map((e) => (
                <li key={e} className="rounded-lg bg-muted px-3 py-1.5">
                  {e}
                </li>
              ))}
            </ul>
          </Section>

          <Section n={4} title="Starting position">
            <Ordered items={ex.setup} />
          </Section>

          <Section n={5} title="Step-by-step execution">
            <Ordered items={ex.steps} />
            <div className="mt-4 rounded-xl bg-accent/60 p-4">
              <p className="mb-2 text-sm font-semibold">Coaching cues</p>
              <div className="flex flex-wrap gap-2">
                {ex.cues.map((c) => (
                  <span key={c} className="rounded-full bg-background px-3 py-1 text-sm">
                    “{c}”
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { href: demo, label: "YouTube demos" },
                {
                  href: `https://www.google.com/search?q=${encodeURIComponent(`site:muscleandstrength.com/exercises ${ex.name}`)}`,
                  label: "Muscle & Strength video",
                },
              ].map((v) => (
                <a
                  key={v.label}
                  href={v.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold text-primary hover:border-primary/60"
                >
                  <PlayCircle className="size-4" /> {v.label}
                </a>
              ))}
            </div>
          </Section>

          <Section n={6} title="Breathing technique">
            <p className="flex gap-3 leading-relaxed">
              <Wind className="mt-1 size-5 shrink-0 text-primary" />
              {ex.breathing}
            </p>
          </Section>

          <Section n={7} title="Common mistakes">
            <ul className="space-y-3">
              {ex.mistakes.map((m) => (
                <li key={m.mistake} className="rounded-xl border p-3">
                  <p className="flex items-start gap-2 font-medium">
                    <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" /> {m.mistake}
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {m.fix}
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          {ex.cardio ? (
            <>
              <Section n={8} title="How to program it">
                <p className="leading-relaxed">
                  <b>{ex.prescription.sets}</b>, <b>{ex.prescription.reps}</b> at <b>{ex.prescription.rir}</b>. Best
                  for: {ex.cardio.bestFor}. Keep about 80% of your cardio easy and 20% hard.{" "}
                  <Link href="/cardio#how-much" className="font-medium text-primary underline-offset-4 hover:underline">
                    Weekly cardio targets
                  </Link>
                </p>
              </Section>
              <Section n={9} title="Recovery">
                <p>
                  {ex.rest}. Avoid hard cardio the day before heavy leg training.{" "}
                  <Link href="/cardio#combine" className="text-primary underline-offset-4 hover:underline">
                    Combining cardio with lifting
                  </Link>
                </p>
              </Section>
            </>
          ) : (
            <>
              <Section n={8} title="Recommended sets & reps">
                <p className="leading-relaxed">
                  <b>
                    {ex.prescription.sets} sets × {ex.prescription.reps}
                  </b>
                  , stopping with <b>{ex.prescription.rir}</b> reps in reserve. Use{" "}
                  <Link
                    href="/principles/progressive-overload"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    double progression
                  </Link>
                  : add reps each session; when all sets hit the top of the range, add weight.
                </p>
              </Section>

              <Section n={9} title="Rest interval">
                <p>
                  Rest <b>{ex.rest}</b> between sets. The timer starts automatically when you log a set.{" "}
                  <Link href="/recovery#rest" className="text-primary underline-offset-4 hover:underline">
                    Why rest matters
                  </Link>
                </p>
              </Section>
            </>
          )}

          <Section n={10} title="Exercise alternatives">
            <div className="grid gap-2 sm:grid-cols-2">
              {alternatives.map((a) => (
                <Link
                  key={a.slug}
                  href={`/exercises/${a.slug}`}
                  className="rounded-xl border p-3 hover:border-primary/50"
                >
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-sm text-muted-foreground">{a.equipment[0]}</p>
                </Link>
              ))}
            </div>
          </Section>
        </div>

        {ex.cardio ? (
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <h2 className="font-heading text-xl font-bold">Guided sessions</h2>
            {ex.cardio.sessions.map((id) => {
              const w = getCardioWorkout(id);
              return w ? <CardioCard key={id} w={w} /> : null;
            })}
          </aside>
        ) : (
          <aside id="log" className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <h2 className="font-heading text-xl font-bold">Log this exercise</h2>
            <ExerciseLogger name={ex.name} load={ex.load} rx={rx} showLink={false} />
            <div className="rounded-2xl border bg-card p-4">
              <h3 className="mb-3 font-heading font-bold">Your numbers</h3>
              <ExerciseHistory slug={ex.slug} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="mb-3 flex items-center gap-3 font-heading text-lg font-bold">
        <span className="grid size-7 place-items-center rounded-full bg-muted font-mono text-xs">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Ordered({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((s, i) => (
        <li key={s} className="flex gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {i + 1}
          </span>
          <span className="leading-relaxed">{s}</span>
        </li>
      ))}
    </ol>
  );
}
