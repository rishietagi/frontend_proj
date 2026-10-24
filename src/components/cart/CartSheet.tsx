import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { BadgeCheck, Soup, TicketPercent } from "lucide-react"

import { WordleDialog } from "@/components/discount/WordleDialog"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCart } from "@/hooks/useCart"
import { formatPrice, pluralItems } from "@/lib/format"

import { CartItem } from "./CartItem"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Returns false if the order couldn't be placed (e.g. the cart emptied) */
  onPlaceOrder: () => boolean
}

export function CartSheet({ open, onOpenChange, onPlaceOrder }: CartSheetProps) {
  const {
    lines,
    itemCount,
    subtotal,
    discountPercent,
    discountAmount,
    total,
    increment,
    decrement,
    remove,
    applyDiscount,
  } = useCart()
  const [gameOpen, setGameOpen] = useState(false)
  const [placing, setPlacing] = useState(false)
  const placingRef = useRef(false)

  const empty = itemCount === 0
  const discounted = discountPercent > 0

  const handlePlaceOrder = () => {
    // Guard against double-clicks and repeated key presses.
    if (placingRef.current || empty) return
    placingRef.current = true
    setPlacing(true)
    if (!onPlaceOrder()) {
      placingRef.current = false
      setPlacing(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (placingRef.current) return // stay put while the order is being placed
        onOpenChange(next)
      }}
    >
      <SheetContent
        side="right"
        className="aero-glass w-full gap-0 border-0 bg-transparent p-0 data-[side=right]:w-full sm:rounded-l-[2.25rem] data-[side=right]:sm:max-w-[28rem]"
        style={{
          background:
            "radial-gradient(90% 40% at 0% 0%, rgb(255 255 255 / 0.85), transparent 70%), linear-gradient(180deg, rgb(244 253 255 / 0.94), rgb(214 245 255 / 0.9) 60%, rgb(196 244 236 / 0.9))",
        }}
      >
        <SheetHeader className="px-6 pt-[max(1.75rem,env(safe-area-inset-top))] pb-4 sm:px-7">
          <SheetTitle className="font-heading text-[2rem] leading-none font-extrabold tracking-tight text-deep">
            Your cart
          </SheetTitle>
          <SheetDescription className="mt-1.5 text-[1rem] text-deep-soft">
            {empty ? "Nothing here yet." : `${pluralItems(itemCount)} so far.`}
          </SheetDescription>
        </SheetHeader>

        <Separator className="aero-rule mx-6 w-auto sm:mx-7" />

        {empty ? (
          <EmptyCart />
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5">
              <ul className="flex flex-col gap-3" aria-label="Items in your cart">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <CartItem
                      key={line.id}
                      line={line}
                      onIncrement={() => increment(line.id)}
                      onDecrement={() => decrement(line.id)}
                      onRemove={() => remove(line.id)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <SheetFooter className="gap-0 border-t border-white/70 bg-white/45 px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pt-5 shadow-[0_-12px_30px_-20px_rgb(8_92_150/0.35)] sm:px-7">
              <dl className="tabular space-y-1.5 text-[1rem] sm:space-y-2">
                <div className="flex justify-between text-deep-soft">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-deep">{formatPrice(subtotal)}</dd>
                </div>
                <AnimatePresence initial={false}>
                  {discounted && (
                    <motion.div
                      key="discount"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                      className="flex justify-between overflow-hidden text-leaf-ink"
                    >
                      <dt className="font-semibold">Discount availed ({discountPercent}%)</dt>
                      <dd className="font-bold">−{formatPrice(discountAmount)}</dd>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Separator className="aero-rule my-3" />
                <div className="flex items-baseline justify-between">
                  <dt className="font-heading text-xl font-bold text-deep">Total</dt>
                  <dd className="font-heading text-[1.9rem] leading-none font-extrabold text-deep">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={total}
                        className="inline-block"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {formatPrice(total)}
                      </motion.span>
                    </AnimatePresence>
                  </dd>
                </div>
              </dl>

              {discounted ? (
                <p className="aero-chip mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl text-[0.98rem] font-bold text-leaf-ink">
                  <BadgeCheck className="size-5" aria-hidden="true" />
                  Bill&rsquo;s on the house today
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setGameOpen(true)}
                  className="aero-chip mt-4 flex h-12 w-full items-center justify-between gap-3 rounded-2xl pr-4 pl-3 text-left transition-transform active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="aero-gel aero-gel--green grid size-8 place-items-center rounded-full">
                      <TicketPercent className="size-[1.1rem]" aria-hidden="true" />
                    </span>
                    <span className="font-heading text-[1.05rem] font-bold text-deep">Avail discount</span>
                  </span>
                  <span className="text-[0.9rem] font-medium text-ocean-ink">Play a word game</span>
                </button>
              )}

              <Button
                variant="gel"
                size="pill"
                className="mt-3 h-14 w-full text-[1.2rem]"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                Place Order
              </Button>
              <SheetClose asChild>
                <Button variant="glass" size="pill" className="mt-2.5 w-full" disabled={placing}>
                  Keep browsing
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
        {/* Nested inside the sheet's content so Radix treats it as a child layer */}
        <WordleDialog open={gameOpen} onOpenChange={setGameOpen} onWin={() => applyDiscount(100)} />
      </SheetContent>
    </Sheet>
  )
}

function EmptyCart() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16 text-center">
      <div className="bubble-orb relative grid size-32 place-items-center rounded-full">
        <Soup className="size-12 text-ocean-ink" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <p className="mt-7 font-heading text-2xl font-bold text-deep">Your cart is empty</p>
      <p className="mt-2 max-w-[28ch] text-deep-soft">
        Add a dish from the menu and it will appear here.
      </p>
      <SheetClose asChild>
        <Button variant="gel-green" size="pill" className="mt-7">
          Browse the menu
        </Button>
      </SheetClose>
    </div>
  )
}
