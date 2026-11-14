import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/content";
import { principles } from "@/content/principles";

export const metadata: Metadata = {
  title: "Training Principles",
  description: "Progressive overload, volume, intensity, RIR & RPE, frequency, deloads and recovery — explained simply.",
};

export default function PrinciplesPage() {
  return (
    <>
      <PageHeader
        eyebrow="03 · Training principles"
        title="The science behind your workouts"
        description="Understand why your plan looks the way it does. These principles apply to every program you will ever follow."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-2">
        {principles.map((p, i) => (
          <Link
            key={p.slug}
            href={`/principles/${p.slug}`}
            className="group flex flex-col rounded-2xl border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
            <h2 className="mt-1 font-heading text-2xl font-black">{p.title}</h2>
            <p className="mt-2 text-muted-foreground">{p.tagline}</p>
            <ul className="mt-4 flex-1 space-y-1.5 text-sm">
              {p.takeaways.slice(0, 2).map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" /> {t}
                </li>
              ))}
            </ul>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Read <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
