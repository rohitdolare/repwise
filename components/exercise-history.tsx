"use client";

import { History, Trophy } from "lucide-react";
import { bestFor, previousSession, useArchive, useLogs, useSettings, useTodayKey } from "@/lib/store";

const fmtDate = (d: string) => new Date(d + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });

/** Previous session (the numbers to match or beat) and the all-time best set. */
export function ExerciseHistory({ slug }: { slug: string }) {
  const logs = useLogs();
  const archive = useArchive();
  const { unit } = useSettings();
  const today = useTodayKey();
  const prev = previousSession(logs[slug], today);
  const best = bestFor(slug, logs, archive);

  if (!prev && !best) {
    return (
      <p className="text-sm text-muted-foreground">
        Not done yet. After your first session, your numbers to beat will appear here.
      </p>
    );
  }
  return (
    <div className="space-y-2 text-sm">
      {prev && (
        <p className="flex flex-wrap items-center gap-2">
          <History className="size-4 text-primary" />
          Previous ({fmtDate(prev.date)}):
          <b className="font-mono">{prev.sets.map((x) => (x.weight ? `${x.weight}×${x.reps}` : `${x.reps}`)).join(" · ")}</b>
        </p>
      )}
      {best && (
        <p className="flex flex-wrap items-center gap-2">
          <Trophy className="size-4 text-primary" />
          Best set:
          <b className="font-mono">{best.weight > 0 ? `${best.weight} ${unit} × ${best.reps}` : `${best.reps} reps`}</b>
          {best.weight > 0 && (
            <span className="text-muted-foreground">
              (est. 1RM {Math.round(best.e1rm)} {unit})
            </span>
          )}
        </p>
      )}
    </div>
  );
}
