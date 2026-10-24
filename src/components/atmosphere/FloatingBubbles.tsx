import { useMemo, type CSSProperties } from "react"

/** Small deterministic PRNG so the bubble field is identical on every render. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Bubble {
  left: number
  size: number
  rise: number
  delay: number
  sway: number
  swayDur: number
  opacity: number
  blur: number
  restTop: number
}

function makeBubbles(count: number, seed: number): Bubble[] {
  const rand = mulberry32(seed)
  return Array.from({ length: count }, (_, i) => {
    // Three depth bands: far (small, soft), mid, near (large, crisp)
    const depth = i % 3
    const size =
      depth === 0 ? 8 + rand() * 16 : depth === 1 ? 22 + rand() * 30 : 48 + rand() * 60
    const rise = depth === 0 ? 30 + rand() * 14 : depth === 1 ? 22 + rand() * 10 : 16 + rand() * 8
    return {
      left: rand() * 100,
      size,
      rise,
      delay: -rand() * rise,
      sway: 8 + rand() * 26,
      swayDur: 4 + rand() * 5,
      opacity: depth === 0 ? 0.5 : depth === 1 ? 0.75 : 0.9,
      blur: depth === 0 ? 1.2 : 0,
      restTop: 8 + rand() * 84,
    }
  })
}

interface FloatingBubblesProps {
  count?: number
  seed?: number
  className?: string
}

export function FloatingBubbles({ count = 18, seed = 7, className }: FloatingBubblesProps) {
  const bubbles = useMemo(() => makeBubbles(count, seed), [count, seed])

  return (
    <div aria-hidden="true" className={className ?? "pointer-events-none absolute inset-0 overflow-hidden"}>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className={`bubble ${i >= 10 ? "max-sm:hidden" : ""}`}
          style={
            {
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              opacity: b.opacity,
              filter: b.blur ? `blur(${b.blur}px)` : undefined,
              "--rise": `${b.rise}s`,
              "--delay": `${b.delay}s`,
              "--sway": `${b.sway}px`,
              "--sway-dur": `${b.swayDur}s`,
              "--rest-top": `${b.restTop}%`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
