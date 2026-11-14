"use client";

let ctx: AudioContext | null = null;

/** Call from a user gesture (tap) so mobile browsers allow sound later. */
export function primeAudio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    /* audio unsupported */
  }
}

export function beep() {
  try {
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.25, 0.5].forEach((offset, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = "sine";
      osc.frequency.value = i === 2 ? 1320 : 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.4, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });
  } catch {
    /* ignore */
  }
  try {
    navigator.vibrate?.([200, 100, 200, 100, 300]);
  } catch {
    /* ignore */
  }
}

/** Single short tone — used for countdown ticks and phase changes. */
export function tone(freq = 880, ms = 150, volume = 0.35) {
  try {
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + ms / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + ms / 1000 + 0.02);
  } catch {
    /* ignore */
  }
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}
