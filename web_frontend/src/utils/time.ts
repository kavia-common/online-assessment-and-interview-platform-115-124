export function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

// PUBLIC_INTERFACE
export function formatMMSS(totalSeconds: number) {
  /** Formats seconds as mm:ss string */
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad(m)}:${pad(s)}`;
}
