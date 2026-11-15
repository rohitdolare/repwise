import { refs, type Block, type Reference } from "./blocks";

export interface GuideSection {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Guide {
  title: string;
  tagline: string;
  sections: GuideSection[];
  references: Reference[];
}

export const movementPatterns: { name: string; cues: string[]; exercises: string[] }[] = [
  {
    name: "Squat",
    cues: ["Brace before you descend", "Knees track over toes", "Whole-foot pressure", "Chest and hips rise together"],
    exercises: ["back-squat", "goblet-squat", "leg-press", "bulgarian-split-squat"],
  },
  {
    name: "Hip hinge",
    cues: ["Hips go back, not down", "Neutral spine — long from head to tailbone", "Bar or weight stays close", "Finish with glutes, not lower back"],
    exercises: ["deadlift", "romanian-deadlift", "hip-thrust"],
  },
  {
    name: "Horizontal press",
    cues: ["Shoulder blades back and down", "Elbows 45–70° from torso", "Forearms vertical", "Feet planted"],
    exercises: ["barbell-bench-press", "dumbbell-bench-press", "incline-dumbbell-press", "push-up"],
  },
  {
    name: "Vertical press",
    cues: ["Glutes and abs tight", "Ribs down", "Press in a straight line", "Biceps by ears at lockout"],
    exercises: ["overhead-press", "seated-dumbbell-shoulder-press"],
  },
  {
    name: "Horizontal pull",
    cues: ["Move the shoulder blade first", "Elbows drive toward hips", "Torso stays still", "Control the stretch"],
    exercises: ["barbell-row", "one-arm-dumbbell-row", "seated-cable-row", "face-pull"],
  },
  {
    name: "Vertical pull",
    cues: ["Shoulders down, away from ears", "Elbows to back pockets", "Chest up to the bar", "Full stretch at the top"],
    exercises: ["pull-up", "lat-pulldown"],
  },
];

export const formGuide: Guide = {
  title: "Perfect Form Guide",
  tagline: "Universal technique rules that apply to every lift — learn them once, use them forever.",
  sections: [
    {
      id: "checklist",
      title: "The pre-set checklist",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Set up the equipment: bench height, safety arms, pin, seat position.",
            "Set your feet: stable base, weight spread through the whole foot.",
            "Set your grip: secure, wrists stacked over forearms.",
            "Breathe and brace: a deep belly breath, then tighten your abs 360°.",
            "Do the first rep slowly to feel the groove.",
          ],
        },
      ],
    },
    {
      id: "breathing",
      title: "Breathing & bracing",
      blocks: [
        { type: "p", text: "For heavy compound lifts, take a deep breath into your belly (not your chest), then tighten your core as if bracing for a punch. This pressure stabilises your spine. Hold it through the hardest part of the rep, then exhale at the top." },
        { type: "p", text: "For lighter or isolation work, simply exhale during the effort (lifting) and inhale during the return." },
        { type: "callout", tone: "warn", text: "If you have high blood pressure or a heart condition, avoid long breath-holds and speak to a doctor about heavy lifting." },
      ],
    },
    {
      id: "rom",
      title: "Range of motion",
      blocks: [
        { type: "p", text: "Use the fullest range you can control with good position. Training at long muscle lengths (the stretched part of the rep) appears particularly effective for growth. Partial reps with heavy weight build less muscle and teach bad habits." },
        { type: "list", items: ["Squat to at least parallel if your mobility allows.", "Touch the chest on presses.", "Fully straighten the arms on pulls and curls.", "Pause briefly in the stretch on isolation lifts."] },
      ],
    },
    {
      id: "tempo",
      title: "Tempo & control",
      blocks: [
        { type: "p", text: "Lower the weight under control (about 2–3 seconds) and lift it with intent. You don't need slow-motion reps. Just don't drop the weight or bounce." },
        {
          type: "table",
          head: ["Phase", "Speed", "Why"],
          rows: [
            ["Lowering (eccentric)", "2–3 s, controlled", "Keeps tension and protects joints"],
            ["Bottom", "Brief pause, no bounce", "Removes momentum"],
            ["Lifting (concentric)", "Fast but controlled", "Recruits more muscle fibres"],
          ],
        },
      ],
    },
    {
      id: "alignment",
      title: "Joint alignment",
      blocks: [
        { type: "list", items: ["Knees follow the direction of your toes.", "Wrists stay straight, stacked over elbows when pressing.", "Neck stays neutral — look slightly ahead, not up at the mirror.", "Spine stays neutral under load — not rounded, not over-arched."] },
      ],
    },
    {
      id: "stop",
      title: "When to end a set",
      blocks: [
        { type: "p", text: "End the set at technical failure — the first rep where your form clearly breaks down (hips shoot up, back rounds, bar path drifts), even if you could grind out another ugly rep." },
        { type: "callout", tone: "tip", text: "Film a set from the side every few weeks. Your phone is the best form coach you own." },
      ],
    },
  ],
  references: [refs.acsm],
};

