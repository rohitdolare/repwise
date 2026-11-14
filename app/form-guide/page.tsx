import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GuidePage } from "@/components/guide-page";
import { formGuide, movementPatterns } from "@/content/guides";
import { exerciseMap } from "@/content/exercises";

export const metadata: Metadata = {
  title: "Perfect Form Guide",
  description: "Correct posture, bracing, breathing, range of motion and cues for every movement pattern.",
};

export default function FormGuidePage() {
  return (
    <GuidePage
      guide={formGuide}
      eyebrow="04 · Perfect form"
      top={
        <section>
          <h2 className="mb-3 font-heading text-xl font-bold">Movement patterns</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {movementPatterns.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-2xl border bg-card">
                <div className="grid aspect-[3/1] grid-cols-2 bg-muted">
                  {[0, 1].map((f) => (
                    <div key={f} className="relative">
                      <Image
                        src={`/media/exercises/${m.exercises[0]}/${f}.webp`}
                        alt={`${exerciseMap[m.exercises[0]]?.name} — ${f ? "finish" : "start"}`}
                        fill
                        unoptimized
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg font-bold">{m.name}</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {m.cues.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.exercises.map((s) => (
                      <Link
                        key={s}
                        href={`/exercises/${s}`}
                        className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground"
                      >
                        {exerciseMap[s]?.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      }
    />
  );
}
