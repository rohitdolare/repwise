"use client";

import { useSyncExternalStore } from "react";

export interface TimerState {
  endsAt: number | null;
  duration: number;
  label: string;
}

let state: TimerState = { endsAt: null, duration: 0, label: "" };
const listeners = new Set<() => void>();
const SERVER_STATE: TimerState = state;

function set(next: TimerState) {
  state = next;
  listeners.forEach((l) => l());
}

export const timer = {
  start(seconds: number, label = "Rest") {
    set({ endsAt: Date.now() + seconds * 1000, duration: seconds, label });
  },
  add(seconds: number) {
    if (!state.endsAt) return;
    const endsAt = Math.max(Date.now() + 1000, state.endsAt + seconds * 1000);
    set({ ...state, endsAt, duration: Math.max(1, state.duration + seconds) });
  },
  stop() {
    set({ endsAt: null, duration: 0, label: "" });
  },
};

export function useTimer(): TimerState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => SERVER_STATE,
  );
}

export { formatRest, formatTime } from "./format";
