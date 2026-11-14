import { refs, type Block, type Reference } from "./blocks";

export interface Principle {
  slug: string;
  title: string;
  tagline: string;
  takeaways: string[];
  body: Block[];
  references: Reference[];
}

export const principles: Principle[] = [
  {
    slug: "progressive-overload",
    title: "Progressive Overload",
    tagline: "The one principle every program depends on: gradually ask your body to do a little more.",
    takeaways: [
      "Progress means more reps, more weight, or better reps — not more weight every session.",
      "Use double progression: work up to the top of a rep range, then add weight and start again at the bottom.",
      "Never trade technique for load. A heavier ugly rep isn't progress.",
      "Track your workouts. You can't progressively overload what you don't record.",
    ],
    body: [
      { type: "p", text: "Muscles and strength adapt to the demands you place on them. Once a weight becomes easy, it stops being a strong enough signal to drive further change. Progressive overload means steadily and gradually increasing the challenge over weeks and months." },
      { type: "h", text: "Ways to progress (in order of priority)" },
      {
        type: "list",
        ordered: true,
        items: [
          "Add reps with the same weight (e.g. 8 → 9 → 10).",
          "Add weight once you hit the top of your rep range.",
          "Add a set (only when recovery allows and progress has stalled).",
          "Improve the quality of reps: fuller range of motion, more control, less momentum.",
        ],
      },
      { type: "h", text: "Double progression — the RepWise method" },
      { type: "p", text: "Each exercise has a rep range, for example 3 sets of 8–12. Keep the same weight and add reps each session. When you complete every set at the top of the range (12, 12, 12) with good form and the target reps in reserve, increase the weight and drop back to the bottom of the range." },
      {
        type: "table",
        caption: "Example: bench press, 3 sets of 8–12 at 60 kg",
        head: ["Week", "Set 1", "Set 2", "Set 3", "Decision"],
        rows: [
          ["1", "8", "8", "8", "Same weight, add reps"],
          ["2", "10", "9", "8", "Same weight, add reps"],
          ["3", "10", "10", "10", "Same weight, add reps"],
          ["4", "12", "12", "12", "✅ Increase to 62.5 kg"],
          ["5", "9", "8", "8", "Build back up at 62.5 kg"],
        ],
      },
      { type: "h", text: "How much weight to add" },
      {
        type: "table",
        head: ["Exercise type", "Typical jump", "Example"],
        rows: [
          ["Lower-body compound", "2.5–5 kg (5–10 lb)", "Squat, deadlift, leg press, hip thrust"],
          ["Upper-body compound", "1–2.5 kg (2.5–5 lb)", "Bench press, row, overhead press"],
          ["Isolation", "Smallest available (0.5–2 kg)", "Curls, lateral raises, leg curls"],
          ["Bodyweight", "Add reps, then a harder variation or a weight belt", "Push-ups, pull-ups"],
        ],
      },
      { type: "p", text: "The ACSM recommends a 2–10% load increase when you can do one or two reps beyond your target. Smaller jumps are better: if the next dumbbell is a big jump, stay longer at the current weight and push the reps a bit past the range first." },
      { type: "h", text: "What progress is NOT" },
      {
        type: "list",
        items: [
          "Adding weight every workout. Beginners can for a while, but it doesn't last.",
          "Cutting depth, bouncing or swinging to move more weight.",
          "Training to failure every set. Failure is a tool, not a requirement.",
        ],
      },
      { type: "callout", tone: "tip", title: "Stalled for 3+ sessions?", text: "First check sleep, food and stress. Then try: a small weight drop (5–10%) and building back up, swapping to a similar exercise, or a deload week." },
    ],
    references: [refs.acsm, refs.loads, refs.failure],
  },
  {
    slug: "rir-rpe",
    title: "Intensity, RIR & RPE",
    tagline: "How hard should a set feel? Reps in Reserve gives you a simple, honest answer.",
    takeaways: [
      "RIR = how many more good reps you could have done at the end of the set.",
      "Most working sets should end 0–3 reps short of failure.",
      "Compound lifts: stay around 1–3 RIR. Isolation lifts: 0–2 RIR is fine.",
      "Your RIR estimates improve with practice — test yourself occasionally on safe exercises.",
    ],
    body: [
      { type: "p", text: "Intensity of effort is how close you take a set to muscular failure. Research shows that sets need to be reasonably close to failure to drive growth, while going all the way to failure adds fatigue with little extra benefit for most lifts." },
      {
        type: "table",
        caption: "The RIR-based RPE scale (Zourdos et al., 2016)",
        head: ["RPE", "RIR", "What it feels like"],
        rows: [
          ["10", "0", "Maximum effort — could not do another rep"],
          ["9", "1", "Could have done 1 more rep"],
          ["8", "2", "Could have done 2 more reps"],
          ["7", "3", "Could have done 3 more; bar speed still good"],
          ["5–6", "4–6", "Warm-up territory — too easy to count as a hard set"],
        ],
      },
      { type: "h", text: "Load vs. effort" },
      { type: "p", text: "Both heavy (around 6 reps) and light (20–30 reps) loads build similar amounts of muscle when sets are taken close to failure. Heavier loads build more maximal strength. That's why RepWise mixes ranges: lower reps for big compound lifts, higher reps for isolation work." },
      {
        type: "list",
        items: [
          "Strength focus: 3–6 reps, 1–3 RIR, longer rest.",
          "Muscle growth focus: 6–15 reps, 0–3 RIR.",
          "Isolation / small muscles: 10–20 reps, 0–2 RIR.",
        ],
      },
      { type: "callout", tone: "warn", title: "Where not to go to failure", text: "Avoid true failure on heavy squats, deadlifts and barbell bench (without a spotter or safeties). Technique breaks down before muscles do. Save failure for machines and isolation lifts." },
    ],
    references: [refs.rir, refs.failure, refs.loads],
  },
  {
    slug: "training-volume",
    title: "Training Volume",
    tagline: "How many hard sets per muscle per week you actually need.",
    takeaways: [
      "Count hard sets (0–4 RIR) per muscle per week.",
      "Around 10 or more weekly sets per muscle produces more growth than lower volumes.",
      "Start near 10 sets, and only add more when progress stalls and recovery is good.",
      "More volume is only better if you can recover from it.",
    ],
    body: [
      { type: "p", text: "Volume is the total amount of work you do. The most practical way to measure it is the number of hard sets per muscle group per week. Warm-up sets don't count." },
      { type: "p", text: "A widely cited meta-analysis found a graded dose-response: more weekly sets led to more muscle growth, with 10+ sets per muscle outperforming lower volumes. Newer research suggests some people can benefit from more, but returns diminish and fatigue climbs." },
      {
        type: "table",
        caption: "Practical weekly set targets per muscle group",
        head: ["Experience", "Weekly hard sets", "Notes"],
        rows: [
          ["Beginner (0–1 yr)", "6–10", "Almost everything works. Focus on technique."],
          ["Intermediate (1–3 yrs)", "10–16", "The sweet spot for most people."],
          ["Advanced (3+ yrs)", "12–20+", "Increase gradually; watch recovery."],
        ],
      },
      { type: "h", text: "Signs you're doing too much" },
      {
        type: "list",
        items: [
          "Performance drops for 2+ sessions in a row.",
          "Joint aches that linger.",
          "Poor sleep, low motivation, or soreness that lasts more than 72 hours.",
        ],
      },
    ],
    references: [refs.volume, refs.acsm],
  },
  {
    slug: "training-frequency",
    title: "Training Frequency",
    tagline: "How often to train each muscle for the best results.",
    takeaways: [
      "Train each muscle at least twice per week.",
      "Spreading volume over more sessions keeps each session's quality high.",
      "Choose the frequency you can stick to — consistency beats the 'perfect' split.",
    ],
    body: [
      { type: "p", text: "Frequency is how often you train a muscle each week. Meta-analyses show that training a muscle twice per week tends to outperform once per week. When total volume is equal, the exact frequency matters less than simply doing the work." },
      {
        type: "table",
        head: ["Days available", "Recommended split", "Frequency per muscle"],
        rows: [
          ["2–3 days", "Full Body", "2–3×"],
          ["4 days", "Upper / Lower", "2×"],
          ["5 days", "Push / Pull / Legs + Upper / Lower", "~2×"],
          ["6 days", "Push / Pull / Legs ×2", "2×"],
        ],
      },
      { type: "callout", tone: "tip", text: "Missed a day? Don't skip the workout — shift the week. Do the missed session next time, and the plan resumes from there." },
    ],
    references: [refs.frequency, refs.acsm],
  },
  {
    slug: "deload",
    title: "Deload Weeks",
    tagline: "A planned lighter week that clears fatigue so you can keep progressing.",
    takeaways: [
      "A deload is a short (usually 1-week) period of reduced training stress.",
      "Cut sets by about half and stay 3–4 reps from failure. Keep the movements the same.",
      "Use one every 4–8 weeks, or when performance and recovery markers drop.",
    ],
    body: [
      { type: "p", text: "Fatigue builds up over weeks of hard training and can hide your true fitness. A deload lowers training stress so that fatigue clears while your strength and muscle are maintained. Coaches commonly program one every 4–8 weeks, but listening to your body matters more than the calendar." },
      { type: "h", text: "How to deload" },
      {
        type: "list",
        items: [
          "Volume: reduce sets by 30–50% (3 sets → 2, 4 → 2).",
          "Effort: stop sets at 3–4 RIR. Nothing should feel like a grind.",
          "Load: keep it the same or reduce it by about 10%.",
          "Keep the same exercises to maintain skill.",
        ],
      },
      { type: "h", text: "When you might need one" },
      {
        type: "list",
        items: [
          "Strength drops on several lifts for 2+ weeks.",
          "Nagging joint pain or persistent soreness.",
          "Motivation is low and sleep is worse than normal.",
          "Before a test day, holiday, or after a very stressful period.",
        ],
      },
    ],
    references: [refs.deload],
  },
  {
    slug: "recovery",
    title: "Muscle Recovery",
    tagline: "You don't grow in the gym — you grow while recovering from it.",
    takeaways: [
      "Allow 48–72 hours before training the same muscle hard again.",
      "Sleep 7–9 hours. It's the most powerful recovery tool you have.",
      "Eat enough protein and total calories to support repair.",
      "Soreness isn't a reliable sign of a good workout.",
    ],
    body: [
      { type: "p", text: "Training creates the stimulus; recovery is when adaptation actually happens. Muscle protein synthesis stays elevated for roughly 24–48 hours after a session in trained lifters. That's one reason training each muscle about twice a week works well." },
      {
        type: "table",
        head: ["Recovery factor", "Target"],
        rows: [
          ["Sleep", "7–9 hours per night, consistent schedule"],
          ["Protein", "1.6–2.2 g per kg of bodyweight daily"],
          ["Same-muscle rest", "48–72 hours between hard sessions"],
          ["Daily movement", "Walks and light activity aid recovery"],
          ["Stress", "High life stress reduces how much training you can recover from"],
        ],
      },
      { type: "callout", tone: "tip", title: "DOMS", text: "Delayed-onset muscle soreness peaks 24–72 hours after a new or harder workout. It fades as you adapt. Light movement helps; it is not a signal that you must rest completely." },
    ],
    references: [refs.sleep, refs.protein, refs.acsm],
  },
];

export function getPrinciple(slug: string) {
  return principles.find((p) => p.slug === slug);
}
