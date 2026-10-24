import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"

import { AquaBackdrop } from "@/components/atmosphere/AquaBackdrop"
import { OrderConfirmation } from "@/components/confirmation/OrderConfirmation"
import { MenuScreen } from "@/components/menu/MenuScreen"
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen"
import { CartProvider } from "@/components/cart/CartProvider"
import { useCart } from "@/hooks/useCart"
import { createOrderSnapshot } from "@/lib/cart"
import { screenVariants } from "@/lib/motion"
import type { OrderSnapshot } from "@/types/menu"

type Screen = "welcome" | "menu" | "confirmation"

const ORDER: Record<Screen, number> = { welcome: 0, menu: 1, confirmation: 2 }

function Experience() {
  const { rawLines, itemCount, clear } = useCart()
  const [screen, setScreen] = useState<Screen>("welcome")
  const [direction, setDirection] = useState(1)
  const [order, setOrder] = useState<OrderSnapshot | null>(null)
  // Focus moves to each new screen's heading, but not on the first page load.
  const [navigated, setNavigated] = useState(false)

  const go = useCallback(
    (next: Screen) => {
      setNavigated(true)
      setDirection(ORDER[next] >= ORDER[screen] ? 1 : -1)
      setScreen(next)
    },
    [screen]
  )

  // Each screen starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen])

  const placeOrder = useCallback(() => {
    const snapshot = createOrderSnapshot(rawLines)
    if (!snapshot) return false
    setOrder(snapshot)
    go("confirmation")
    return true
  }, [rawLines, go])

  const handleConfirmationShown = useCallback(() => clear(), [clear])

  return (
    <>
      <a
        href="#main"
        className="aero-chip sr-only rounded-full px-5 py-3 font-semibold text-deep focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
      >
        Skip to content
      </a>

      <AquaBackdrop />

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={screen}
          custom={direction}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {screen === "welcome" && (
            <WelcomeScreen
              onOrder={() => go("menu")}
              savedCount={itemCount}
              focusOnMount={navigated}
            />
          )}
          {screen === "menu" && (
            <MenuScreen
              onHome={() => go("welcome")}
              onPlaceOrder={placeOrder}
              focusOnMount={navigated}
            />
          )}
          {screen === "confirmation" && order && (
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
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <Experience />
      </CartProvider>
    </MotionConfig>
  )
}
