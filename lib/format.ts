export function formatTime(totalSec: number) {
  const s = Math.max(0, Math.ceil(totalSec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function formatRest(sec: number) {
  if (sec < 120) return `${sec} s`;
  const m = sec / 60;
  return Number.isInteger(m) ? `${m} min` : `${m.toFixed(1)} min`;
}