export const recoveryGuide: Guide = {
  title: "Warm-up & Recovery",
  tagline: "A 10-minute warm-up that prepares you to lift well, and the habits that help you recover between sessions.",
  sections: [
    {
      id: "warm-up",
      title: "The RepWise 10-minute warm-up",
      blocks: [
        { type: "h", text: "1 · General warm-up (3–5 min)" },
        { type: "p", text: "Light cardio — bike, rower, brisk incline walk — until you feel warm and slightly out of breath." },
        { type: "h", text: "2 · Dynamic mobility (3–5 min)" },
        {
          type: "table",
          head: ["Movement", "Reps", "For"],
          rows: [
            ["Leg swings (front/back & side)", "10 / leg", "Hips"],
            ["Bodyweight squats", "10", "Hips, knees, ankles"],
            ["World's greatest stretch", "5 / side", "Hips, T-spine"],
            ["Cat–cow", "8", "Spine"],
            ["Arm circles", "10 each way", "Shoulders"],
            ["Band pull-aparts", "15", "Upper back, rear delts"],
            ["Glute bridge", "10", "Glutes"],
          ],
        },
        { type: "h", text: "3 · Ramp-up sets (specific warm-up)" },
        { type: "p", text: "For your first compound lift, build up to your working weight with gradually heavier, low-rep sets. Don't tire yourself out." },
        {
          type: "table",
          caption: "Example: working sets of 100 kg × 8",
          head: ["Set", "Load", "Reps"],
          rows: [
            ["1", "Empty bar (20 kg)", "10"],
            ["2", "50% — 50 kg", "6–8"],
            ["3", "70% — 70 kg", "3–4"],
            ["4", "85% — 85 kg", "1–2"],
            ["Work", "100 kg", "8"],
          ],
        },
        { type: "callout", tone: "tip", text: "Later exercises that train the same muscles need just 1–2 lighter sets — you're already warm." },
      ],
    },
    {
      id: "rest",
      title: "Rest between sets",
      blocks: [
        { type: "p", text: "Longer rest lets you lift more weight and do more reps in the next set, which usually means better results. Don't rush heavy compound lifts." },
        {
          type: "table",
          head: ["Exercise type", "Rest", "Examples"],
          rows: [
            ["Heavy compound (≤6 reps)", "3–4 min", "Squat, deadlift"],
            ["Moderate compound (6–12)", "2–3 min", "Bench, row, overhead press"],
            ["Machines / accessories", "90 s–2 min", "Leg press, pulldown"],
            ["Isolation", "60–90 s", "Curls, raises, calf raises"],
          ],
        },
        { type: "p", text: "Rule of thumb: start the next set when your breathing has settled and you feel you could match the last set's performance." },
      ],
    },
    {
      id: "cool-down",
      title: "Cool-down & mobility",
      blocks: [
        { type: "p", text: "A cool-down isn't required for recovery, but 5 minutes of easy walking and static stretching for tight areas can help you relax and improve mobility over time." },
        { type: "list", items: ["Hip flexor stretch — 30–45 s / side", "Hamstring stretch — 30–45 s / side", "Doorway chest stretch — 30–45 s", "Child's pose — 45–60 s"] },
      ],
    },
    {
      id: "sleep",
      title: "Sleep",
      blocks: [
        { type: "p", text: "Adults need at least 7 hours a night; athletes often benefit from 8–9. Poor sleep reduces strength, motivation and muscle-building." },
        { type: "list", items: ["Keep a consistent bed and wake time.", "Dark, cool, quiet bedroom.", "Avoid caffeine within 8 hours of bed.", "Dim screens 30–60 minutes before sleep."] },
      ],
    },
    {
      id: "habits",
      title: "Daily recovery habits",
      blocks: [
        {
          type: "list",
          items: [
            "Walk 7,000–10,000 steps a day — it helps blood flow and recovery.",
            "Eat enough protein (see Nutrition).",
            "Manage stress — it eats into your recovery budget.",
            "Plan a deload every 4–8 weeks, or when fatigue stacks up.",
            "Pain is not soreness: sharp or joint pain means stop and get it checked.",
          ],
        },
      ],
    },
  ],
  references: [refs.warmup, refs.sleep, refs.acsm, refs.deload],
};

