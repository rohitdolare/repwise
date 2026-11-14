/**
 * One verified technique video per exercise, embedded with YouTube's official player.
 * Videos belong to their creators; IDs were verified via YouTube oEmbed (embeddable).
 * Re-check anytime with `npm run check:videos`.
 */
export interface ExerciseVideo {
  id: string;
  title: string;
  channel: string;
  /** Optional start time in seconds. */
  start?: number;
}

export const videos: Record<string, ExerciseVideo> = {
  "barbell-bench-press": { id: "4Y2ZdHCOXok", title: "How to PROPERLY Bench Press for Growth (5 Easy Steps)", channel: "Jeremy Ethier" },
  "dumbbell-bench-press": { id: "Y_7aHqXeCfQ", title: "How To: Dumbbell Bench Press | 3 GOLDEN RULES", channel: "ScottHermanFitness" },
  "incline-dumbbell-press": { id: "hChjZQhX1Ls", title: "How To: Dumbbell Incline Press | 3 GOLDEN RULES (MADE BETTER!)", channel: "ScottHermanFitness" },
  "push-up": { id: "GX87fbBd78A", title: "How To Perform PERFECT Push Ups (Everything You Need To Know)", channel: "E3 Rehab" },
  "cable-fly": { id: "mLgYNdxj-Vw", title: "STOP Doing Chest Flys Like This (5 Mistakes Slowing Your Chest Gains)", channel: "Jeremy Ethier" },
  "pull-up": { id: "eGo4IYlbE5g", title: "The Perfect Pull Up  - Do it right!", channel: "Calisthenicmovement" },
  "lat-pulldown": { id: "SALxEARiMkw", title: "How to do Lat Pulldowns (AVOID MISTAKES!)", channel: "ATHLEAN-X™" },
  "barbell-row": { id: "kBWAon7ItDw", title: "How To PROPERLY Barbell Row For A Bigger Back (Stop Making These Mistakes!)", channel: "Jeremy Ethier" },
  "one-arm-dumbbell-row": { id: "djKXLt7kv7Q", title: "How To Do Dumbbell Rows: Build a Thicker Back With Proper \"Cheating\"", channel: "Jeff Nippard" },
  "seated-cable-row": { id: "7o2oolbmzeI", title: "How To: Seated Cable Low-Row || PERFECT FORM", channel: "ScottHermanFitness" },
  "face-pull": { id: "rep-qVOkqgk", title: "How To: Face Pull", channel: "ScottHermanFitness" },
  "overhead-press": { id: "_RlRDWO2jfg", title: "Build Bigger Shoulders With Perfect Training Technique (The Overhead Press)", channel: "Jeff Nippard" },
  "seated-dumbbell-shoulder-press": { id: "GFblCmuEE18", title: "HOW TO: Dumbbell Shoulder Press (BIGGER SHOULDERS & BIGGER BENCH PRESS!) || PERFECT FORM", channel: "ScottHermanFitness" },
  "lateral-raise": { id: "3VcKaXpzqRo", title: "How To: Dumbbell Side Lateral Raise", channel: "ScottHermanFitness" },
  "back-squat": { id: "gcNh17Ckjgg", title: "How to PROPERLY Squat for Growth (4 Easy Steps)", channel: "Jeremy Ethier" },
  "goblet-squat": { id: "MeIiIdhvXT4", title: "How To: Goblet Squat", channel: "ScottHermanFitness" },
  "leg-press": { id: "W1SD96lrudY", title: "Jay Cutler's Training Tips: How To Do A Leg Press Correctly", channel: "Muscle & Strength" },
  "romanian-deadlift": { id: "_oyxCn2iSjU", title: "HOW TO DO ROMANIAN DEADLIFTS (RDLs): Build Beefy Hamstrings With Perfect Technique", channel: "Jeff Nippard" },
  "bulgarian-split-squat": { id: "hPlKPjohFS0", title: "The PERFECT Bulgarian Split Squat (Avoid These Errors!)", channel: "Squat University" },
  "leg-curl": { id: "ELOCsoDSmrg", title: "How To: Seated Leg Curl (Cybex)", channel: "ScottHermanFitness" },
  "hip-thrust": { id: "LM8XHLYJoYs", title: "Proper Hip Thrust Form", channel: "Bret Contreras Glute Guy" },
  "calf-raise": { id: "Xa18jxyeSnM", title: "8 Calf Raise Mistakes and How to Fix Them", channel: "Renaissance Periodization" },
  "deadlift": { id: "VL5Ab0T07e4", title: "Build A Bigger Deadlift With Perfect Technique (Conventional Form)", channel: "Jeff Nippard" },
  "barbell-curl": { id: "QZEqB6wUPxQ", title: "How To: Barbell Bicep Curl | 3 GOLDEN RULES", channel: "ScottHermanFitness" },
  "hammer-curl": { id: "8XLxfXROrTo", title: "HOW TO: Dumbbell Hammer Curl (BICEPS PEAK BUILDER!) || PERFECT FORM", channel: "ScottHermanFitness" },
  "triceps-pushdown": { id: "_w-HpW70nSQ", title: "HOW TO: Cable Triceps Pushdown || 3 Golden Rules (FOR GROWTH)", channel: "ScottHermanFitness" },
  "overhead-triceps-extension": { id: "IaJWPqP-Bjo", title: "Overhead Tricep Extension For Maximum Growth | Targeting The Muscle", channel: "Renaissance Periodization" },
  "plank": { id: "A2b2EmIg0dA", title: "How To Plank (Proper Form | Cues | Progressions)", channel: "E3 Rehab" },
  "hanging-knee-raise": { id: "X-ACS9vpRyU", title: "How To: Hanging Knee / Leg Raise | BUILD A “SCIENCED BASED” 6-PACK!", channel: "ScottHermanFitness" },
  "cable-crunch": { id: "QR3vANGukK8", title: "Cable Crunches: The CORRECT Way To Do Them (Most People Are Wrong)", channel: "Leo Fanner" },
  "ab-wheel-rollout": { id: "rqiTPdK1c_I", title: "Ab Wheel- How to PROPERLY Use an Ab Wheel | MIND PUMP", channel: "Mind Pump TV" },
  "dead-bug": { id: "JrcoGEZn6L4", title: "Dead Bug Exercise For Beginners | Positioning, Progressions, and Common Mistakes", channel: "Dr. Carl Baird" },
  "side-plank": { id: "qbuqsJ9CuQA", title: "How to do a Side Plank: A Guide from Physical Therapists", channel: "Hinge Health" },
  "pallof-press": { id: "5_8d8vHgZvU", title: "Pallof Press - How To Do Pallof Presses + Variations", channel: "Girls Gone Strong | Women's Health & Fitness" },
  "reverse-crunch": { id: "fhrkw1aaP8k", title: "Lower Ab Exercise Mistakes (REVERSE CRUNCH!)", channel: "ATHLEAN-X™" },
  "bicycle-crunch": { id: "HWX93vAoLvw", title: "How to Do Bicycle Crunches: A Guide from Physical Therapists", channel: "Hinge Health" },
  "incline-walk": { id: "NAsObfFJXvE", title: "How To: Incline Treadmill Walk (12-3-30 Workout)", channel: "Live Lean TV Daily Exercises" },
  "treadmill-run": { id: "hMH1QYE8F7Q", title: "Head To Toe Beginner Running Technique", channel: "The Run Experience" },
  "stationary-bike": { id: "csNeUKYBW0E", title: "How to Set up your Spinning® Bike | Quick, Easy & Proper Indoor Cycling Bike Setup & Basic Bike Fit", channel: "Studio SWEAT" },
  "rowing-machine": { id: "4zWu1yuJ0_g", title: "Correct Rowing Machine Technique, Improve Your Rowing  | Concept2", channel: "concept2usa" },
  "elliptical": { id: "EesEvYohy5o", title: "You're Using the Elliptical WRONG | Physical Therapist Explains", channel: "Rehab and Revive" },
  "stair-climber": { id: "Z_4djaNyKEE", title: "How To Set-Up & Use a Stairmaster", channel: "Flex Marks " },
  "jump-rope": { id: "IFgQfVQT_68", title: "How To Jump Rope Beginner Basics: STARTING YOUR ROPE", channel: "Kyle Easter" },
  "mountain-climber": { id: "ixxk9Qfn61o", title: "How To Perform Mountain Climbers - Exercise Tutorial", channel: "Buff Dudes" },
  "kettlebell-swing": { id: "LBhaLLc153A", title: "The Kettlebell Swing Technique Everyone Gets WRONG!", channel: "Squat University" },
  "jump-squat": { id: "lCxMeAhj8A0", title: "ACL Injury Prevention: Jumping and Landing Technique", channel: "Hospital for Special Surgery" },
  "battle-ropes": { id: "pQb2xIGioyQ", title: "Battle Ropes for Beginners (Use Battling Ropes like a Pro!)", channel: "Criticalbench" },
};
