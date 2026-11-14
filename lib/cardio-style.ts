import type { PhaseKind } from "@/content/cardio";

export const kindStyle: Record<PhaseKind, { label: string; panel: string; dot: string }> = {
  warm: { label: "Warm-up", panel: "bg-amber-500/15 border-amber-500/40", dot: "bg-amber-500" },
  easy: { label: "Easy", panel: "bg-sky-500/15 border-sky-500/40", dot: "bg-sky-500" },
  work: { label: "Work", panel: "bg-primary/20 border-primary", dot: "bg-primary" },
  rest: { label: "Rest", panel: "bg-muted border-border", dot: "bg-muted-foreground" },
  cool: { label: "Cool-down", panel: "bg-indigo-500/15 border-indigo-500/40", dot: "bg-indigo-500" },
};
