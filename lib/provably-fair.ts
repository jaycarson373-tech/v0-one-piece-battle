// Provably-fair selection + battle engine.
//
// Every battle is fully deterministic given a public `seed`. In production the
// seed is the Solana slot blockhash captured at the snapshot slot (committed
// on-chain BEFORE the battle), so no one — not even us — can influence the
// outcome after the seed is known. Anyone can re-run these pure functions with
// the published seed + holder list to verify the result. That's the code we
// push to GitHub / point Codex at.
//
// Algorithm: FNV-1a hash of the seed -> mulberry32 PRNG. Tiny, dependency-free,
// and identical across JS / Rust / Python ports.

export function fnv1a(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Deterministically pick `count` distinct indices from a pool of size `n`.
export function pickIndices(seed: string, n: number, count: number): number[] {
  const rng = mulberry32(fnv1a(seed))
  const pool = Array.from({ length: n }, (_, i) => i)
  const picked: number[] = []
  for (let k = 0; k < count && pool.length > 0; k++) {
    const idx = Math.floor(rng() * pool.length)
    picked.push(pool[idx])
    pool.splice(idx, 1)
  }
  return picked
}

// Roll a battle. Both fighters get a roll derived from the same seed; base
// power tilts the odds but never guarantees a win — upsets are possible, which
// is the whole point of a verifiable coin-flip-with-stats.
export function rollBattle(
  seed: string,
  aPower: number,
  bPower: number,
): { aScore: number; bScore: number; winner: "a" | "b" } {
  const rng = mulberry32(fnv1a(seed + ":battle"))
  // power contributes 60%, verifiable randomness 40%
  const aScore = Math.round(aPower * 0.6 + rng() * 100 * 0.4)
  const bScore = Math.round(bPower * 0.6 + rng() * 100 * 0.4)
  return { aScore, bScore, winner: aScore >= bScore ? "a" : "b" }
}

// A short, shareable proof string for a settled battle.
export function proofHash(seed: string): string {
  const h = fnv1a(seed).toString(16).padStart(8, "0")
  return `0x${h}${fnv1a(seed + h).toString(16).padStart(8, "0")}`
}
