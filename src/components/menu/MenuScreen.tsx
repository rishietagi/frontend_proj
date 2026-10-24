import { useCallback, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { ShoppingBag } from "lucide-react"

import { CartSheet } from "@/components/cart/CartSheet"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { Button } from "@/components/ui/button"
import { MENU } from "@/data/menu"
import { useCart } from "@/hooks/useCart"
import { useScreenFocus } from "@/hooks/useScreenFocus"
import { formatPrice, pluralItems } from "@/lib/format"
import { easeOut, riseIn, spring, stagger } from "@/lib/motion"
import type { MenuItem } from "@/types/menu"

import { FlyToCart, type Flight } from "./FlyToCart"
import { MenuCard } from "./MenuCard"

interface MenuScreenProps {
  onHome: () => void
  onPlaceOrder: () => boolean
  focusOnMount: boolean
}

export function MenuScreen({ onHome, onPlaceOrder, focusOnMount }: MenuScreenProps) {
  const { itemCount, total } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [flights, setFlights] = useState<Flight[]>([])
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  const flightKey = useRef(0)
  const headingRef = useScreenFocus<HTMLHeadingElement>(focusOnMount)

  const launch = useCallback((from: DOMRect, item: MenuItem) => {
    const to = cartButtonRef.current?.getBoundingClientRect()
    if (!to) return
    flightKey.current += 1
    setFlights((current) => [...current, { key: flightKey.current, from, to, item }])
  }, [])

  const land = useCallback((key: number) => {
    setFlights((current) => current.filter((flight) => flight.key !== key))
  }, [])

  return (
    <>
      <SiteHeader
        ref={cartButtonRef}
        itemCount={itemCount}
        onHome={onHome}
        onOpenCart={() => setCartOpen(true)}
      />

      <main id="main" className="relative mx-auto max-w-6xl px-4 pt-10 pb-36 sm:px-6 sm:pt-14 lg:pt-16">
        <motion.header
          initial="hidden"
          animate="show"
          variants={{ show: { transition: stagger(0.1, 0.1) } }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h1
            ref={headingRef}
            tabIndex={-1}
            variants={riseIn}
            className="font-heading text-[clamp(2.6rem,8vw,4.6rem)] leading-[0.98] font-extrabold tracking-[-0.02em] text-deep outline-none"
          >
            Tonight&rsquo;s Menu
          </motion.h1>
          <motion.p
            variants={riseIn}
            className="mt-4 text-[1.15rem] text-deep-soft sm:text-[1.28rem]"
          >
            Picked with love. Prepared by Rishi. Approved by you.
          </motion.p>
          <motion.p variants={riseIn} className="mt-3 text-[0.95rem] font-medium text-ocean-ink">
            Three courses, served in order, from a kitchen just down the hall.
          </motion.p>
        </motion.header>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: stagger(0.12, 0.3) } }}
          className="mt-12 grid gap-6 sm:mt-14 md:gap-7 lg:mt-14 lg:grid-cols-[1fr_1.22fr_1fr] lg:items-end lg:gap-6 xl:gap-8"
        >
          {MENU.map((item) => (
            <MenuCard key={item.id} item={item} featured={item.course === 2} onAdded={launch} />
          ))}
        </motion.div>

        <PhotoCredits />
      </main>

      {/* Floating cart bar — appears once something is in the cart.
          Portaled so screen transitions (transforms) can't shift it. */}
      {createPortal(
      <AnimatePresence>
        {itemCount > 0 && !cartOpen && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0, transition: { duration: 0.25, ease: easeOut } }}
            transition={spring}
            className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.9rem,env(safe-area-inset-bottom))] sm:pb-6"
          >
            <div className="aero-glass flex w-full max-w-xl items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5 sm:pl-6">
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="tabular font-heading text-[1.35rem] leading-none font-extrabold text-deep">
                  {formatPrice(total)}
                </span>
                <span className="truncate text-[0.98rem] font-medium text-deep-soft">
                  {pluralItems(itemCount)}
                </span>
              </div>
              <Button variant="gel" size="pill" className="h-12 px-5 sm:px-7" onClick={() => setCartOpen(true)}>
                <ShoppingBag aria-hidden="true" />
                View cart
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
        document.body
      )}

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        onPlaceOrder={() => {
          const placed = onPlaceOrder()
          if (placed) setCartOpen(false)
          return placed
        }}
      />
      {createPortal(<FlyToCart flights={flights} onDone={land} />, document.body)}
    </>
  )
}

function PhotoCredits() {
  const credited = MENU.flatMap((item) => (item.image.credit ? [{ id: item.id, ...item.image.credit }] : []))
  return (
    <footer className="mt-16 text-center text-[0.85rem] text-deep-soft">
      <p>
        Photos:{" "}
        {credited.map((credit, i) => (
          <span key={credit.id}>
            <a
              href={credit.photoUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ocean/40 underline-offset-2 hover:text-ocean-ink"
            >
              {credit.photographer}
            </a>{" "}
            on {credit.source}
            {i < credited.length - 1 ? ", " : "."}
          </span>
        ))}{" "}
        Prices are placeholders for a home-cooked dinner.
      </p>
    </footer>
  )
}
