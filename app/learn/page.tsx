import type { Metadata } from "next";
import Link from "next/link";
import { Apple, ArrowRight, Flame, HeartPulse, Home, Ruler, Sun, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/content";
import { InstallApp } from "@/components/install-app";
import { principles } from "@/content/principles";

export const metadata: Metadata = {
  title: "Learn",
  description: "Training principles, perfect form, warm-up & recovery and nutrition basics.",
};

const guides = [
  {
    href: "/form-guide",
    title: "Perfect Form Guide",
    text: "Bracing, breathing, range of motion and movement-pattern cues.",
    icon: Ruler,
    n: "04",
  },
  {
    href: "/recovery",
    title: "Warm-up & Recovery",
    text: "10-minute warm-up, ramp-up sets, rest periods, sleep.",
    icon: Flame,
    n: "05",
  },
  {
    href: "/nutrition",
    title: "Nutrition Basics",
    text: "Calories, protein, hydration — with a personal calculator.",
    icon: Apple,
    n: "06",
  },
  {
    href: "/cardio",
    title: "Cardio & Conditioning",
    text: "Guided Zone 2, 4×4 and HIIT sessions, heart-rate zones.",
    icon: HeartPulse,
    n: "07",
  },
  {
    href: "/core",
    title: "Abs & Core",
    text: "The four core functions, best exercises and a 10-min finisher.",
    icon: Target,
    n: "08",
  },
  {
    href: "/home-workouts",
    title: "Home Workouts",
    text: "No-equipment plans, variation ladders and guided circuits.",
    icon: Home,
    n: "09",
  },
];

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your training guide"
        title="Learn to train right"
        description="Short, evidence-based guides. Read one per day and in two weeks you'll know more than most people in your gym."
      />
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <Link
          href="/cardio/surya-namaskar"
          className="flex items-center gap-4 rounded-3xl border border-primary/50 bg-primary/10 p-5 transition-colors hover:bg-primary/15"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sun className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-lg font-bold">Surya Namaskar (Sun Salutation)</span>
            <span className="text-sm text-muted-foreground">
              Guided 12-pose yoga flow with breathing cues · 18 min · no equipment
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0" />
        </Link>
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-black">
              <span className="mr-2 font-mono text-base text-muted-foreground">03</span>Training principles
            </h2>
            <Link href="/principles" className="text-sm font-semibold text-primary">
              All →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <Link
                key={p.slug}
                href={`/principles/${p.slug}`}
                className={`group rounded-2xl border bg-card p-5 transition-colors hover:border-primary/60 ${i === 0 ? "border-primary/50 sm:col-span-2 lg:col-span-1" : ""}`}
              >
                {i === 0 && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    <TrendingUp className="size-3" /> Start here
                  </span>
                )}
                <h3 className="font-heading text-lg font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group rounded-2xl border bg-card p-5 transition-colors hover:border-primary/60"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <g.icon className="size-5" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">{g.n}</span>
              </div>
              <h3 className="font-heading text-lg font-bold">{g.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{g.text}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </section>

        <InstallApp />
      </div>
    </>
  );
}
