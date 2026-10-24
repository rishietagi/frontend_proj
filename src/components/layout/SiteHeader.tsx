import { forwardRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ShoppingBag } from "lucide-react"

import { Wordmark } from "@/components/brand/Brand"
import { pluralItems } from "@/lib/format"
import { springSnappy } from "@/lib/motion"

interface SiteHeaderProps {
  itemCount: number
  onHome: () => void
  onOpenCart: () => void
}

export const SiteHeader = forwardRef<HTMLButtonElement, SiteHeaderProps>(function SiteHeader(
  { itemCount, onHome, onOpenCart },
  cartRef
) {
  return (
    // No bar: two floating glass pills pinned to the same edges as the content.
    <header className="pointer-events-none sticky top-0 z-40 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="shell flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onHome}
          className="aero-chip pointer-events-auto h-12 rounded-full pr-5 pl-2.5 backdrop-blur-md transition-transform duration-200 active:scale-[0.97]"
          aria-label="Rishi’s Kitchen — back to the welcome screen"
        >
          <Wordmark />
        </button>

        <button
          ref={cartRef}
          type="button"
          onClick={onOpenCart}
          aria-label={`Open cart, ${pluralItems(itemCount)}`}
          className="aero-ghost pointer-events-auto relative inline-flex h-12 items-center gap-2 rounded-full pr-4 pl-4 font-heading text-[1.05rem] font-bold backdrop-blur-md"
        >
          <ShoppingBag className="size-5 text-ocean-ink" aria-hidden="true" />
          <span className="max-sm:sr-only">Cart</span>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={itemCount}
              aria-hidden="true"
              initial={{ scale: 0.4, opacity: 0, y: -6 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={springSnappy}
              className={
                itemCount > 0
                  ? "aero-badge tabular -mr-1 grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-[0.95rem] leading-none font-bold"
                  : "tabular -mr-1 grid h-7 min-w-7 place-items-center rounded-full bg-deep/8 px-1.5 text-[0.95rem] leading-none text-deep-soft"
              }
            >
              {itemCount}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </header>
  )
})
