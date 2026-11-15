import { refs, type Block, type Reference } from "./blocks";
import type { PoseId } from "@/components/pose-figure";

export type PhaseKind = "warm" | "easy" | "work" | "rest" | "cool" | "flow";

export interface Phase {
  label: string;
  sec: number;
  kind: PhaseKind;
  cue?: string;
  /** Optional exercise page for this phase. */
  slug?: string;
  /** Yoga pose illustration to show for this phase. */
  pose?: PoseId;
  mirror?: boolean;
}

export interface CardioWorkout {
  id: string;
  name: string;
  type: "Zone 2" | "Intervals" | "HIIT" | "Sprint" | "Core" | "Circuit" | "Yoga";
  level: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  why: string;
  intensity: string;
  howOften: string;
  equipment: string[]; // exercise slugs
  phases: Phase[];
  references: Reference[];
}

const m = (min: number) => min * 60;

function repeat(times: number, make: (i: number) => Phase[], between?: (i: number) => Phase[]): Phase[] {
  const out: Phase[] = [];
  for (let i = 0; i < times; i++) {
    out.push(...make(i));
    if (between && i < times - 1) out.push(...between(i));
  }
  return out;
}

const circuit = (
  rounds: number,
  moves: { label: string; slug?: string; work: number; rest: number; cue?: string }[],
  roundRest: number,
): Phase[] =>
  repeat(
    rounds,
    (r) =>
      moves.flatMap((mv, i) => {
        const phases: Phase[] = [
          {
            label: mv.label,
            sec: mv.work,
            kind: "work",
            slug: mv.slug,
            cue: `Round ${r + 1}/${rounds}${mv.cue ? ` · ${mv.cue}` : ""}`,
          },
        ];
        if (mv.rest && i < moves.length - 1)
          phases.push({ label: "Rest", sec: mv.rest, kind: "rest", cue: `Next: ${moves[i + 1].label}` });
        return phases;
      }),
    () => [{ label: "Round rest", sec: roundRest, kind: "rest", cue: "Shake it out, sip water" }],
  );

/** The 12 poses of Surya Namaskar, in order, with the breath for each. Used by the guided flow and the pose chart. */
export const suryaSequence: { n: number; name: string; english: string; pose: PoseId; breath: string; how: string }[] = [
  { n: 1, name: "Pranamasana", english: "Prayer", pose: "prayer", breath: "Out", how: "Stand tall, palms together at the chest" },
  { n: 2, name: "Hasta Uttanasana", english: "Raised arms", pose: "raised-arms", breath: "In", how: "Lift the arms up and gently back, biceps by the ears" },
  { n: 3, name: "Hasta Padasana", english: "Forward bend", pose: "forward-fold", breath: "Out", how: "Fold forward, hands beside the feet — bend the knees if needed" },
  { n: 4, name: "Ashwa Sanchalanasana", english: "Low lunge", pose: "low-lunge", breath: "In", how: "Step one leg back, knee down, chest up, look up" },
  { n: 5, name: "Dandasana", english: "Plank", pose: "plank", breath: "Hold", how: "Step the other leg back into a straight plank" },
  { n: 6, name: "Ashtanga Namaskara", english: "Eight limbs", pose: "eight-limbs", breath: "Out", how: "Knees, chest and chin to the floor, hips slightly up" },
  { n: 7, name: "Bhujangasana", english: "Cobra", pose: "cobra", breath: "In", how: "Slide forward and lift the chest, elbows soft, shoulders down" },
  { n: 8, name: "Parvatasana", english: "Mountain", pose: "mountain", breath: "Out", how: "Lift the hips into an upside-down V, heels toward the floor" },
  { n: 9, name: "Ashwa Sanchalanasana", english: "Low lunge", pose: "low-lunge", breath: "In", how: "Step the first leg forward between the hands, look up" },
  { n: 10, name: "Hasta Padasana", english: "Forward bend", pose: "forward-fold", breath: "Out", how: "Bring the other foot forward and fold" },
  { n: 11, name: "Hasta Uttanasana", english: "Raised arms", pose: "raised-arms", breath: "In", how: "Roll up and reach the arms up and back" },
  { n: 12, name: "Tadasana", english: "Standing", pose: "tadasana", breath: "Out", how: "Lower the arms, stand tall and relax" },
];

const breathCue = (b: string) => (b === "Hold" ? "hold the breath" : `breathe ${b.toLowerCase()}`);

