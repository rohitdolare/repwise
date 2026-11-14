"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Timer, X } from "lucide-react";
import { formatTime, timer, useTimer } from "@/lib/timer";
import { beep } from "@/lib/beep";
import { cn } from "@/lib/utils";

/** Floating rest timer. Started automatically when a set is logged. */
export function RestTimer() {
  const { endsAt, duration, label } = useTimer();
  const [remaining, setRemaining] = useState(0);
  const firedFor = useRef<number | null>(null);

  useEffect(() => {
    if (!endsAt) return;
    const tick = () => {
      const left = (endsAt - Date.now()) / 1000;
      setRemaining(left);
      if (left <= 0 && firedFor.current !== endsAt) {
        firedFor.current = endsAt;
        beep();
        setTimeout(() => {
          // Only clear if no new timer has started meanwhile.
          if (firedFor.current === endsAt) timer.stop();
        }, 4000);
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!endsAt) return null;
  const done = remaining <= 0;
  const pct = duration > 0 ? Math.min(100, Math.max(0, (1 - remaining / duration) * 100)) : 0;

  return (
    <div
      role="timer"
      aria-live="polite"
      className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md md:bottom-6"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-card/95 shadow-xl backdrop-blur-lg",
          done && "border-primary",
        )}
      >
        <div className="absolute inset-y-0 left-0 bg-primary/15 transition-[width] duration-300" style={{ width: `${pct}%` }} />
        <div className="relative flex items-center gap-3 px-4 py-3">
          <Timer className={cn("size-5 shrink-0", done ? "text-primary" : "text-muted-foreground")} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{done ? "Rest complete" : label}</p>
            <p className="font-mono text-2xl leading-none font-bold tabular-nums">
              {done ? "Go! 💪" : formatTime(remaining)}
            </p>
          </div>
          {!done && (
            <>
              <button
                type="button"
                onClick={() => timer.add(-15)}
                className="grid size-10 place-items-center rounded-full bg-muted text-sm font-semibold"
                aria-label="Subtract 15 seconds"
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => timer.add(15)}
                className="grid size-10 place-items-center rounded-full bg-muted text-sm font-semibold"
                aria-label="Add 15 seconds"
              >
                <Plus className="size-4" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => timer.stop()}
            className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"
            aria-label="Dismiss timer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
