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
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="aero-glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-3 sm:pl-4">
        <button
          type="button"
          onClick={onHome}
          className="rounded-full py-1 pr-2 transition-transform duration-200 active:scale-[0.97]"
          aria-label="Rishi’s Kitchen — back to the welcome screen"
        >
          <Wordmark />
        </button>

        <button
          ref={cartRef}
          type="button"
          onClick={onOpenCart}
          aria-label={`Open cart, ${pluralItems(itemCount)}`}
          className="aero-ghost relative inline-flex h-12 items-center gap-2 rounded-full pr-5 pl-4 font-heading text-[1.05rem] font-bold"
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
