//
// PUBLIC_INTERFACE
// randomize utilities for shuffling arrays and seeding.
//
/**
 * PUBLIC_INTERFACE
 * shuffle returns a new array with elements shuffled using Fisher-Yates.
 */
export function shuffle(arr = []) {
  const a = Array.isArray(arr) ? [...arr] : [];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * PUBLIC_INTERFACE
 * seededShuffle deterministic shuffle of items using a numeric seed.
 */
export function seededShuffle(arr = [], seed = 1) {
  const a = Array.isArray(arr) ? [...arr] : [];
  let s = seed >>> 0;
  const rand = () => {
    // xorshift32
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
