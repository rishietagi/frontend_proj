import { useEffect, useRef, type CSSProperties } from "react"
import { motion } from "motion/react"

import { DropletMark } from "@/components/brand/Brand"
import { easeOut } from "@/lib/motion"

interface AeroLoaderProps {
  label: string
  onDone: () => void
  /** Milliseconds the loader stays up */
  duration?: number
}

const WAVE =
  "M0 14 C 25 4, 50 4, 75 14 S 125 24, 150 14 S 200 4, 225 14 S 275 24, 300 14 V 200 H 0 Z"

/**
 * Between-page loader: a glass orb fills with water while a Vista-style
 * progress bar runs underneath.
 */
export function AeroLoader({ label, onDone, duration = 3400 }: AeroLoaderProps) {
  const total = duration
  const seconds = total / 1000
  const done = useRef(onDone)

  useEffect(() => {
    done.current = onDone
  }, [onDone])

  useEffect(() => {
    const id = window.setTimeout(() => done.current(), total)
    return () => window.clearTimeout(id)
  }, [total])

  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center"
      aria-busy="true"
    >
      <motion.div
        className="loader-orb relative size-44 overflow-hidden rounded-full sm:size-52"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        aria-hidden="true"
      >
        {/* Water rising from empty to nearly full */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-full"
          initial={{ y: "92%" }}
          animate={{ y: "14%" }}
          transition={{ duration: seconds, ease: [0.4, 0, 0.3, 1] }}
        >
          <svg className="wave-scroll absolute top-0 left-0 h-full w-[200%] [--wave-dur:3.2s]" viewBox="0 0 300 200" preserveAspectRatio="none">
            <path d={WAVE} fill="rgb(117 216 255 / 0.55)" transform="translate(0 -4)" />
          </svg>
          <svg className="wave-scroll absolute top-0 left-0 h-full w-[200%] [--wave-dur:2.1s]" viewBox="0 0 300 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="loader-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#39D9D0" />
                <stop offset=".5" stopColor="#0A8AD6" />
                <stop offset="1" stopColor="#065E9C" />
              </linearGradient>
            </defs>
            <path d={WAVE} fill="url(#loader-water)" />
          </svg>
          {[18, 36, 54, 70, 84].map((left, i) => (
            <span
              key={left}
              className="orb-bubble absolute bottom-2 rounded-full border border-white/70 bg-white/25"
              style={
                {
                  left: `${left}%`,
                  width: 6 + (i % 3) * 4,
                  height: 6 + (i % 3) * 4,
                  "--delay": `${i * 0.37}s`,
                  "--dur": `${1.8 + (i % 3) * 0.5}s`,
                } as CSSProperties
              }
            />
          ))}
        </motion.div>

        {/* Glass highlights over the water */}
        <span className="absolute top-[9%] left-[16%] h-[30%] w-[44%] -rotate-12 rounded-[50%] bg-[linear-gradient(180deg,rgb(255_255_255/0.9),rgb(255_255_255/0))]" />
        <span className="absolute right-[18%] bottom-[14%] size-3 rounded-full bg-white/70" />
        <DropletMark className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 opacity-90 drop-shadow-[0_4px_8px_rgba(6,96,154,0.4)]" />
      </motion.div>

      <motion.div
        className="flex w-full max-w-[22rem] flex-col items-center gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut, delay: 0.15 }}
      >
        <p className="font-heading text-[1.6rem] leading-tight font-bold text-deep" role="status">
          {label}
        </p>
        <div
          className="vista-track relative h-[1.15rem] w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-label={label}
        >
          <motion.div
            className="vista-fill absolute inset-y-0 left-0 overflow-hidden rounded-full"
            initial={{ width: "4%" }}
            animate={{ width: "100%" }}
            transition={{ duration: seconds, ease: [0.45, 0.05, 0.35, 1] }}
          >
            <span className="vista-pulse absolute inset-y-0 left-0 w-1/3" />
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
