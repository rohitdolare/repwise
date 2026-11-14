import Image from "next/image";
import Link from "next/link";
import {
  Apple,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  Flame,
  HeartPulse,
  LineChart,
  Target,
  Ruler,
  TrendingUp,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TodayPreview } from "@/components/plan-bits";
import { InstallApp } from "@/components/install-app";
import { cn } from "@/lib/utils";

const sections = [
  {
    n: "01",
    href: "/routine",
    title: "Workout Routine",
    icon: CalendarDays,
    text: "Structured weekly plans for 3, 4 or 5 days — pick one and follow it.",
  },
  {
    n: "02",
    href: "/exercises",
    title: "Exercise Library",
    icon: Dumbbell,
    text: "Every exercise: setup, steps, breathing, mistakes, sets, reps and rest.",
  },
  {
    n: "03",
    href: "/principles",
    title: "Training Principles",
    icon: TrendingUp,
    text: "Progressive overload, volume, RIR/RPE, frequency, deloads and recovery.",
  },
  {
    n: "04",
    href: "/form-guide",
    title: "Perfect Form Guide",
    icon: Ruler,
    text: "Bracing, breathing, range of motion and the cues for every movement pattern.",
  },
  {
    n: "05",
    href: "/recovery",
    title: "Warm-up & Recovery",
    icon: Flame,
    text: "A 10-minute warm-up, ramp-up sets, rest periods, sleep and mobility.",
  },
  {
    n: "06",
    href: "/nutrition",
    title: "Nutrition Basics",
    icon: Apple,
    text: "Calories, protein, hydration and meal timing — with a personal calculator.",
  },
  {
    n: "07",
    href: "/cardio",
    title: "Cardio & Conditioning",
    icon: HeartPulse,
    text: "Zone 2, 4×4 and HIIT sessions with a guided interval timer and heart-rate zones.",
  },
  {
    n: "08",
    href: "/core",
    title: "Abs & Core",
    icon: Target,
    text: "Train all four core functions, plus a 10-minute abs finisher.",
  },
];

const flow = [
  { icon: CalendarDays, title: "Pick your plan", text: "Choose a 3, 4 or 5-day routine that fits your week." },
  { icon: BookOpen, title: "Learn the lift", text: "Read the 30-second form guide before each exercise." },
  { icon: Dumbbell, title: "Log every set", text: "Enter weight × reps. The rest timer starts automatically." },
  { icon: TrendingUp, title: "Progress smart", text: "RepWise tells you exactly when to add reps or weight." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-12 md:pt-20 md:pb-16 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
              <span className="size-1.5 rounded-full bg-primary" /> Your gym manual + workout coach
            </p>
            <h1 className="font-heading text-5xl leading-[0.95] font-black text-balance md:text-7xl">
              Don&apos;t just lift weights.
              <br />
              <span className="text-primary">Learn to train right.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
              Understand your workouts, master exercise technique, and build strength with proven training principles.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/today" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}>
                Start today&apos;s workout <ArrowRight />
              </Link>
              <Link
                href="/learn"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-6 text-base")}
              >
                Explore your training guide
              </Link>
            </div>
          </div>
          <HeroCollage />
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-10 md:py-16">
        {/* TODAY */}
        <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <TodayPreview />
          <Link
            href="/progress"
            className="group flex items-center gap-4 rounded-3xl border bg-card p-5 transition-colors hover:border-primary/60 md:p-6"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <LineChart className="size-6" />
            </span>
            <span>
              <span className="block font-heading text-xl font-bold">Your progress</span>
              <span className="text-sm text-muted-foreground">Best lifts, history and next targets</span>
            </span>
          </Link>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <SectionTitle eyebrow="How RepWise works" title="Four steps, every workout" />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((s, i) => (
              <li key={s.title} className="relative rounded-2xl border bg-card p-5">
                <span className="absolute top-4 right-4 font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <s.icon className="mb-3 size-6 text-primary" />
                <h3 className="font-heading font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PROGRESSIVE OVERLOAD HIGHLIGHT */}
        <section className="overflow-hidden rounded-3xl border bg-card">
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">The #1 principle</p>
              <h2 className="mt-2 font-heading text-3xl font-black md:text-4xl">Progressive overload, made simple</h2>
              <p className="mt-4 text-muted-foreground">
                Your bench target is <b className="text-foreground">3 sets of 8–12</b>. Keep the weight the same and add
                reps each week. When you hit 12 on every set with good form, add a little weight and build back up. This
                is <b className="text-foreground">double progression</b> — and RepWise does the maths for you.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {[
                  "Progress doesn't mean more weight every workout.",
                  "Never sacrifice technique to lift heavier.",
                  "RIR (reps in reserve) keeps effort in check.",
                  "Recovery is when adaptation happens. Deload when needed.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/principles/progressive-overload"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6 h-11 px-5")}
              >
                Try the overload planner <ArrowRight />
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full text-center text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    {["Week", "Set 1", "Set 2", "Set 3", ""].map((h) => (
                      <th key={h} className="px-2 py-3 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {[
                    ["1", 8, 8, 8, "60 kg"],
                    ["2", 10, 9, 8, "60 kg"],
                    ["3", 10, 10, 10, "60 kg"],
                    ["4", 12, 12, 12, "60 kg ✓"],
                    ["5", 9, 8, 8, "62.5 kg ↑"],
                  ].map((r) => (
                    <tr
                      key={r[0]}
                      className={cn(
                        "border-t",
                        r[0] === "4" && "bg-primary/15 font-bold",
                        r[0] === "5" && "text-primary",
                      )}
                    >
                      {r.map((c, i) => (
                        <td key={i} className="px-2 py-3">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SIX SECTIONS */}
        <section>
          <SectionTitle eyebrow="Your training guide" title="Everything you need, in eight sections" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col rounded-2xl border bg-card p-5 transition-colors hover:border-primary/60"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">{s.n}</span>
                </div>
                <h3 className="font-heading text-lg font-bold">{s.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{s.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <InstallApp />
      </div>
    </>
  );
}

const heroShots = [
  { slug: "back-squat", label: "Squat", frame: 1 },
  { slug: "barbell-bench-press", label: "Bench press", frame: 0 },
  { slug: "deadlift", label: "Deadlift", frame: 1 },
  { slug: "pull-up", label: "Pull-up", frame: 1 },
];

function HeroCollage() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {heroShots.map((h, i) => (
        <Link
          key={h.slug}
          href={`/exercises/${h.slug}`}
          className={cn(
            "group relative aspect-[4/3] overflow-hidden rounded-2xl border shadow-lg",
            i % 2 === 1 && "translate-y-6",
          )}
        >
          <Image
            src={`/media/exercises/${h.slug}/${h.frame}.webp`}
            alt={`${h.label} demonstration`}
            fill
            unoptimized
            priority={i < 2}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {h.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-1 font-heading text-2xl font-black md:text-3xl">{title}</h2>
    </div>
  );
}
