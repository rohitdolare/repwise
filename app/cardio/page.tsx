import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, PlayCircle } from "lucide-react";
import { Blocks, PageHeader, References, SectionNav } from "@/components/content";
import { CardioCard } from "@/components/cardio-card";
import { HeartRateZones, LogCardioForm, WeeklyCardio } from "@/components/cardio-widgets";
import { ExerciseCard } from "@/components/exercise-card";
import { cardioGuide, cardioReferences, cardioWorkouts, followAlongVideos } from "@/content/cardio";
import { exercises } from "@/content/exercises";

export const metadata: Metadata = {
  title: "Cardio & Conditioning",
  description:
    "Zone 2, Norwegian 4x4, 10-20-30 and HIIT sessions with a guided interval timer, heart-rate zones and weekly targets.",
};

export default function CardioPage() {
  const machines = exercises.filter((e) => e.group === "cardio");
  const sessions = cardioWorkouts.filter((w) => w.type !== "Core");
  return (
    <>
      <PageHeader
        eyebrow="07 · Cardio & conditioning"
        title="Build your engine"
        description="Guided cardio sessions with a beeping interval timer — from easy Zone 2 to VO₂max intervals. Combine them with lifting without losing gains."
      />
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <SectionNav
          items={[
            { id: "sessions", title: "Sessions" },
            { id: "videos", title: "Videos" },
            { id: "zones", title: "Heart-rate zones" },
            ...cardioGuide.map((g) => ({ id: g.id, title: g.title.split(" ").slice(0, 3).join(" ") })),
            { id: "machines", title: "Cardio options" },
          ]}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <WeeklyCardio />
          <LogCardioForm />
        </div>

        <section id="sessions" className="scroll-mt-20">
          <h2 className="mb-4 font-heading text-2xl font-black">Guided sessions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((w, i) => (
              <CardioCard key={w.id} w={w} highlight={i === 0} />
            ))}
          </div>
          <Link
            href="/core"
            className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-dashed p-4 hover:border-primary/60"
          >
            <span>
              <b>Want abs?</b>{" "}
              <span className="text-muted-foreground">See the Abs & Core guide and the 10-minute core finisher.</span>
            </span>
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        </section>

        <section id="videos" className="scroll-mt-20">
          <h2 className="mb-1 font-heading text-2xl font-black">Follow-along videos</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Prefer to follow a coach on screen? These free sources are trusted and well made. They open in a new tab and
            need internet.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {followAlongVideos.map((v) => (
              <a
                key={v.url}
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className="group flex gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/60"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <PlayCircle className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-heading font-bold">
                    {v.name} <ExternalLink className="size-3.5 text-muted-foreground" />
                  </span>
                  <span className="block text-xs text-primary">
                    {v.by} · {v.tag}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{v.text}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="zones" className="scroll-mt-20">
          <HeartRateZones />
        </section>

        <div className="mx-auto max-w-3xl space-y-6">
          {cardioGuide.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-20 rounded-2xl border bg-card p-5 md:p-6">
              <h2 className="mb-4 font-heading text-xl font-bold md:text-2xl">{g.title}</h2>
              <Blocks blocks={g.blocks} />
            </section>
          ))}
        </div>

        <section id="machines" className="scroll-mt-20">
          <h2 className="mb-1 font-heading text-2xl font-black">Cardio options</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            How to use each machine or drill correctly — with photos and common mistakes.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {machines.map((e) => (
              <ExerciseCard key={e.slug} exercise={e} />
            ))}
          </div>
        </section>

        <div className="mx-auto max-w-3xl">
          <References items={cardioReferences} />
        </div>
      </div>
    </>
  );
}
