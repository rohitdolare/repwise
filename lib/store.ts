"use client";

import { useSyncExternalStore } from "react";
import { defaultProgramId } from "@/content/programs";
import type { LoggedSet, Program, Session } from "./types";
import { betterSet, type BestSet } from "./progression";

/**
 * Tiny localStorage-backed store. Everything lives on the user's device —
 * no account, no backend. Works offline inside the installed PWA.
 */

const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = () => cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    /* storage blocked */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked */
  }
  emit();
}

function useStored<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  );
}

// ───────────────────────── Settings ─────────────────────────

export type Unit = "kg" | "lb";
export interface Settings {
  programId: string;
  unit: Unit;
  /** User-chosen weekly schedule per program (index 0 = Monday). Missing = plan default. */
  schedules?: Record<string, (string | null)[]>;
}

const SETTINGS_KEY = "repwise:settings";
const DEFAULT_SETTINGS: Settings = { programId: defaultProgramId, unit: "kg" };

export function useSettings(): Settings {
  const s = useStored<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  return s === DEFAULT_SETTINGS ? s : { ...DEFAULT_SETTINGS, ...s };
}

export function updateSettings(patch: Partial<Settings>) {
  write(SETTINGS_KEY, { ...read(SETTINGS_KEY, DEFAULT_SETTINGS), ...patch });
}

/** The user's weekly schedule for a program: their custom days, or the plan default. */
export function useSchedule(program: Program): (string | null)[] {
  const custom = useSettings().schedules?.[program.id];
  return isValidSchedule(custom, program) ? custom : program.schedule;
}

export function isCustomSchedule(settings: Settings, program: Program): boolean {
  return isValidSchedule(settings.schedules?.[program.id], program);
}

function isValidSchedule(s: unknown, program: Program): s is (string | null)[] {
  return (
    Array.isArray(s) &&
    s.length === 7 &&
    s.every((id) => id === null || program.workouts.some((w) => w.id === id))
  );
}

/** Save a custom weekly schedule for a program, or pass null to restore the plan default. */
export function setSchedule(programId: string, schedule: (string | null)[] | null) {
  const current = read(SETTINGS_KEY, DEFAULT_SETTINGS);
  const schedules = { ...current.schedules };
  if (schedule) schedules[programId] = schedule;
  else delete schedules[programId];
  write(SETTINGS_KEY, { ...current, schedules });
}

/** True once the user has explicitly picked a plan. */
export function useHasChosenPlan(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(SETTINGS_KEY) !== null;
      } catch {
        return false;
      }
    },
    () => false,
  );
}

// ───────────────────────── Workout logs ─────────────────────────
//
// We only keep what the coach needs: for each exercise, the PREVIOUS session
// (to match or beat) and TODAY's session while it's in progress. Older sessions
// are folded into a tiny archive (best set + counters) and then dropped.

export type Logs = Record<string, Session[]>;
const LOGS_KEY = "repwise:logs";
const EMPTY_LOGS: Logs = {};

export interface Archive {
  /** Unique dates that had at least one logged set. */
  dates: string[];
  /** Total sets in archived (dropped) sessions. */
  sets: number;
  /** Best set per exercise from archived sessions. */
  bests: Record<string, BestSet>;
}
const ARCHIVE_KEY = "repwise:archive";
const EMPTY_ARCHIVE: Archive = { dates: [], sets: 0, bests: {} };

export function useLogs(): Logs {
  return useStored<Logs>(LOGS_KEY, EMPTY_LOGS);
}

