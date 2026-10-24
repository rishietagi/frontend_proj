import type { Transition, Variants } from "motion/react"

/** Shared motion tokens: one rhythm for the whole experience. */
export const spring = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const
export const springSnappy = { type: "spring", stiffness: 520, damping: 30 } as const
export const easeOut = [0.22, 1, 0.36, 1] as const
export const easeIn = [0.55, 0, 0.75, 0.2] as const

/**
 * Screen-to-screen transition. `custom` is the direction:
 * 1 = forward (rise up from below), -1 = back (settle down from above).
 */
export const screenVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, y: dir * 36, scale: 0.985 }),
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut, when: "beforeChildren" },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir * -24,
    scale: 0.985,
    transition: { duration: 0.32, ease: easeIn },
  }),
}

export const stagger = (each = 0.08, delay = 0): Transition => ({
  staggerChildren: each,
  delayChildren: delay,
})

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
}
