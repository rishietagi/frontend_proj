import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Minus, Plus, Trash2 } from "lucide-react"

import { MAX_QUANTITY } from "@/data/menu"
import { cn } from "@/lib/utils"
import { springSnappy } from "@/lib/motion"

interface QuantityStepperProps {
  name: string
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  className?: string
  /** Move focus into the stepper when it first appears (e.g. replacing an Add button) */
  autoFocus?: boolean
}

const stepButton =
  "grid size-11 shrink-0 place-items-center rounded-full text-deep transition-[transform,background] duration-150 " +
  "hover:bg-white/80 active:scale-90 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"

/** A glass capsule: [–] quantity [+]. At one, minus becomes "remove". */
export function QuantityStepper({
  name,
  quantity,
  onIncrement,
  onDecrement,
  className,
  autoFocus = false,
}: QuantityStepperProps) {
  const atMax = quantity >= MAX_QUANTITY
  const removes = quantity <= 1
  const incrementRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (autoFocus) incrementRef.current?.focus({ preventScroll: true })
    // Only on mount: the stepper is replacing the control that had focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      role="group"
      aria-label={`Quantity of ${name}`}
      className={cn("aero-chip inline-flex items-center gap-0.5 rounded-full p-1", className)}
    >
      <button
        type="button"
        className={stepButton}
        onClick={onDecrement}
        aria-label={removes ? `Remove ${name} from cart` : `One fewer ${name}`}
      >
        {removes ? (
          <Trash2 className="size-[1.15rem] text-destructive" aria-hidden="true" />
        ) : (
          <Minus className="size-5" aria-hidden="true" />
        )}
      </button>

      <span className="relative grid h-11 w-9 place-items-center overflow-hidden" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={quantity}
            initial={{ y: 14, opacity: 0, scale: 0.7 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -14, opacity: 0, scale: 0.7 }}
            transition={springSnappy}
            className="tabular font-heading text-xl font-bold text-deep"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{`${quantity} in cart`}</span>

      <button
        ref={incrementRef}
        type="button"
        className={stepButton}
        onClick={onIncrement}
        disabled={atMax}
        aria-label={atMax ? `${name}: ${MAX_QUANTITY} is the most Rishi can make tonight` : `One more ${name}`}
        title={atMax ? `${MAX_QUANTITY} is the most Rishi can make tonight` : undefined}
      >
        <Plus className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}
