import type { CSSProperties } from "react"

export interface GlintSpec {
  top: string
  left: string
  size: number
  delay: number
  twinkle?: number
}

export function Sparkle({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 0c.6 5.6 2.2 8.6 4.4 10.1C18.3 11.4 20.6 11.8 24 12c-3.4.2-5.7.6-7.6 1.9C14.2 15.4 12.6 18.4 12 24c-.6-5.6-2.2-8.6-4.4-10.1C5.7 12.6 3.4 12.2 0 12c3.4-.2 5.7-.6 7.6-1.9C9.8 8.6 11.4 5.6 12 0Z"
        fill="white"
      />
      <circle cx="12" cy="12" r="2.2" fill="#E6FBFF" />
    </svg>
  )
}

/** Occasional small light glints; each twinkles briefly, then rests. */
export function Glints({ glints }: { glints: GlintSpec[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {glints.map((g, i) => (
        <span
          key={i}
          className="glint absolute drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
          style={
            {
              top: g.top,
              left: g.left,
              "--delay": `${g.delay}s`,
              "--twinkle": `${g.twinkle ?? 8}s`,
            } as CSSProperties
          }
        >
          <Sparkle size={g.size} />
        </span>
      ))}
    </div>
  )
}
