"use client";

import Model, { type Muscle } from "react-body-highlighter";

/** Front + back body diagram with primary (strong) and secondary (light) muscles highlighted. */
export function MuscleMap({ primary, secondary, size = "md" }: { primary: Muscle[]; secondary: Muscle[]; size?: "sm" | "md" }) {
  // Frequency 1 → secondary colour, frequency 2 → primary colour.
  const data = [
    { name: "secondary", muscles: [...secondary, ...primary] },
    { name: "primary", muscles: primary },
  ];
  const width = size === "sm" ? "5.5rem" : "9rem";
  const colors = ["color-mix(in oklch, var(--primary) 40%, transparent)", "var(--primary)"];
  return (
    <div className="flex items-start justify-center gap-4">
      {(["anterior", "posterior"] as const).map((type) => (
        <div key={type} className="text-center">
          <Model
            type={type}
            data={data}
            bodyColor="color-mix(in oklch, var(--foreground) 14%, transparent)"
            highlightedColors={colors}
            style={{ width, pointerEvents: "none" }}
          />
          {size === "md" && <p className="mt-1 text-xs text-muted-foreground">{type === "anterior" ? "Front" : "Back"}</p>}
        </div>
      ))}
    </div>
  );
}

export function MuscleLegend() {
  return (
    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-sm bg-primary" /> Primary
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-sm bg-primary/40" /> Secondary
      </span>
    </div>
  );
}
