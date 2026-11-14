/** Short vibration feedback on phones that support it (Android). No-op elsewhere (e.g. iOS Safari). */
export function haptic(pattern: number | number[] = 12) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
  } catch {
    /* unsupported */
  }
}