export const nutritionGuide: Guide = {
  title: "Nutrition Basics",
  tagline: "The fundamentals that matter most for building muscle — without the noise.",
  sections: [
    {
      id: "hierarchy",
      title: "What matters most",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Total calories — decide whether you gain, lose, or maintain weight.",
            "Protein — the building block for muscle.",
            "Food quality — fruit, vegetables, whole grains, fibre.",
            "Meal timing & distribution — useful, but minor.",
            "Supplements — the last 1–5%.",
          ],
        },
      ],
    },
    {
      id: "calories",
      title: "Calories",
      blocks: [
        {
          type: "table",
          head: ["Goal", "Calories", "Target rate"],
          rows: [
            ["Build muscle (lean bulk)", "Maintenance + 5–10%", "+0.25–0.5% bodyweight / week"],
            ["Lose fat", "Maintenance − 10–25%", "−0.5–1% bodyweight / week"],
            ["Recomposition (beginners)", "Around maintenance", "Weight stable, strength rising"],
          ],
        },
        { type: "p", text: "Use the calculator above as a starting estimate, then weigh yourself 3–4 mornings a week. Adjust by 100–200 kcal if the weekly average isn't moving in the right direction after 2–3 weeks." },
      ],
    },
    {
      id: "protein",
      title: "Protein",
      blocks: [
        { type: "p", text: "Aim for 1.6–2.2 g of protein per kg of bodyweight per day. Research shows gains from extra protein plateau around 1.6 g/kg on average; going up to 2.2 g/kg covers individual differences. During a fat-loss phase, the higher end (or more) helps preserve muscle." },
        { type: "p", text: "Spread it across 3–5 meals of roughly 0.3–0.4 g/kg (often 25–40 g) each." },
        {
          type: "table",
          head: ["Food", "Serving", "Protein"],
          rows: [
            ["Chicken breast (cooked)", "100 g", "~31 g"],
            ["Eggs", "3 large", "~19 g"],
            ["Greek yogurt", "200 g", "~20 g"],
            ["Paneer", "100 g", "~18 g"],
            ["Lentils / dal (cooked)", "1 cup (200 g)", "~18 g"],
            ["Tofu (firm)", "150 g", "~22 g"],
            ["Whey protein", "1 scoop (30 g)", "~24 g"],
            ["Fish (e.g. tuna)", "100 g", "~25 g"],
          ],
        },
      ],
    },
    {
      id: "carbs-fats",
      title: "Carbs & fats",
      blocks: [
        { type: "list", items: ["Fat: at least ~0.6–0.8 g/kg/day for hormone health.", "Carbs: fill the rest of your calories. They fuel hard training.", "Fibre: 25–35 g/day from vegetables, fruit, legumes and whole grains."] },
      ],
    },
    {
      id: "timing",
      title: "Meal timing",
      blocks: [
        { type: "list", items: ["Eat a meal with protein and carbs 1–3 hours before training.", "Have a protein-rich meal within a few hours after training — there's no 30-minute 'window' panic.", "A protein-rich snack before bed (e.g. yogurt, milk, casein) is a simple way to hit your daily target."] },
      ],
    },
    {
      id: "hydration",
      title: "Hydration",
      blocks: [
        { type: "list", items: ["Drink regularly through the day; pale-yellow urine is a good sign.", "Have about 400–600 ml of water 2–3 hours before training.", "Sip during training, more when it's hot or you sweat a lot.", "Roughly 30–35 ml per kg of bodyweight per day is a reasonable baseline."] },
      ],
    },
    {
      id: "supplements",
      title: "Supplements worth knowing",
      blocks: [
        {
          type: "table",
          head: ["Supplement", "Evidence", "How to use"],
          rows: [
            ["Creatine monohydrate", "Strong", "3–5 g daily, any time. No loading needed."],
            ["Protein powder", "Strong (convenience)", "Use to hit your daily protein target."],
            ["Caffeine", "Strong", "~3 mg/kg 30–60 min pre-workout, if tolerated."],
            ["Vitamin D", "If deficient", "Get tested; supplement as advised."],
          ],
        },
        { type: "callout", tone: "warn", text: "This is general education, not medical advice. If you have a medical condition, are pregnant, or take medication, check with a doctor or registered dietitian." },
      ],
    },
  ],
  references: [refs.protein, refs.proteinMeta, refs.timing, refs.creatine],
};

