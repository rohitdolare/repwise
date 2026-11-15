import { cn } from "@/lib/utils";

/**
 * Original side-view line figures for the Surya Namaskar poses (facing right, ground at y=140).
 * Drawn as simple strokes so they stay crisp, follow the text colour (light/dark) and work offline.
 */
type Pt = [number, number];
interface PoseShape {
  head: Pt;
  /** Polylines drawn with full opacity (near side). */
  near: Pt[][];
  /** Polylines drawn faintly (far leg/arm), when it doesn't overlap the near one. */
  far?: Pt[][];
}

export type PoseId =
  | "prayer"
  | "raised-arms"
  | "forward-fold"
  | "low-lunge"
  | "plank"
  | "eight-limbs"
  | "cobra"
  | "mountain"
  | "tadasana"
  | "shavasana";

const poses: Record<PoseId, PoseShape> = {
  prayer: {
    head: [100, 39],
    near: [
      [[100, 140], [100, 112], [100, 84], [100, 52]], // leg + torso
      [[100, 55], [104, 79], [118, 64]], // arm, palms at chest
    ],
  },
  "raised-arms": {
    head: [100, 41],
    near: [
      [[100, 140], [101, 112], [103, 84], [96, 53]],
      [[96, 56], [88, 31], [82, 10]],
    ],
  },
  "forward-fold": {
    head: [116, 124],
    near: [
      [[104, 140], [100, 112], [94, 84], [110, 110]], // straight legs, torso folded over them
      [[110, 110], [119, 124], [126, 140]], // hands to the floor
    ],
  },
  "low-lunge": {
    head: [113, 74],
    near: [
      [[40, 140], [66, 137], [92, 116], [106, 87]], // back leg (knee down) + lifted chest
      [[92, 116], [120, 112], [120, 140]], // front leg, shin vertical
    ],
    far: [[[106, 90], [124, 112], [132, 140]]], // arm reaching to the floor
  },
  plank: {
    head: [141, 86],
    near: [
      [[50, 140], [76, 125], [101, 110], [130, 92]],
      [[130, 92], [130, 116], [130, 140]],
    ],
  },
  "eight-limbs": {
    head: [131, 131],
    near: [
      [[44, 137], [70, 138], [92, 120], [122, 130]],
      [[122, 130], [106, 118], [118, 140]],
    ],
  },
  cobra: {
    head: [129, 102],
    near: [
      [[40, 138], [68, 138], [96, 136], [122, 115]],
      [[122, 117], [113, 130], [124, 140]],
    ],
  },
  mountain: {
    head: [109, 116],
    near: [
      [[68, 140], [73, 112], [78, 85], [101, 107]],
      [[101, 107], [118, 123], [136, 140]],
    ],
  },
  tadasana: {
    head: [100, 39],
    near: [[[100, 140], [100, 112], [100, 84], [100, 52]]],
    far: [[[103, 56], [107, 80], [107, 104]]], // arm relaxed by the side
  },
  shavasana: {
    head: [46, 131],
    near: [[[158, 139], [130, 139], [102, 139], [59, 138]]], // lying flat on the back
    far: [[[62, 136], [84, 134], [106, 135]]], // arm resting by the side
  },
};

const toPath = (line: Pt[]) => line.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

export function PoseFigure({
  pose,
  mirror,
  className,
  title,
}: {
  pose: PoseId;
  /** Flip horizontally (left-leg half of the round). */
  mirror?: boolean;
  className?: string;
  title?: string;
}) {
  const p = poses[pose];
  return (
    <svg
      viewBox="20 0 160 150"
      role="img"
      aria-label={title ?? pose}
      className={cn("text-foreground", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="24" y1="145" x2="176" y2="145" strokeWidth="2" className="text-muted-foreground" opacity="0.4" />
      <g transform={mirror ? "translate(200 0) scale(-1 1)" : undefined}>
        {p.far?.map((l, i) => (
          <path key={`f${i}`} d={toPath(l)} strokeWidth="6" opacity="0.45" />
        ))}
        {p.near.map((l, i) => (
          <path key={`n${i}`} d={toPath(l)} strokeWidth="6" />
        ))}
        <circle cx={p.head[0]} cy={p.head[1]} r="9" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
