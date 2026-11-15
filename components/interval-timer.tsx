"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Pause, Play, RotateCcw, SkipBack, SkipForward, Square } from "lucide-react";
import type { Phase } from "@/content/cardio";
import { kindStyle } from "@/lib/cardio-style";
import { PoseFigure } from "./pose-figure";
import { beep, primeAudio, tone, vibrate } from "@/lib/beep";
import { logCardio } from "@/lib/store";
import { formatTime } from "@/lib/format";
import { useWakeLock } from "@/lib/wake-lock";
import { cn } from "@/lib/utils";

type Status = "idle" | "running" | "paused" | "done";

export function IntervalTimer({ workoutId, name, phases }: { workoutId: string; name: string; phases: Phase[] }) {
  const total = phases.reduce((t, p) => t + p.sec, 0);
  const [status, setStatus] = useState<Status>("idle");
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(phases[0]?.sec ?? 0);
  const [loggedMin, setLoggedMin] = useState<number | null>(null);
  const idxRef = useRef(0);
  const endsAt = useRef(0);
  const pausedMs = useRef(0);
  const lastTick = useRef("");

  useWakeLock(status === "running");

  const elapsedSec = phases.slice(0, idx).reduce((t, p) => t + p.sec, 0) + ((phases[idx]?.sec ?? 0) - remaining);

  const finish = (completed: boolean, elapsed: number) => {
    setStatus("done");
    const minutes = Math.max(1, Math.round(elapsed / 60));
    if (completed) beep();
    if (elapsed >= 60) {
      logCardio({ workoutId, label: name, minutes });
      setLoggedMin(minutes);
    } else {
      setLoggedMin(null);
    }
  };

  const goTo = (i: number, running: boolean) => {
    idxRef.current = i;
    setIdx(i);
    setRemaining(phases[i].sec);
    if (running) endsAt.current = Date.now() + phases[i].sec * 1000;
    else pausedMs.current = phases[i].sec * 1000;
  };

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      const now = Date.now();
      let i = idxRef.current;
      let end = endsAt.current;
      let changed = false;
      while (now >= end) {
        i += 1;
        if (i >= phases.length) {
          clearInterval(id);
          setRemaining(0);
          finish(true, total);
          return;
        }
        end += phases[i].sec * 1000;
        changed = true;
      }
      if (changed) {
        idxRef.current = i;
        endsAt.current = end;
        setIdx(i);
        const kind = phases[i].kind;
        // Yoga poses get a soft cue; intervals get a clear signal.
        tone(
          kind === "work" ? 1046 : kind === "flow" ? 587 : 660,
          kind === "flow" ? 180 : 280,
          kind === "flow" ? 0.25 : 0.45,
        );
        vibrate(kind === "work" ? [150, 80, 150] : kind === "flow" ? 40 : 200);
      }
      const left = (end - now) / 1000;
      const whole = Math.ceil(left);
      const key = `${i}-${whole}`;
      if (whole <= 3 && whole >= 1 && phases[i].sec > 5 && phases[i].kind !== "flow" && lastTick.current !== key) {
        lastTick.current = key;
        tone(520, 90, 0.3);
      }
      setRemaining(left);
    }, 200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, phases, total]);

  const start = () => {
    primeAudio();
    setLoggedMin(null);
    goTo(0, true);
    setStatus("running");
    tone(660, 200);
  };
  const pause = () => {
    pausedMs.current = Math.max(0, endsAt.current - Date.now());
    setStatus("paused");
  };
  const resume = () => {
    primeAudio();
    endsAt.current = Date.now() + pausedMs.current;
    setStatus("running");
  };
  const skip = (dir: 1 | -1) => {
    const next = idxRef.current + dir;
    if (next < 0) return goTo(0, status === "running");
    if (next >= phases.length) return finish(false, elapsedSec);
    goTo(next, status === "running");
  };

  const phase = phases[idx];
  const next = phases[idx + 1];
  const style = kindStyle[phase.kind];
  const pct = Math.min(100, (elapsedSec / total) * 100);

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-primary bg-primary/10 p-6 text-center">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <p className="mt-3 font-heading text-2xl font-black">Session complete!</p>
        <p className="mt-1 text-muted-foreground">
          {loggedMin ? `${loggedMin} minutes added to your weekly cardio.` : "Too short to log — under 1 minute."}
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold"
          >
            <RotateCcw className="size-4" /> Again
          </button>
          <Link href="/progress" className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground">
            See progress
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={cn("relative overflow-hidden rounded-3xl border-2 p-5 transition-colors md:p-7", style.panel)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.18em] uppercase opacity-80">
              {style.label} · {idx + 1}/{phases.length}
            </p>
            <h2 className="mt-1 font-heading text-3xl font-black md:text-4xl">{phase.label}</h2>
            {phase.cue && <p className="mt-1 text-sm text-pretty opacity-90">{phase.cue}</p>}
          </div>
          {phase.slug && (
            <Link
              href={`/exercises/${phase.slug}`}
              className="relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-muted"
              aria-label={`How to do ${phase.label}`}
            >
              <Image src={`/media/exercises/${phase.slug}/1.webp`} alt="" fill unoptimized className="object-cover" />
            </Link>
          )}
        </div>

        {phase.pose && (
          <PoseFigure
            key={`${idx}-${phase.pose}`}
            pose={phase.pose}
            mirror={phase.mirror}
            title={phase.label}
            className="mx-auto mt-4 h-40 w-auto animate-in duration-300 fade-in md:h-48"
          />
        )}

        <p
          className={cn(
            "text-center font-mono font-bold tabular-nums",
            phase.pose ? "my-3 text-5xl md:text-6xl" : "my-6 text-7xl md:text-8xl",
          )}
          aria-live="off"
        >
          {formatTime(remaining)}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => skip(-1)}
            disabled={status === "idle"}
            className="grid size-12 place-items-center rounded-full bg-background/70 disabled:opacity-40"
            aria-label="Previous phase"
          >
            <SkipBack className="size-5" />
          </button>
          <button
            type="button"
            onClick={status === "idle" ? start : status === "running" ? pause : resume}
            className="grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label={status === "running" ? "Pause" : "Start"}
          >
            {status === "running" ? <Pause className="size-8" /> : <Play className="ml-1 size-8" />}
          </button>
          <button
            type="button"
            onClick={() => skip(1)}
            disabled={status === "idle"}
            className="grid size-12 place-items-center rounded-full bg-background/70 disabled:opacity-40"
            aria-label="Next phase"
          >
            <SkipForward className="size-5" />
          </button>
        </div>
        {status === "paused" && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => finish(false, elapsedSec)}
              className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
            >
              <Square className="size-3.5" /> End session & log {Math.round(elapsedSec / 60)} min
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium">
            {next ? `Next: ${next.label} (${formatTime(next.sec)})` : "Last phase — finish strong!"}
          </span>
          <span className="font-mono text-muted-foreground">
            {formatTime(elapsedSec)} / {formatTime(total)}
          </span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-muted">
          {phases.map((p, i) => (
            <div
              key={i}
              className={cn(kindStyle[p.kind].dot, i > idx && "opacity-25", i === idx && "opacity-70")}
              style={{ width: `${(p.sec / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full">
          <div className="h-full bg-foreground/60 transition-all" style={{ width: `${pct}%` }} />
        </div>
        {status === "idle" && (
          <p className="mt-3 text-xs text-muted-foreground">
            Tip: turn your volume up. You&apos;ll hear a beep at every phase change and a 3-2-1 countdown. The screen
            stays on while the timer runs.
          </p>
        )}
      </div>
    </div>
  );
}
