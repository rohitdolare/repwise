"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Info, RotateCcw, Sparkles, TrendingUp } from "lucide-react";
import type { LoadType, Prescription } from "@/lib/types";
import { recommend, type RecKind } from "@/lib/progression";
import { saveSet, useLogs, useSettings, useTodayKey } from "@/lib/store";
import { formatRest, timer } from "@/lib/timer";
import { primeAudio } from "@/lib/beep";
import { cn } from "@/lib/utils";

const recStyle: Record<RecKind, { icon: typeof TrendingUp; cls: string }> = {
  start: { icon: Sparkles, cls: "border-border bg-muted/50" },
  increase: { icon: ArrowUpRight, cls: "border-primary/50 bg-primary/10" },
  "bodyweight-up": { icon: ArrowUpRight, cls: "border-primary/50 bg-primary/10" },
  build: { icon: TrendingUp, cls: "border-border bg-muted/50" },
  reduce: { icon: ArrowDownRight, cls: "border-warning/50 bg-warning/10" },
};

interface Props {
  name: string;
  load: LoadType;
  rx: Prescription;
  index?: number;
  showLink?: boolean;
}

export function ExerciseLogger({ name, load, rx, index, showLink = true }: Props) {
  const logs = useLogs();
  const { unit } = useSettings();
  const today = useTodayKey();
  const history = logs[rx.slug] ?? [];
  const todaySession = today ? history.find((s) => s.date === today) : undefined;
  const rec = recommend(rx, load, history, unit, today);
  const [drafts, setDrafts] = useState<Record<number, { w?: string; r?: string }>>({});
  const isTimed = rx.slug === "plank" || rx.slug === "side-plank";
  const bodyweight = load === "bodyweight";
  const done = todaySession?.sets.length ?? 0;
  const { icon: RecIcon, cls } = recStyle[rec.kind];

  const setDraft = (i: number, patch: { w?: string; r?: string }) =>
    setDrafts((d) => ({ ...d, [i]: { ...d[i], ...patch } }));

  return (
    <article className="rounded-2xl border bg-card">
      <header className="flex items-start gap-3 p-4 pb-3">
        {index !== undefined && (
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
              done >= rx.sets ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            {done >= rx.sets ? <Check className="size-4" /> : index + 1}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg leading-tight font-bold">
            {showLink ? (
              <Link href={`/exercises/${rx.slug}`} className="underline-offset-4 hover:underline">
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {rx.sets} × {rx.repMin}–{rx.repMax}
            {isTimed ? " s" : " reps"} · RIR {rx.rir} · Rest {formatRest(rx.restSec)}
          </p>
        </div>
        {showLink && (
          <Link
            href={`/exercises/${rx.slug}`}
            className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted"
            aria-label={`How to do ${name}`}
          >
            <Image
              src={`/media/exercises/${rx.slug}/1.webp`}
              alt=""
              fill
              unoptimized
              loading="lazy"
              className="object-cover"
            />
            <span className="absolute right-1 bottom-1 grid size-5 place-items-center rounded-full bg-black/60 text-white">
              <Info className="size-3" />
            </span>
          </Link>
        )}
      </header>

      <div className={cn("mx-4 flex gap-2.5 rounded-xl border p-3 text-sm", cls)}>
        <RecIcon className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="font-semibold">{rec.headline}</p>
          <p className="text-muted-foreground">{rec.detail}</p>
        </div>
      </div>

      <div className="p-4 pt-3">
        <div className="grid grid-cols-[2.5rem_1fr_1fr_3rem] items-center gap-2 px-1 pb-1.5 text-xs font-medium text-muted-foreground">
          <span>Set</span>
          <span>{bodyweight ? `+${unit}` : unit}</span>
          <span>{isTimed ? "Seconds" : "Reps"}</span>
          <span />
        </div>
        <ul className="space-y-2">
          {Array.from({ length: rx.sets }, (_, i) => {
            const logged = todaySession?.sets[i];
            const d = drafts[i] ?? {};
            const wVal = d.w ?? (logged ? String(logged.weight) : rec.weight != null ? String(rec.weight) : "");
            const rVal = d.r ?? (logged ? String(logged.reps) : "");
            const canLog = i <= done;
            return (
              <li
                key={i}
                className={cn(
                  "grid grid-cols-[2.5rem_1fr_1fr_3rem] items-center gap-2 rounded-xl p-1 transition-colors",
                  logged && "bg-primary/10",
                )}
              >
                <span className="text-center font-mono text-sm font-semibold">{i + 1}</span>
                <input
                  inputMode="decimal"
                  type="number"
                  min={0}
                  step="any"
                  aria-label={`Set ${i + 1} weight`}
                  placeholder={bodyweight ? "0" : "—"}
                  value={wVal}
                  onChange={(e) => setDraft(i, { w: e.target.value })}
                  className="h-11 w-full min-w-0 rounded-lg border bg-background px-3 text-center font-mono text-base tabular-nums outline-none focus:border-primary"
                />
                <input
                  inputMode="numeric"
                  type="number"
                  min={0}
                  aria-label={`Set ${i + 1} ${isTimed ? "seconds" : "reps"}`}
                  placeholder={String(rec.targetReps[i] ?? rx.repMin)}
                  value={rVal}
                  onChange={(e) => setDraft(i, { r: e.target.value })}
                  className="h-11 w-full min-w-0 rounded-lg border bg-background px-3 text-center font-mono text-base tabular-nums outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                />
                {logged ? (
                  <button
                    type="button"
                    onClick={() => {
                      saveSet(rx.slug, i, null);
                      setDrafts((all) => {
                        const next = { ...all };
                        delete next[i];
                        return next;
                      });
                    }}
                    className="grid h-11 place-items-center rounded-lg bg-primary text-primary-foreground"
                    aria-label={`Undo set ${i + 1}`}
                    title="Undo"
                  >
                    <Check className="size-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canLog}
                    onClick={() => {
                      const reps = Number(rVal || rec.targetReps[i] || rx.repMin);
                      const weight = Number(wVal || 0);
                      if (!Number.isFinite(reps) || reps <= 0) return;
                      primeAudio();
                      saveSet(rx.slug, i, { weight: Number.isFinite(weight) ? weight : 0, reps });
                      setDrafts((all) => {
                        const next = { ...all };
                        delete next[i];
                        return next;
                      });
                      const last = i + 1 >= rx.sets;
                      timer.start(rx.restSec, last ? `${name} done — next exercise` : `${name} · set ${i + 2} next`);
                    }}
                    className="grid h-11 place-items-center rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                    aria-label={`Log set ${i + 1}`}
                  >
                    <Check className="size-5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        {done > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <RotateCcw className="size-3" /> Tap a green tick to undo a set.
          </p>
        )}
      </div>
    </article>
  );
}
