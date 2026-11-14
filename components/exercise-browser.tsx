"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { MuscleGroup } from "@/lib/types";
import { ExerciseCard, type ExerciseSummary } from "./exercise-card";
import { cn } from "@/lib/utils";

export function ExerciseBrowser({
  items,
  groups,
}: {
  items: ExerciseSummary[];
  groups: { id: MuscleGroup; label: string; blurb: string }[];
}) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<MuscleGroup | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (e) =>
        (group === "all" || e.group === group) &&
        (!needle ||
          e.name.toLowerCase().includes(needle) ||
          e.primary.some((m) => m.toLowerCase().includes(needle)) ||
          e.equipment.some((m) => m.toLowerCase().includes(needle))),
    );
  }, [items, q, group]);

  const shownGroups = groups.filter((g) => filtered.some((e) => e.group === g.id));

  return (
    <div className="space-y-6">
      <div className="sticky top-14 z-30 -mx-4 space-y-3 bg-background/90 px-4 py-3 backdrop-blur-lg">
        <label className="relative block">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercise, muscle or equipment…"
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
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
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

      {shownGroups.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">No exercises match “{q}”.</p>
      )}

      {shownGroups.map((g) => (
        <section key={g.id}>
          <div className="mb-3">
            <h2 className="font-heading text-xl font-bold">{g.label}</h2>
            <p className="text-sm text-muted-foreground">{g.blurb}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
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
