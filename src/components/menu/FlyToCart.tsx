import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import type { MenuItem } from "@/types/menu"

export interface Flight {
  key: number
  from: DOMRect
  to: DOMRect
  item: MenuItem
}

const SIZE = 76

/**
 * A little glass bubble carrying the dish photo arcs from the card to the
 * cart button, so it's clear where the item went.
 */
export function FlyToCart({ flights, onDone }: { flights: Flight[]; onDone: (key: number) => void }) {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {flights.map(({ key, from, to, item }) => {
          const x0 = from.left + from.width / 2 - SIZE / 2
          const y0 = from.top + from.height / 2 - SIZE / 2
          const x1 = to.left + to.width / 2 - SIZE / 2
          const y1 = to.top + to.height / 2 - SIZE / 2
          const peak = Math.min(y0, y1) - 90
          return (
            <motion.div
              key={key}
              className="absolute top-0 left-0 overflow-hidden rounded-full"
              style={{
                width: SIZE,
                height: SIZE,
                boxShadow:
                  "inset 0 0 0 2px rgb(255 255 255 / 0.85), 0 10px 24px -6px rgb(8 92 150 / 0.55)",
              }}
              initial={{ x: x0, y: y0, scale: 0.6, opacity: 0 }}
              animate={{
                x: [x0, (x0 + x1) / 2, x1],
                y: [y0, peak, y1],
                scale: [0.6, 1, 0.32],
                opacity: [0, 1, 0.9],
              }}
              transition={{ duration: 0.8, ease: [0.45, 0, 0.2, 1], times: [0, 0.45, 1] }}
              onAnimationComplete={() => onDone(key)}
            >
              <img
                src={item.image.src}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: item.image.focus }}
              />
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.85) 0 8%, transparent 30%), radial-gradient(circle at 50% 50%, transparent 55%, rgb(160 240 255 / 0.5) 100%)",
                }}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