/** One half-round, leading with `leg`. Poses 4/9 step that leg back/forward; 5/10 move the other leg. */
const suryaPoses = (leg: "right" | "left") => {
  const other = leg === "right" ? "left" : "right";
  const sided: Record<number, string> = {
    4: `Step the ${leg} leg back, knee down, chest up, look up`,
    5: `Step the ${other} leg back into a straight plank`,
    9: `Step the ${leg} foot forward between the hands, look up`,
    10: `Bring the ${other} foot forward and fold`,
  };
  return suryaSequence.map((p) => ({
    label: `${p.n} · ${p.name} (${p.english})`,
    pose: p.pose,
    cue: `${sided[p.n] ?? p.how} · ${breathCue(p.breath)}`,
  }));
};

/** One full round = right-leg half + left-leg half. `sec` is the time per pose (≈ one breath). */
const suryaRound = (round: number, rounds: number, sec: number): Phase[] =>
  (["right", "left"] as const).flatMap((leg) =>
    suryaPoses(leg).map((p) => ({
      label: p.label,
      sec,
      kind: "flow" as const,
      pose: p.pose,
      // Left-leg half is shown mirrored so the side change is visible at a glance.
      mirror: leg === "left",
      cue: `Round ${round}/${rounds} · ${leg} leg · ${p.cue}`,
    })),
  );

