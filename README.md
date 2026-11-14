# RepWise — Fitness Guide

> Don't just lift weights. Learn to train right.

A personal gym manual + workout coach. Installable as a phone app (PWA), works offline, no backend.

## User flow

1. **Pick a plan** (`/routine`) — 3-day Full Body, 4-day Upper/Lower, or 5-day Push/Pull/Legs + Upper/Lower.
2. **Open Today** (`/today`) — today's workout is chosen by weekday. Missed a day? Tap another day or pick a session on a rest day.
3. **Learn the lift** — every exercise links to a 10-part page (overview → alternatives).
4. **Log each set** — weight × reps. The rest timer starts automatically (beep + vibration).
5. **Progress** — RepWise applies double progression: add reps until every set hits the top of the range, then it tells you to add weight.

## Sections

| Route | What |
| --- | --- |
| `/` | Hero, today preview, how it works, overload explainer, six sections |
| `/today` | Workout coach with set logger, rest timer, wake lock |
| `/routine` | Weekly plans |
| `/exercises`, `/exercises/[slug]` | Exercise library (search + muscle filters), 10-section exercise pages |
| `/learn`, `/principles/[slug]` | Progressive overload (with planner), RIR/RPE, volume, frequency, deload, recovery |
| `/form-guide`, `/recovery`, `/nutrition` | Form, warm-up & recovery, nutrition (with calorie/protein calculator) |
| `/cardio`, `/cardio/[id]` | Cardio & conditioning: guided interval-timer sessions (Zone 2, Walk–Run, Norwegian 4×4, 10-20-30, sprints, HIIT), HR-zone calculator, weekly minutes, follow-along video links |
| `/core` | Abs & core guide + 10-minute core finisher |
| `/progress` | Lifting history, best sets, next targets, weekly cardio minutes, kg/lb, backup export/import |

## Tech

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide.
All content lives in `content/*.ts`. User data is stored in `localStorage` on the device (`lib/store.ts`).

- `lib/progression.ts` — double-progression engine
- `content/cardio.ts` + `components/interval-timer.tsx` — cardio sessions (phases) and the guided timer
- `public/sw.js` — service worker: precaches every page + its JS/CSS for offline use
- `app/manifest.ts` — web app manifest (install to home screen)

## Develop

```bash
npm run dev      # http://localhost:3000 (service worker disabled in dev)
npm run build && npm start   # test PWA/offline behaviour
```

## Install on your phone

Deploy (e.g. `npx vercel`) — PWAs need HTTPS. Then:
- **Android / Chrome:** open the site → "Install" button on Home/Learn, or menu ⋮ → *Install app*.
- **iPhone / Safari:** Share → *Add to Home Screen*.

After the first online visit, the app works fully offline.

## Adding content

- New exercise → add to `content/exercises.ts` (same 10-part shape); the page is generated automatically.
- New plan → add to `content/programs.ts`.
- When you change `public/sw.js` caching logic, bump `VERSION` in it.

## Visuals & credits

- **Exercise photos** (start/finish positions, shown as a looping demo): [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), public domain (Unlicense). Stored locally as WebP in `public/media/exercises/<slug>/{0,1}.webp` so they work offline. Mapping + muscle data: `content/visuals.ts`.
- **Technique videos**: one verified YouTube video per exercise (`content/videos.ts`), embedded with YouTube's official player (youtube-nocookie, click-to-play). Videos stay with their creators and need internet; the photos remain as the offline fallback. Run `npm run check:videos` to re-verify every video still exists and allows embedding.
- **Muscle maps**: [react-body-highlighter](https://github.com/GV79/react-body-highlighter) (MIT).

To add a photo for a new exercise, find it on the Free Exercise DB site, download `0.jpg`/`1.jpg`, convert to WebP (720px wide) into `public/media/exercises/<slug>/`, and add an entry in `content/visuals.ts`.
