import { suryaSequence } from "@/content/cardio";
import { PoseFigure } from "./pose-figure";
import { cn } from "@/lib/utils";

const breathStyle: Record<string, string> = {
  In: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  Out: "bg-primary/15 text-primary",
  Hold: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
};

/** The 12 Surya Namaskar poses as an illustrated sequence with the breath for each. */
export function SuryaChart() {
  return (
    <section className="rounded-2xl border bg-card p-4 md:p-5">
      <h2 className="font-heading text-xl font-bold">The 12 poses</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        One breath per pose. Do the sequence leading with the right leg, then repeat leading with the left — that&apos;s
        one round.
      </p>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {suryaSequence.map((p) => (
          <li key={p.n} className="flex flex-col rounded-xl border bg-background/60 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{p.n}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase", breathStyle[p.breath])}>
                {p.breath === "Hold" ? "Hold" : `Breathe ${p.breath.toLowerCase()}`}
              </span>
            </div>
            <PoseFigure pose={p.pose} title={`${p.name} (${p.english})`} className="mx-auto my-1 h-24 w-auto" />
            <p className="text-sm leading-tight font-bold">{p.english}</p>
            <p className="text-xs text-muted-foreground italic">{p.name}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{p.how}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
