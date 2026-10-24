import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"

import { AquaBackdrop } from "@/components/atmosphere/AquaBackdrop"
import { CartProvider } from "@/components/cart/CartProvider"
import { OrderConfirmation } from "@/components/confirmation/OrderConfirmation"
import { AeroLoader } from "@/components/layout/AeroLoader"
import { MenuScreen } from "@/components/menu/MenuScreen"
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen"
import { useCart } from "@/hooks/useCart"
import { createOrderSnapshot } from "@/lib/cart"
import { RESPECT_REDUCED_MOTION, screenVariants } from "@/lib/motion"
import type { OrderSnapshot } from "@/types/menu"

type Screen = "welcome" | "menu" | "confirmation"

const ORDER: Record<Screen, number> = { welcome: 0, menu: 1, confirmation: 2 }

function loaderLabel(from: Screen, to: Screen): string {
  if (to === "confirmation") return "Placing your order"
  if (to === "welcome") return "Heading back"
  return from === "confirmation" ? "Back to the menu" : "Setting the table"
}

function Experience() {
  const { rawLines, itemCount, discountPercent, clear } = useCart()
  const [screen, setScreen] = useState<Screen>("welcome")
  // While set, the loader is showing on the way to this screen.
  const [loadingTo, setLoadingTo] = useState<Screen | null>(null)
  const [direction, setDirection] = useState(1)
  const [order, setOrder] = useState<OrderSnapshot | null>(null)
  // Focus moves to each new screen's heading, but not on the first page load.
  const [navigated, setNavigated] = useState(false)

  const go = useCallback(
    (next: Screen) => {
      if (loadingTo) return
      setNavigated(true)
      setDirection(ORDER[next] >= ORDER[screen] ? 1 : -1)
      setLoadingTo(next)
    },
    [screen, loadingTo]
  )

  const finishLoading = useCallback(() => {
    if (!loadingTo) return
    setScreen(loadingTo)
    setLoadingTo(null)
  }, [loadingTo])

  // Each screen (and the loader) starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen, loadingTo])

  const placeOrder = useCallback(() => {
    const snapshot = createOrderSnapshot(rawLines, discountPercent)
    if (!snapshot) return false
    setOrder(snapshot)
    go("confirmation")
    return true
  }, [rawLines, discountPercent, go])

  const handleConfirmationShown = useCallback(() => clear(), [clear])

  const view = loadingTo ? "loading" : screen
  const scene = view === "welcome" || loadingTo === "welcome" ? "meadow" : "aqua"

  return (
    <>
      <a
        href="#main"
        className="aero-chip sr-only rounded-full px-5 py-3 font-semibold text-deep focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
      >
        Skip to content
      </a>

      <AquaBackdrop scene={scene} />

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={view}
          custom={direction}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {loadingTo && (
            <AeroLoader label={loaderLabel(screen, loadingTo)} onDone={finishLoading} />
          )}
          {!loadingTo && screen === "welcome" && (
            <WelcomeScreen
              onOrder={() => go("menu")}
              savedCount={itemCount}
              focusOnMount={navigated}
            />
          )}
          {!loadingTo && screen === "menu" && (
            <MenuScreen
              onHome={() => go("welcome")}
              onPlaceOrder={placeOrder}
              focusOnMount={navigated}
            />
          )}
          {!loadingTo && screen === "confirmation" && order && (
            <OrderConfirmation
              order={order}
              onShown={handleConfirmationShown}
              onBackToMenu={() => go("menu")}
              onHome={() => go("welcome")}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.toggle("respect-reduced-motion", RESPECT_REDUCED_MOTION)
  }, [])

  return (
    <MotionConfig reducedMotion={RESPECT_REDUCED_MOTION ? "user" : "never"}>
      <CartProvider>
        <Experience />
      </CartProvider>
    </MotionConfig>
  )
}