export const coreGuide: Guide = {
  title: "Abs & Core Training",
  tagline: "How to build a strong core — and the honest truth about getting visible abs.",
  sections: [
    {
      id: "visible-abs",
      title: "Visible abs are made in the kitchen",
      blocks: [
        { type: "p", text: "Everyone already has abs. Whether you can see them depends mostly on body fat — typically around 10–15% for men and 18–22% for women. Ab exercises build the muscle, but they don't burn the fat covering it." },
        { type: "callout", tone: "warn", title: "Spot reduction is a myth", text: "In a controlled study, 6 weeks of daily ab exercises didn't reduce belly fat. Lose fat with a calorie deficit, daily steps and cardio; train abs to make them stronger and thicker." },
      ],
    },
    {
      id: "four-functions",
      title: "Train all four core functions",
      blocks: [
        { type: "p", text: "Your core doesn't just crunch — its main job is to resist unwanted movement and keep your spine stable while you lift, run and carry." },
        {
          type: "table",
          head: ["Function", "What it does", "Best exercises"],
          rows: [
            ["Anti-extension", "Stops your lower back from arching", "Plank, dead bug, ab wheel rollout"],
            ["Anti-lateral flexion", "Stops side bending", "Side plank, suitcase carries"],
            ["Anti-rotation", "Stops twisting", "Pallof press"],
            ["Flexion", "Curls the spine — builds the 'six-pack' muscle", "Cable crunch, reverse crunch, hanging knee raise"],
          ],
        },
      ],
    },
    {
      id: "programming",
      title: "Sets, reps and frequency",
      blocks: [
        {
          type: "list",
          items: [
            "Train core 2–3× per week — at the end of a session or on rest days.",
            "6–10 hard sets per week total is plenty.",
            "Treat abs like any muscle: use progressive overload (add reps, add weight to cable crunches, harder variations).",
            "Holds: 20–45 s of high-quality tension beats a sloppy 3-minute plank.",
            "Heavy squats and deadlifts already train your core hard — direct work fills the gaps.",
          ],
        },
      ],
    },
    {
      id: "progression",
      title: "Beginner → advanced progressions",
      blocks: [
        {
          type: "table",
          head: ["Function", "Beginner", "Intermediate", "Advanced"],
          rows: [
            ["Anti-extension", "Dead bug", "Plank → long-lever plank", "Ab wheel rollout from knees → standing"],
            ["Anti-lateral", "Side plank from knees", "Side plank", "Side plank with leg raise"],
            ["Anti-rotation", "Light Pallof press", "Pallof press with 3 s hold", "Tall-kneeling Pallof press"],
            ["Flexion", "Reverse crunch", "Cable crunch", "Hanging leg raise"],
          ],
        },
      ],
    },
  ],
  references: [refs.spotReduction, refs.acsm],
};

