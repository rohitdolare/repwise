"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Home, Search, Timer, X } from "lucide-react";
import type { MuscleGroup } from "@/lib/types";
import { ExerciseCard, type ExerciseSummary } from "./exercise-card";
import { cn } from "@/lib/utils";

// The "Home-friendly" filter lives in the URL hash (#home) so other pages can link to it.
const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const readHome = () => window.location.hash === "#home";

function setHomeFilter(on: boolean) {
  const url = on ? "#home" : window.location.pathname + window.location.search;
  history.replaceState(null, "", url);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export interface SessionSummary {
  id: string;
  name: string;
  type: string;
  summary: string;
}

export function ExerciseBrowser({
  items,
  groups,
  sessions = [],
}: {
  items: ExerciseSummary[];
  groups: { id: MuscleGroup; label: string; blurb: string }[];
  sessions?: SessionSummary[];
}) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<MuscleGroup | "all">("all");
  const homeOnly = useSyncExternalStore(subscribeHash, readHome, () => false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (e) =>
        (group === "all" || e.group === group) &&
        (!homeOnly || e.home) &&
        (!needle ||
          e.name.toLowerCase().includes(needle) ||
          e.primary.some((m) => m.toLowerCase().includes(needle)) ||
          e.equipment.some((m) => m.toLowerCase().includes(needle))),
    );
  }, [items, q, group, homeOnly]);

  const needle = q.trim().toLowerCase();
  const matchedSessions = needle
    ? sessions.filter((s) => `${s.name} ${s.type} ${s.summary}`.toLowerCase().includes(needle))
    : [];

  const shownGroups = groups.filter((g) => filtered.some((e) => e.group === g.id));

  return (
    <div className="space-y-6">
      <div className="top-header sticky z-30 -mx-4 space-y-3 bg-background/90 px-4 py-3 backdrop-blur-lg">
        <label className="relative block">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercise or muscle…"
            className="h-12 w-full rounded-xl border bg-card pr-10 pl-10 text-base outline-none focus:border-primary"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <button
            type="button"
            aria-pressed={homeOnly}
            onClick={() => setHomeFilter(!homeOnly)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              homeOnly ? "border-primary bg-primary text-primary-foreground" : "border-primary/50 bg-card text-primary",
            )}
          >
            <Home className="size-3.5" /> Home-friendly
          </button>
          <span className="w-px shrink-0 bg-border" aria-hidden />
          {[{ id: "all" as const, label: "All" }, ...groups].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                group === g.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {matchedSessions.length > 0 && (
        <section>
          <h2 className="mb-3 font-heading text-xl font-bold">Guided sessions</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {matchedSessions.map((s) => (
              <Link
                key={s.id}
                href={`/cardio/${s.id}`}
                className="flex items-center gap-3 rounded-2xl border border-primary/50 bg-primary/10 p-4 hover:bg-primary/15"
              >
                <Timer className="size-6 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block font-heading font-bold">{s.name}</span>
                  <span className="line-clamp-2 text-sm text-muted-foreground">
                    {s.type} · {s.summary}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {shownGroups.length === 0 && matchedSessions.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">
          {q ? <>No exercises match “{q}”.</> : "No home-friendly exercises in this group yet."}
        </p>
      )}

      {shownGroups.map((g) => (
        <section key={g.id}>
          <div className="mb-3">
            <h2 className="font-heading text-xl font-bold">{g.label}</h2>
            <p className="text-sm text-muted-foreground">{g.blurb}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filtered
              .filter((e) => e.group === g.id)
              .map((e) => (
                <ExerciseCard key={e.slug} exercise={e} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
