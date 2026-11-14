import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { totalSeconds, type CardioWorkout } from "@/content/cardio";
import { kindStyle } from "@/lib/cardio-style";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CardioCard({ w, highlight }: { w: CardioWorkout; highlight?: boolean }) {
  const total = totalSeconds(w);
  return (
    <Link
      href={`/cardio/${w.id}`}
      className={cn(
        "group flex flex-col rounded-2xl border bg-card p-5 transition-colors hover:border-primary/60",
        highlight && "border-primary/50",
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge>{w.type}</Badge>
        <Badge variant="outline">{w.level}</Badge>
        <span className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="size-4" /> {Math.round(total / 60)} min
        </span>
      </div>
      <h3 className="font-heading text-lg font-bold">{w.name}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{w.summary}</p>
      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
        {w.phases.map((p, i) => (
          <div
            key={i}
            className={cn(kindStyle[p.kind].dot, p.kind === "rest" && "opacity-40")}
            style={{ width: `${(p.sec / total) * 100}%` }}
          />
        ))}
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Start session <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
