"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { ExternalLink, Play, WifiOff } from "lucide-react";
import type { ExerciseVideo } from "@/content/videos";

function useOnline() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("online", cb);
      window.addEventListener("offline", cb);
      return () => {
        window.removeEventListener("online", cb);
        window.removeEventListener("offline", cb);
      };
    },
    () => navigator.onLine,
    () => true,
  );
}

/**
 * Lightweight YouTube embed: shows our own (offline-cached) photo as the poster and only
 * loads YouTube's player after a tap — fast pages, no third-party requests until needed.
 */
export function VideoEmbed({ video, poster, name }: { video: ExerciseVideo; poster: string; name: string }) {
  const [playing, setPlaying] = useState(false);
  const online = useOnline();
  const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1", modestbranding: "1" });
  if (video.start) params.set("start", String(video.start));
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}${video.start ? `&t=${video.start}s` : ""}`;

  return (
    <figure className="overflow-hidden rounded-2xl border bg-card">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?${params}`}
            title={`${name} — ${video.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            disabled={!online}
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 size-full text-left disabled:cursor-not-allowed"
            aria-label={`Play video: ${video.title}`}
          >
            <Image src={poster} alt="" fill unoptimized className="object-cover opacity-80" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
            <span className="absolute inset-0 grid place-items-center">
              {online ? (
                <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform group-hover:scale-110 md:size-20">
                  <Play className="ml-1 size-7 fill-current md:size-9" />
                </span>
              ) : (
                <span className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white">
                  <WifiOff className="size-4" /> Video needs internet — use the Photos tab offline
                </span>
              )}
            </span>
            <span className="absolute inset-x-0 bottom-0 p-3 text-white">
              <span className="line-clamp-2 block text-sm leading-snug font-semibold">{video.title}</span>
              <span className="mt-0.5 block text-xs text-white/75">by {video.channel} · YouTube</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-3 py-2 text-xs text-muted-foreground">
        <span className="truncate">Video by {video.channel}</span>
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 font-medium underline-offset-2 hover:text-foreground hover:underline"
        >
          Open on YouTube <ExternalLink className="size-3" />
        </a>
      </figcaption>
    </figure>
  );
}
