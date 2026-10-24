import { useReducedMotion } from "motion/react"

import { RESPECT_REDUCED_MOTION } from "@/lib/motion"

/** True when decorative motion should be skipped (only if the app opts in). */
export function useCalmMotion(): boolean {
  const reduce = useReducedMotion()
  return RESPECT_REDUCED_MOTION && !!reduce
}
