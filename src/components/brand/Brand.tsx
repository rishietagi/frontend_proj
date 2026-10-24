import { useId } from "react"

import { cn } from "@/lib/utils"

/** A glossy water droplet — the kitchen's mark. */
export function DropletMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="30%" r="78%">
          <stop offset="0" stopColor="#F2FDFF" />
          <stop offset=".32" stopColor="#75D8FF" />
          <stop offset=".72" stopColor="#0A8AD6" />
          <stop offset="1" stopColor="#065E9C" />
        </radialGradient>
        <linearGradient id={`${id}-hi`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M32 3S9 28 9 41a23 23 0 0 0 46 0C55 28 32 3 32 3Z" fill={`url(#${id}-body)`} />
      <path
        d="M32 3S9 28 9 41a23 23 0 0 0 46 0C55 28 32 3 32 3Z"
        fill="none"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.5"
      />
      <ellipse cx="24" cy="33" rx="6.5" ry="11" fill={`url(#${id}-hi)`} transform="rotate(22 24 33)" />
      <circle cx="41" cy="51" r="3.2" fill="#fff" opacity=".75" />
    </svg>
  )
}

/** A glossy, translucent leaf with a bright midrib — the "greenery" of Aero. */
export function GlossLeaf({ className, tone = "fresh" }: { className?: string; tone?: "fresh" | "deep" }) {
  const id = useId()
  const [a, b, c] =
    tone === "fresh" ? ["#D4FFC4", "#65E6A0", "#1FA463"] : ["#B9F7C9", "#3CCB80", "#0F7F4C"]
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset=".5" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M60 214C14 170 2 108 18 60 30 24 52 6 60 2c8 4 30 22 42 58 16 48 4 110-42 154Z"
        fill={`url(#${id}-leaf)`}
        opacity=".92"
      />
      <path d="M60 210V14" stroke="#F4FFF8" strokeOpacity=".85" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M60 60 36 40M60 92 30 70M60 126 28 106M60 160 34 144M60 60l24-20M60 92l30-22M60 126l32-20M60 160l26-16"
        stroke="#EFFFF5"
        strokeOpacity=".45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M26 64C34 34 50 16 58 10c-6 22-14 52-30 80-4-8-4-18-2-26Z" fill={`url(#${id}-sheen)`} opacity=".7" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <DropletMark className="size-8 shrink-0 min-[360px]:size-9 drop-shadow-[0_3px_6px_rgba(8,92,150,0.35)]" />
      <span className="font-heading text-[1.15rem] leading-none font-bold tracking-tight whitespace-nowrap text-deep min-[360px]:text-[1.35rem]">
        Rishi&rsquo;s Kitchen
      </span>
    </span>
  )
}
