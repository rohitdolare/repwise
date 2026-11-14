"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { exerciseImages, IMAGE_CREDIT } from "@/content/visuals";
import { cn } from "@/lib/utils";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(reducedMotionQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

/** Start ↔ finish photos that loop like a GIF. Tap a label to freeze on that position. */
export function ExerciseDemo({ slug, name, note, priority }: { slug: string; name: string; note?: string; priority?: boolean }) {
  const [start, end] = exerciseImages(slug);
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !paused && !reduced;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setFrame((f) => (f ? 0 : 1)), 1200);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <figure className="overflow-hidden rounded-2xl border bg-card">
      <div className="relative aspect-[3/2] bg-muted">
        {[start, end].map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${name} — ${i ? "finish" : "start"} position`}
            fill
            unoptimized
            priority={priority && i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn("object-cover transition-opacity duration-500", frame === i ? "opacity-100" : "opacity-0")}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          {(["Start", "Finish"] as const).map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setPaused(true);
                setFrame(i);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold backdrop-blur transition-colors",
                frame === i ? "bg-primary text-primary-foreground" : "bg-white/20 text-white",
              )}
            >
              {i + 1}. {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="ml-auto grid size-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur"
            aria-label={playing ? "Pause animation" : "Play animation"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
        </div>
      </div>
      <figcaption className="space-y-0.5 px-3 py-2 text-xs text-muted-foreground">
        {note && <p className="text-foreground/80">{note}</p>}
        <p>
          Photos:{" "}
          <a href={IMAGE_CREDIT.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {IMAGE_CREDIT.name}
          </a>{" "}
          · {IMAGE_CREDIT.license}
        </p>
      </figcaption>
    </figure>
  );
}