export function useArchive(): Archive {
  return useStored<Archive>(ARCHIVE_KEY, EMPTY_ARCHIVE);
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Keep today's session + the latest earlier one per exercise; fold the rest into
 * the archive. Returns null when nothing needed trimming.
 */
function trimLogs(logs: Logs, archive: Archive, today: string): { logs: Logs; archive: Archive } | null {
  let changed = false;
  const out: Logs = {};
  const dates = new Set(archive.dates);
  let sets = archive.sets;
  const bests = { ...archive.bests };

  for (const [slug, sessions] of Object.entries(logs)) {
    const sorted = [...sessions].filter((s) => s.sets.length).sort((a, b) => a.date.localeCompare(b.date));
    const current = sorted.filter((s) => s.date >= today);
    const earlier = sorted.filter((s) => s.date < today);
    const previous = earlier.slice(-1);
    const dropped = earlier.slice(0, -1);
    if (dropped.length || sorted.length !== sessions.length) changed = true;
    for (const d of dropped) {
      dates.add(d.date);
      sets += d.sets.length;
      for (const set of d.sets) bests[slug] = betterSet(bests[slug], { ...set, date: d.date });
    }
    const kept = [...previous, ...current];
    if (kept.length) out[slug] = kept;
  }

  if (!changed) return null;
  return { logs: out, archive: { dates: [...dates].sort(), sets, bests } };
}

function trimStored() {
  const result = trimLogs(read(LOGS_KEY, EMPTY_LOGS), read(ARCHIVE_KEY, EMPTY_ARCHIVE), todayKey());
  if (!result) return;
  try {
    window.localStorage.setItem(ARCHIVE_KEY, JSON.stringify(result.archive));
    window.localStorage.setItem(LOGS_KEY, JSON.stringify(result.logs));
  } catch {
    /* storage full or blocked */
  }
}

// One-time migration on load: shrink any long history into previous + archive.
if (typeof window !== "undefined") trimStored();

/** The latest session before today (what to match or beat). */
export function previousSession(sessions: Session[] | undefined, today: string | null): Session | undefined {
  if (!sessions) return undefined;
  const earlier = today ? sessions.filter((s) => s.date < today) : sessions;
  return earlier[earlier.length - 1];
}

/** Best set for an exercise: archive merged with sessions still in the logs. */
export function bestFor(slug: string, logs: Logs, archive: Archive): BestSet | null {
  let best: BestSet | undefined = archive.bests[slug];
  for (const s of logs[slug] ?? []) for (const set of s.sets) best = betterSet(best, { ...set, date: s.date });
  return best ?? null;
}

export function saveSet(slug: string, index: number, set: LoggedSet | null) {
  const logs = { ...read(LOGS_KEY, EMPTY_LOGS) };
  const date = todayKey();
  const sessions = [...(logs[slug] ?? [])];
  let i = sessions.findIndex((s) => s.date === date);
  if (i === -1) {
    if (!set) return;
    sessions.push({ date, sets: [] });
    sessions.sort((a, b) => a.date.localeCompare(b.date));
    i = sessions.findIndex((s) => s.date === date);
  }
  const sets = [...sessions[i].sets];
  if (set) {
    sets[index] = set;
  } else {
    sets.splice(index, 1);
  }
  // Remove holes left by out-of-order logging
  const compact = sets.filter(Boolean);
  if (compact.length === 0) sessions.splice(i, 1);
  else sessions[i] = { date, sets: compact };
  if (sessions.length === 0) delete logs[slug];
  else logs[slug] = sessions;
  try {
    window.localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch {
    /* storage full or blocked */
  }
  trimStored();
  emit();
}

export function clearExercise(slug: string) {
  const logs = { ...read(LOGS_KEY, EMPTY_LOGS) };
  delete logs[slug];
  write(LOGS_KEY, logs);
}

export function clearAll() {
  write(LOGS_KEY, {});
  write(ARCHIVE_KEY, EMPTY_ARCHIVE);
  write(CARDIO_KEY, []);
}

// ───────────────────────── Cardio log ─────────────────────────

export interface CardioEntry {
  date: string;
  workoutId: string | null;
  label: string;
  minutes: number;
}
const CARDIO_KEY = "repwise:cardio";
const EMPTY_CARDIO: CardioEntry[] = [];

export function useCardioLog(): CardioEntry[] {
  return useStored<CardioEntry[]>(CARDIO_KEY, EMPTY_CARDIO);
}

export function logCardio(entry: Omit<CardioEntry, "date">) {
  write(CARDIO_KEY, [...read(CARDIO_KEY, EMPTY_CARDIO), { ...entry, date: todayKey() }]);
}

export function removeCardio(index: number) {
  const list = [...read(CARDIO_KEY, EMPTY_CARDIO)];
  list.splice(index, 1);
  write(CARDIO_KEY, list);
}

/** Minutes logged in the last 7 days (including today). */
export function weeklyCardioMinutes(list: CardioEntry[], today: string | null) {
  if (!today) return 0;
  const t = Date.parse(today + "T00:00");
  return list
    .filter((e) => {
      const d = (t - Date.parse(e.date + "T00:00")) / 86_400_000;
      return d >= 0 && d < 7;
    })
    .reduce((n, e) => n + e.minutes, 0);
}

export function exportData(): string {
  return JSON.stringify(
    {
      version: 3,
      settings: read(SETTINGS_KEY, DEFAULT_SETTINGS),
      logs: read(LOGS_KEY, EMPTY_LOGS),
      archive: read(ARCHIVE_KEY, EMPTY_ARCHIVE),
      cardio: read(CARDIO_KEY, EMPTY_CARDIO),
    },
    null,
    2,
  );
}

export function importData(json: string) {
  const data = JSON.parse(json) as { settings?: Settings; logs?: Logs; archive?: Archive; cardio?: CardioEntry[] };
  if (!data || typeof data !== "object" || !data.logs) throw new Error("Not a RepWise backup file");
  write(ARCHIVE_KEY, data.archive && Array.isArray(data.archive.dates) ? data.archive : EMPTY_ARCHIVE);
  write(LOGS_KEY, data.logs);
  trimStored();
  emit();
  if (data.settings) write(SETTINGS_KEY, data.settings);
  if (Array.isArray(data.cardio)) write(CARDIO_KEY, data.cardio);
}

// ───────────────────────── Client-only values ─────────────────────────

const noopSubscribe = () => () => {};

/** Day of week (JS getDay) on the client; null during prerender. */
export function useWeekday(): number | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => new Date().getDay(),
    () => null,
  );
}

export function useTodayKey(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => todayKey(),
    () => null,
  );
}
