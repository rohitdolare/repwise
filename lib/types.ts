export type MuscleGroup = "chest" | "back" | "shoulders" | "legs" | "arms" | "core" | "cardio";

/** How the progression engine should add load once the top of the rep range is reached. */
export type LoadType = "lower" | "upper" | "isolation" | "bodyweight" | "cardio";

export interface Mistake {
  mistake: string;
  fix: string;
}

export interface Exercise {
  slug: string;
  name: string;
  group: MuscleGroup;
  primary: string[];
  secondary: string[];
  equipment: string[];
  level: "Beginner" | "Intermediate";
  load: LoadType;
  overview: string;
  setup: string[];
  steps: string[];
  breathing: string;
  cues: string[];
  mistakes: Mistake[];
  prescription: { sets: string; reps: string; rir: string };
  rest: string;
  alternatives: string[];
  /** Only for cardio modalities. */
  cardio?: { impact: "Low" | "Medium" | "High"; bestFor: string; sessions: string[] };
  /** Can be done at home with no equipment (floor, wall, chair, table, step). */
  home?: true;
  /** Sets are held for time — logged in seconds instead of reps. */
  timed?: true;
  /** Variation ladder for bodyweight progression (exercise slugs). */
  harder?: string;
  easier?: string;
}

export interface Prescription {
  slug: string;
  sets: number;
  repMin: number;
  repMax: number;
  rir: string;
  restSec: number;
  /** Do this exercise with bodyweight only (e.g. Bulgarian split squat in a home plan). */
  bodyweight?: true;
}

export interface WorkoutDay {
  id: string;
  name: string;
  focus: string;
  exercises: Prescription[];
}

export interface Program {
  id: string;
  /** Where the plan is trained: a gym, or at home with no equipment. */
  setting: "gym" | "home";
  name: string;
  short: string;
  level: string;
  daysPerWeek: number;
  summary: string;
  whoFor: string;
  /** Weekly cardio & core recommendations for this plan. */
  cardio: string[];
  /** Index 0 = Monday … 6 = Sunday. Value is a workout id, or null for rest. */
  schedule: (string | null)[];
  workouts: WorkoutDay[];
}

export interface LoggedSet {
  weight: number;
  reps: number;
}

export interface Session {
  date: string; // YYYY-MM-DD
  sets: LoggedSet[];
}
