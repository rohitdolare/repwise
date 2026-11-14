import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, Clock, Gauge, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { References } from "@/components/content";
import { IntervalTimer } from "@/components/interval-timer";
import { cardioWorkouts, getCardioWorkout, totalSeconds } from "@/content/cardio";
import { exerciseMap } from "@/content/exercises";
import { kindStyle } from "@/lib/cardio-style";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return cardioWorkouts.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: PageProps<"/cardio/[id]">): Promise<Metadata> {
  const { id } = await params;
  const w = getCardioWorkout(id);
  return w ? { title: w.name, description: w.summary } : {};
}

export default async function CardioSessionPage({ params }: PageProps<"/cardio/[id]">) {
  const { id } = await params;
  const w = getCardioWorkout(id);
  if (!w) notFound();
  const back = w.type === "Core" ? { href: "/core", label: "Abs & Core" } : { href: "/cardio", label: "Cardio" };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <Link
        href={back.href}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {back.label}
      </Link>
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge>{w.type}</Badge>
        <Badge variant="outline">{w.level}</Badge>
      </div>
      <h1 className="font-heading text-3xl font-black md:text-5xl">{w.name}</h1>
      <p className="mt-3 max-w-2xl text-lg text-pretty text-muted-foreground">{w.summary}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <IntervalTimer workoutId={w.id} name={w.name} phases={w.phases} />

          <details className="group rounded-2xl border bg-card">
            <summary className="cursor-pointer list-none p-4 font-heading font-bold">
              Full session plan ({w.phases.length} phases){" "}
              <span className="text-muted-foreground group-open:hidden">— tap to show</span>
            </summary>
            <ol className="divide-y border-t text-sm">
              {w.phases.map((p, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-2">
                  <span className={cn("size-2.5 shrink-0 rounded-full", kindStyle[p.kind].dot)} />
                  <span className="flex-1">
                    {p.label}
                    {p.cue && <span className="block text-xs text-muted-foreground">{p.cue}</span>}
                  </span>
                  <span className="font-mono">{formatTime(p.sec)}</span>
                </li>
              ))}
            </ol>
          </details>
        </div>

        <aside className="space-y-4">
          <dl className="space-y-3 rounded-2xl border bg-card p-5 text-sm">
            {[
              { icon: Clock, k: "Duration", v: `${Math.round(totalSeconds(w) / 60)} minutes` },
              { icon: Gauge, k: "Intensity", v: w.intensity },
              { icon: CalendarClock, k: "How often", v: w.howOften },
            ].map((x) => (
              <div key={x.k} className="flex gap-3">
                <x.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <dt className="text-xs text-muted-foreground">{x.k}</dt>
                  <dd className="font-medium">{x.v}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-2 flex items-center gap-2 font-heading font-bold">
              <Info className="size-4 text-primary" /> Why this works
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{w.why}</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-3 font-heading font-bold">
              {w.type === "Core" || w.id === "hiit-circuit" ? "Exercises" : "Do it on"}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {w.equipment.map((slug) => (
                <Link key={slug} href={`/exercises/${slug}`} className="group overflow-hidden rounded-xl border">
                  <div className="relative aspect-[3/2] bg-muted">
                    <Image
                      src={`/media/exercises/${slug}/1.webp`}
                      alt=""
                      fill
                      unoptimized
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <p className="p-2 text-xs font-medium group-hover:underline">{exerciseMap[slug]?.name}</p>
                </Link>
              ))}
            </div>
          </div>
          <References items={w.references} />
        </aside>
      </div>
    </div>
  );
}