export const homeGuide: Guide = {
  title: "Home Workouts",
  tagline: "Build muscle and strength at home with zero equipment — just the floor, a chair, a table and a step.",
  sections: [
    {
      id: "does-it-work",
      title: "Does bodyweight training really build muscle?",
      blocks: [
        {
          type: "p",
          text: "Yes. Research comparing light and heavy loads shows that muscle growth is similar across a wide range of reps — roughly 6 to 30+ — as long as sets are taken close to failure. Your muscles respond to effort, not to where the resistance comes from.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "The one rule",
          text: "Finish most sets with only 0–2 reps left in the tank. 15 easy squats do little; 15 squats where the last 3 are a real struggle build muscle.",
        },
        {
          type: "p",
          text: "Where home training falls short is maximal strength on heavy lifts and very strong legs, which eventually need load. Until then — and for most people, for a long time — bodyweight is plenty.",
        },
      ],
    },
    {
      id: "progress",
      title: "How to progress without adding weight",
      blocks: [
        { type: "p", text: "At the gym you add plates. At home, make the same movement harder, in this order:" },
        {
          type: "list",
          ordered: true,
          items: [
            "Add reps — until you hit the top of the rep range on every set (RepWise tracks this for you).",
            "Slow down — 3 seconds on the way down makes any exercise much harder.",
            "Add pauses — hold 1–2 seconds at the hardest point (bottom of a squat or push-up).",
            "Increase range — deficit push-ups between two books, deeper split squats with the front foot on a step.",
            "Change leverage — move to the next variation in the ladder (below). Start each new variation at the bottom of the rep range.",
            "Go single-leg / single-arm — the biggest jump: twice the load on one limb.",
          ],
        },
        {
          type: "callout",
          text: "When you hit the top of the rep range on every set, RepWise suggests the next variation on the Today screen. Try it for your first set; switch for good once you can do the bottom of the range.",
        },
      ],
    },
    {
      id: "ladders",
      title: "Variation ladders",
      blocks: [
        {
          type: "p",
          text: "Each row goes from easier to harder. Find the step where you can do the plan's rep range with good form.",
        },
        {
          type: "table",
          head: ["Pattern", "Easier → harder"],
          rows: [
            ["Push (chest)", "Incline push-up → Push-up → Decline push-up → Pike push-up"],
            ["Triceps", "Chair dip (knees bent) → Chair dip (legs straight) → Diamond push-up"],
            ["Squat (legs)", "Bodyweight squat → Split squat → Reverse lunge → Bulgarian split squat"],
            ["Hinge (glutes, hamstrings)", "Glute bridge → Single-leg glute bridge → Single-leg RDL"],
            [
              "Pull (back)",
              "Superman → Table row (knees bent) → Table row (legs straight) → Pull-up (if you get a bar)",
            ],
            ["Core", "Dead bug → Plank → Side plank → Reverse crunch"],
          ],
        },
      ],
    },
    {
      id: "setup",
      title: "Set up a safe home space",
      blocks: [
        {
          type: "list",
          items: [
            "About 2 × 2 m of clear floor; a mat or carpet for floor work.",
            "A sturdy chair pushed against a wall — for dips, step-ups and Bulgarian split squats.",
            "A heavy, solid table for rows. Test it first: it must not tip or slide when you hang from the edge.",
            "A stair or step for calf raises.",
            "Shoes with grip, or bare feet — never socks on a smooth floor.",
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Furniture safety",
          text: "Never row under a folding, glass or light table, and never step onto a chair with wheels. If you are unsure your table is strong enough, do supermans for your back instead.",
        },
      ],
    },
    {
      id: "week",
      title: "Your home week",
      blocks: [
        {
          type: "list",
          items: [
            "Pick a home plan below (or on the Plan tab) and choose your own training days.",
            "Warm up for 5 minutes: march or jog in place, arm circles, slow squats and hip openers.",
            "On rest days, walk 30–45 minutes outdoors or do the Home Express Circuit.",
            "Eat enough protein (1.6–2.2 g per kg of bodyweight) and sleep 7–9 hours — same as at the gym.",
            "Back at the gym some weeks? Switch plans any time; your numbers are kept per exercise.",
          ],
        },
      ],
    },
  ],
  references: [refs.loads, refs.failure, refs.acsm],
};
