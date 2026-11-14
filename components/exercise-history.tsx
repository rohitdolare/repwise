"use client";

import { Trophy } from "lucide-react";
import { useLogs, useSettings } from "@/lib/store";
import { bestSet } from "@/lib/progression";

export function ExerciseHistory({ slug }: { slug: string }) {
  const logs = useLogs();
  const { unit } = useSettings();
  const sessions = logs[slug] ?? [];
  if (sessions.length === 0) {
    return <p className="text-sm text-muted-foreground">No sessions logged yet. Your history will appear here.</p>;
  }
  const best = bestSet(sessions);
  return (
    <div className="space-y-3">
      {best && best.weight > 0 && (
        <p className="flex items-center gap-2 text-sm">
          <Trophy className="size-4 text-primary" />
          Best set: <b className="font-mono">{best.weight} {unit} × {best.reps}</b>
          <span className="text-muted-foreground">(est. 1RM {Math.round(best.e1rm)} {unit})</span>
        </p>
      )}
      <ul className="divide-y rounded-xl border text-sm">
        {sessions
          .slice(-6)
          .reverse()
          .map((s) => (
            <li key={s.date} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="text-muted-foreground">
                {new Date(s.date + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })}
              </span>
              <span className="font-mono">
                {s.sets.map((x) => (x.weight ? `${x.weight}×${x.reps}` : `${x.reps}`)).join(" · ")}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