export const cardioWorkouts: CardioWorkout[] = [
  {
    id: "zone2",
    name: "Zone 2 Steady Cardio",
    type: "Zone 2",
    level: "Beginner",
    summary: "40 minutes at a comfortable, conversational pace. The foundation of heart health and endurance.",
    why: "Low-intensity, longer-duration cardio builds your aerobic base, improves recovery between sets, and is easy to recover from — it barely interferes with lifting.",
    intensity: "Zone 2 · 60–70% HRmax · RPE 3–4/10 · you can talk in full sentences",
    howOften: "2–4× per week. Ideal on rest days or after lifting.",
    equipment: ["incline-walk", "stationary-bike", "elliptical", "rowing-machine", "stair-climber"],
    phases: [
      { label: "Warm-up", sec: m(5), kind: "warm", cue: "Gradually build to an easy pace" },
      { label: "Zone 2", sec: m(15), kind: "easy", cue: "Talk test: full sentences, nose breathing if you can" },
      { label: "Zone 2", sec: m(15), kind: "easy", cue: "Halfway. Hold the same steady effort" },
      { label: "Cool-down", sec: m(5), kind: "cool", cue: "Ease off and let your heart rate come down" },
    ],
    references: [refs.who, refs.fitnessMortality],
  },
  {
    id: "walk-run",
    name: "Walk–Run Starter",
    type: "Intervals",
    level: "Beginner",
    summary: "Alternate 1 minute of easy jogging with 2 minutes of walking. The safest way to start running.",
    why: "Short running bouts let your joints, tendons and lungs adapt gradually. Each week, add 30 s to the jog or remove one walk.",
    intensity: "Jog: RPE 5–6 · Walk: RPE 2–3",
    howOften: "2–3× per week, never on consecutive days at first.",
    equipment: ["treadmill-run", "incline-walk"],
    phases: [
      { label: "Brisk walk", sec: m(5), kind: "warm", cue: "Warm up with a brisk walk" },
      ...repeat(8, (i) => [
        { label: "Easy jog", sec: 60, kind: "work", cue: `Interval ${i + 1}/8 · relaxed, quick steps` },
        { label: "Walk", sec: 120, kind: "rest", cue: "Recover — breathe easy" },
      ]),
      { label: "Cool-down walk", sec: m(5), kind: "cool" },
    ],
    references: [refs.who],
  },
  {
    id: "norwegian-4x4",
    name: "Norwegian 4×4 Intervals",
    type: "Intervals",
    level: "Intermediate",
    summary: "Four 4-minute hard efforts with 3 minutes easy between. The best-researched session for raising VO₂max.",
    why: "In the original study, 4×4 intervals improved VO₂max more than steady training of equal energy cost. VO₂max is one of the strongest predictors of long-term health.",
    intensity: "Work: 85–95% HRmax · RPE 8/10 (hard but sustainable for 4 min) · Recovery: 60–70%",
    howOften: "1× per week (2× max). Not the day before heavy legs.",
    equipment: ["stationary-bike", "rowing-machine", "treadmill-run", "elliptical"],
    phases: [
      { label: "Warm-up", sec: m(10), kind: "warm", cue: "Easy, then build to moderate in the last 3 minutes" },
      ...repeat(
        4,
        (i) => [
          {
            label: `Hard ${i + 1}/4`,
            sec: m(4),
            kind: "work",
            cue: "85–95% HRmax — strong, steady, can only say a few words",
          },
        ],
        () => [{ label: "Active recovery", sec: m(3), kind: "rest", cue: "Keep moving easily (60–70% HRmax)" }],
      ),
      { label: "Cool-down", sec: m(5), kind: "cool" },
    ],
    references: [refs.fourByFour, refs.fitnessMortality],
  },
  {
    id: "10-20-30",
    name: "10-20-30 Intervals",
    type: "HIIT",
    level: "Intermediate",
    summary: "Repeating 30 s easy → 20 s moderate → 10 s all-out. Three 5-minute blocks; time flies.",
    why: "The 10-20-30 concept improved running performance and blood pressure with about half the training volume in moderately trained runners. Works on bike, rower or treadmill.",
    intensity: "30 s easy (30%) · 20 s moderate (60%) · 10 s sprint (90–100%)",
    howOften: "1–2× per week.",
    equipment: ["stationary-bike", "rowing-machine", "treadmill-run", "battle-ropes"],
    phases: [
      { label: "Warm-up", sec: m(10), kind: "warm", cue: "Easy pace, finish with a couple of short pickups" },
      ...repeat(
        3,
        (b) =>
          repeat(5, (i) => [
            { label: "Easy", sec: 30, kind: "easy", cue: `Block ${b + 1}/3 · rep ${i + 1}/5` },
            { label: "Moderate", sec: 20, kind: "work", cue: "Steady, comfortably hard" },
            { label: "SPRINT", sec: 10, kind: "work", cue: "All-out!" },
          ]),
        () => [{ label: "Block rest", sec: m(2), kind: "rest", cue: "Easy movement or full rest" }],
      ),
      { label: "Cool-down", sec: m(5), kind: "cool" },
    ],
    references: [refs.tenTwentyThirty, refs.hiit],
  },
  {
    id: "sprint-intervals",
    name: "Bike Sprint Intervals",
    type: "Sprint",
    level: "Advanced",
    summary: "Six 20-second all-out bike sprints with easy pedalling between. 22 minutes total.",
    why: "Very short, very hard sprints improve aerobic and anaerobic fitness with little time. Do them on a bike to keep impact and leg fatigue low.",
    intensity: "Sprint: all-out (RPE 10) · Recovery: very easy",
    howOften: "1× per week. Requires a good fitness base.",
    equipment: ["stationary-bike"],
    phases: [
      { label: "Warm-up", sec: m(5), kind: "warm", cue: "Build gradually; include two 5-second spin-ups" },
      ...repeat(6, (i) => [
        { label: `Sprint ${i + 1}/6`, sec: 20, kind: "work", cue: "Heavy resistance, everything you have!" },
        { label: "Easy spin", sec: 100, kind: "rest", cue: "Very light resistance, keep legs moving" },
      ]),
      { label: "Cool-down", sec: m(5), kind: "cool" },
    ],
    references: [refs.hiit],
  },
  {
    id: "hiit-circuit",
    name: "No-Equipment HIIT Circuit",
    type: "HIIT",
    level: "Intermediate",
    summary: "3 rounds of 5 moves, 40 s on / 20 s off. Do it anywhere — home, hotel, park.",
    why: "Bodyweight intervals raise heart rate quickly and build work capacity when you can't get to a cardio machine.",
    intensity: "Work: RPE 7–9 · keep form clean",
    howOften: "1–2× per week.",
    equipment: ["jump-squat", "mountain-climber", "push-up", "plank"],
    phases: [
      { label: "Warm-up", sec: m(3), kind: "warm", cue: "Easy jumping jacks, arm circles, bodyweight squats" },
      ...circuit(
        3,
        [
          { label: "Jump squats", slug: "jump-squat", work: 40, rest: 20, cue: "Land softly" },
          { label: "Mountain climbers", slug: "mountain-climber", work: 40, rest: 20, cue: "Hips down" },
          { label: "Push-ups", slug: "push-up", work: 40, rest: 20, cue: "Knees down if needed" },
          { label: "High knees", work: 40, rest: 20, cue: "Drive the knees, pump the arms" },
          { label: "Burpees", work: 40, rest: 0, cue: "Step back instead of jumping to make it easier" },
        ],
        60,
      ),
      { label: "Cool-down", sec: m(2), kind: "cool", cue: "Walk around, slow your breathing" },
    ],
    references: [refs.hiit],
  },
  {
    id: "home-express",
    name: "Home Express Circuit",
    type: "Circuit",
    level: "Beginner",
    summary:
      "A full-body bodyweight circuit in about 25 minutes: 3 rounds of 6 moves, 40 s on / 20 s off. No equipment.",
    why: "When you only have 25 minutes and a bit of floor, this hits legs, push, back and core while keeping your heart rate up — strength and conditioning in one.",
    intensity: "Work: RPE 7–8 · steady, clean reps",
    howOften: "1–2× per week on a rest day, or any day you can't do a full session.",
    equipment: ["bodyweight-squat", "push-up", "reverse-lunge", "superman", "mountain-climber", "plank"],
    phases: [
      { label: "Warm-up", sec: m(3), kind: "warm", cue: "March in place, arm circles, 10 slow squats, hip openers" },
      ...circuit(
        3,
        [
          { label: "Bodyweight squats", slug: "bodyweight-squat", work: 40, rest: 20, cue: "Full depth, steady pace" },
          { label: "Push-ups", slug: "push-up", work: 40, rest: 20, cue: "Hands on a table if needed" },
          { label: "Reverse lunges", slug: "reverse-lunge", work: 40, rest: 20, cue: "Alternate legs" },
          { label: "Supermans", slug: "superman", work: 40, rest: 20, cue: "Squeeze 2 s at the top" },
          { label: "Mountain climbers", slug: "mountain-climber", work: 40, rest: 20, cue: "Hips down, quick feet" },
          { label: "Plank", slug: "plank", work: 40, rest: 0, cue: "Glutes tight, ribs down" },
        ],
        60,
      ),
      { label: "Cool-down", sec: m(2), kind: "cool", cue: "Walk around, slow your breathing, stretch" },
    ],
    references: [refs.loads, refs.hiit],
  },
  {
    id: "surya-namaskar",
    name: "Surya Namaskar (Sun Salutation)",
    type: "Yoga",
    level: "Beginner",
    summary:
      "A guided flow of the 12 classic Sun Salutation poses: 3 slow rounds to learn the sequence, then 3 flowing rounds. Each round is done on the right leg, then the left. No equipment — just a mat.",
    why: "Surya Namaskar moves every major joint through a full range and links each pose to a breath. It warms up the whole body, improves flexibility and posture, and at a faster pace raises your heart rate like light cardio.",
    intensity: "Easy to moderate · one breath per pose · never force a stretch",
    howOften: "Daily if you like — 2 slow rounds make a great warm-up before a home workout.",
    equipment: [],
    phases: [
      {
        label: "Settle in",
        sec: 60,
        kind: "warm",
        pose: "prayer",
        cue: "Stand at the front of your mat. Roll the neck and shoulders, then take 5 slow breaths.",
      },
      ...repeat(
        6,
        (r) => suryaRound(r + 1, 6, r < 3 ? 6 : 4),
        (r) => [
          {
            label: "Rest in Tadasana",
            sec: 30,
            kind: "rest",
            pose: "tadasana",
            cue: r === 2 ? "Next 3 rounds flow a little faster — one breath per pose" : "Stand tall, breathe slowly",
          },
        ],
      ),
      {
        label: "Shavasana (Rest)",
        sec: 120,
        kind: "cool",
        pose: "shavasana",
        cue: "Lie on your back, arms by your sides, eyes closed. Let your breathing return to normal.",
      },
    ],
    references: [refs.suryaNamaskar],
  },
  {
    id: "core-finisher",
    name: "10-Minute Abs & Core Finisher",
    type: "Core",
    level: "Beginner",
    summary: "Two rounds hitting every core function: anti-extension, anti-lateral flexion, flexion and rotation.",
    why: "A short, complete core session you can add to the end of any workout 2–3 times a week.",
    intensity: "Controlled reps · stop before form breaks",
    howOften: "2–3× per week, after lifting.",
    equipment: ["dead-bug", "side-plank", "reverse-crunch", "plank", "bicycle-crunch"],
    phases: circuit(
      2,
      [
        { label: "Dead bug", slug: "dead-bug", work: 40, rest: 15, cue: "Back flat, slow reach" },
        { label: "Side plank — left", slug: "side-plank", work: 30, rest: 10, cue: "Hips high" },
        { label: "Side plank — right", slug: "side-plank", work: 30, rest: 15, cue: "Hips high" },
        { label: "Reverse crunch", slug: "reverse-crunch", work: 40, rest: 15, cue: "Curl the pelvis" },
        { label: "Plank", slug: "plank", work: 40, rest: 15, cue: "Glutes tight, ribs down" },
        { label: "Bicycle crunch", slug: "bicycle-crunch", work: 40, rest: 0, cue: "Slow — shoulder to knee" },
      ],
      45,
    ),
    references: [refs.spotReduction],
  },
];

export function getCardioWorkout(id: string) {
  return cardioWorkouts.find((w) => w.id === id);
}

export function totalSeconds(w: CardioWorkout) {
  return w.phases.reduce((t, p) => t + p.sec, 0);
}

export const heartRateZones = [
  { zone: 1, name: "Recovery", lo: 0.5, hi: 0.6, feel: "Very easy, can sing", use: "Warm-ups, active recovery" },
  {
    zone: 2,
    name: "Endurance",
    lo: 0.6,
    hi: 0.7,
    feel: "Easy, full sentences",
    use: "Aerobic base, fat oxidation, heart health",
  },
  { zone: 3, name: "Tempo", lo: 0.7, hi: 0.8, feel: "Moderate, short sentences", use: "Aerobic endurance" },
  { zone: 4, name: "Threshold", lo: 0.8, hi: 0.9, feel: "Hard, a few words", use: "4×4 intervals, race pace" },
  { zone: 5, name: "Max", lo: 0.9, hi: 1, feel: "All-out, can't talk", use: "Sprints, 10-20-30" },
];

export const cardioGuide: { id: string; title: string; blocks: Block[] }[] = [
  {
    id: "why",
    title: "Why lifters should do cardio",
    blocks: [
      {
        type: "list",
        items: [
          "Heart health and longevity — cardiorespiratory fitness is one of the strongest predictors of how long you live.",
          "Better recovery between sets and between workouts.",
          "More work capacity: you can handle more training volume.",
          "Helps fat loss by increasing calories burned (diet still does most of the work).",
        ],
      },
    ],
  },
  {
    id: "how-much",
    title: "How much cardio per week",
    blocks: [
      {
        type: "p",
        text: "The WHO recommends 150–300 minutes of moderate cardio per week, or 75–150 minutes of vigorous cardio (or a mix), plus strength training on 2 or more days.",
      },
      {
        type: "table",
        head: ["Goal", "Weekly cardio", "Example"],
        rows: [
          ["Health & general fitness", "150 min moderate", "3 × 30-min Zone 2 + daily walking"],
          ["Lifting focus (muscle/strength)", "60–150 min, mostly easy", "2 × Zone 2 bike + 1 core finisher"],
          ["Fat loss", "150–300 min + 8–10k steps/day", "3 × Zone 2 + 1 × intervals"],
          ["Improve VO₂max / endurance", "~80% easy, ~20% hard", "2 × Zone 2 + 1 × 4×4 intervals"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "The 80/20 rule",
        text: "Keep about 80% of your cardio easy (Zone 1–2) and about 20% hard. Too much hard cardio wrecks recovery for lifting.",
      },
    ],
  },
  {
    id: "combine",
    title: "Combining cardio with lifting",
    blocks: [
      {
        type: "p",
        text: "Cardio and lifting mix well when you're smart about it. Research on 'concurrent training' shows interference with muscle and strength gains is mostly linked to high volumes of running and long sessions — cycling interferes much less.",
      },
      {
        type: "list",
        items: [
          "Lift first, cardio after — or separate them by 6+ hours.",
          "Prefer low-impact cardio (bike, incline walk, rower, elliptical) on lifting weeks.",
          "Avoid hard intervals the day before a heavy leg day.",
          "Easy Zone 2 on rest days doubles as active recovery.",
          "Warm-up cardio (5 min) before lifting is always a good idea.",
        ],
      },
    ],
  },
];

export const cardioReferences: Reference[] = [
  refs.who,
  refs.hrmax,
  refs.concurrent,
  refs.fourByFour,
  refs.tenTwentyThirty,
  refs.fitnessMortality,
];

/** Trusted free follow-along video sources (external links — content stays with its owners). */
export const followAlongVideos = [
  {
    name: "NHS aerobic exercise videos",
    by: "NHS (UK)",
    text: "Short, beginner-friendly and low-impact cardio workouts you can do at home.",
    url: "https://www.nhs.uk/live-well/exercise/aerobic-exercises/",
    tag: "Beginner · Low impact",
  },
  {
    name: "Couch to 5K",
    by: "NHS Better Health",
    text: "The famous 9-week plan that takes you from the sofa to running 5 km, with a free app and podcasts.",
    url: "https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/",
    tag: "Running plan",
  },
  {
    name: "HASfit full-length workouts",
    by: "HASfit (YouTube)",
    text: "Hundreds of free follow-along cardio, HIIT and abs workouts for every level — no equipment needed.",
    url: "https://www.youtube.com/@HASfit/playlists",
    tag: "Home HIIT · Abs",
  },
  {
    name: "NHS strength exercise videos",
    by: "NHS (UK)",
    text: "Simple bodyweight strength routines — useful on travel days or for beginners.",
    url: "https://www.nhs.uk/live-well/exercise/strength-exercises/",
    tag: "Bodyweight",
  },
];
