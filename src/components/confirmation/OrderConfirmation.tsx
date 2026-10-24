import { useEffect, useMemo } from "react"
import { motion } from "motion/react"

import { Wordmark } from "@/components/brand/Brand"
import { DishName } from "@/components/menu/DishName"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCalmMotion } from "@/hooks/useCalmMotion"
import { useScreenFocus } from "@/hooks/useScreenFocus"
import { formatPrice, pluralItems } from "@/lib/format"
import { easeOut, riseIn, stagger } from "@/lib/motion"
import type { OrderSnapshot } from "@/types/menu"

interface OrderConfirmationProps {
  order: OrderSnapshot
  onShown: () => void
  onBackToMenu: () => void
  onHome: () => void
}

const timeFormat = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" })

export function OrderConfirmation({ order, onShown, onBackToMenu, onHome }: OrderConfirmationProps) {
  const headingRef = useScreenFocus<HTMLHeadingElement>(true)

  // The confirmation is now on screen with its own copy of the order,
  // so the cart can be emptied safely.
  useEffect(() => {
    onShown()
  }, [onShown])

  return (
    <main id="main" className="shell relative flex min-h-dvh flex-col items-center pt-[max(2rem,env(safe-area-inset-top))] pb-[max(4rem,env(safe-area-inset-bottom))] sm:pt-10">
      <div className="mb-8 sm:mb-10">
        <Wordmark />
      </div>

      <CelebrationOrb />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: stagger(0.12, 0.55) } }}
        className="mt-8 flex w-full max-w-3xl flex-col items-center text-center"
      >
        <motion.h1
          ref={headingRef}
          tabIndex={-1}
          variants={riseIn}
          className="font-heading text-[clamp(2.1rem,6.6vw,3.6rem)] leading-[1.02] font-extrabold tracking-[-0.015em] text-deep outline-none"
        >
          Thanks for ordering, Rishi is cooking right now!
        </motion.h1>
        <motion.p variants={riseIn} className="mt-4 text-[1.15rem] text-deep-soft sm:text-[1.25rem]">
          Your order is in. Something delicious is on its way.
        </motion.p>

        <motion.section
          variants={riseIn}
          aria-labelledby="receipt-title"
          className="aero-glass mt-9 w-full max-w-xl rounded-[2rem] p-6 text-left sm:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="receipt-title" className="font-heading text-2xl font-bold text-deep">
              Order {order.reference}
            </h2>
            <p className="text-[0.95rem] text-deep-soft">
              Placed at <time dateTime={order.placedAt}>{timeFormat.format(new Date(order.placedAt))}</time>
            </p>
          </div>

          <ul className="mt-5 space-y-3" aria-label="Items ordered">
            {order.lines.map((line) => (
              <li key={line.id} className="flex items-center gap-3.5">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-[0.9rem] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.7)]">
                  <img
                    src={line.item.image.src}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ objectPosition: line.item.image.focus }}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug text-deep">
                    <DishName name={line.item.name} />
                  </span>
                  <span className="tabular block text-[0.92rem] text-deep-soft">
                    {line.quantity} × {formatPrice(line.item.price)}
                  </span>
                </span>
                <span className="tabular font-heading text-lg font-bold text-deep">
                  {formatPrice(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <Separator className="aero-rule my-5" />

          {order.discountPercent > 0 && (
            <dl className="tabular mb-3 space-y-1.5 text-[1rem]">
              <div className="flex justify-between text-deep-soft">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-deep">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-leaf-ink">
                <dt className="font-semibold">Discount availed ({order.discountPercent}%)</dt>
                <dd className="font-bold">−{formatPrice(order.discountAmount)}</dd>
              </div>
            </dl>
          )}

          <div className="flex items-baseline justify-between">
            <p className="font-heading text-xl font-bold text-deep">
              Total <span className="font-sans text-base font-medium text-deep-soft">({pluralItems(order.itemCount)})</span>
            </p>
            <p className="tabular font-heading text-[2rem] leading-none font-extrabold text-deep">
              {formatPrice(order.total)}
            </p>
          </div>

        </motion.section>

        <motion.div variants={riseIn} className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="gel" size="pill" className="h-14 w-full px-8 text-[1.15rem] sm:w-auto" onClick={onBackToMenu}>
            Back to the menu
          </Button>
          <Button variant="glass" size="pill" className="h-14 w-full px-8 sm:w-auto" onClick={onHome}>
            Back to start
          </Button>
        </motion.div>
      </motion.div>
    </main>
  )
}

/** Glass orb + drawn check, two ripples and one restrained bubble burst. */
function CelebrationOrb() {
  const reduce = useCalmMotion()

  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2 + (i % 2 ? 0.18 : 0)
        const distance = 110 + (i % 3) * 34
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: i % 4 === 0 ? 16 : i % 3 === 0 ? 11 : 7,
          kind: i % 4 === 0 ? "bubble" : i % 2 === 0 ? "aqua" : "green",
          delay: 0.35 + (i % 5) * 0.03,
        }
      }),
    []
  )

  return (
    <div className="relative grid size-40 place-items-center sm:size-44" aria-hidden="true">
      {!reduce &&
        [0, 1].map((ring) => (
          <motion.span
            key={ring}
            className="absolute inset-0 rounded-full border-2 border-white/80"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.9], opacity: [0.85, 0] }}
            transition={{ duration: 1.6, ease: easeOut, delay: 0.35 + ring * 0.45, repeat: 1, repeatDelay: 1.2 }}
          />
        ))}

      {!reduce &&
        particles.map((p, i) => (
          <motion.span
            key={i}
            className={
              p.kind === "bubble"
                ? "bubble-orb absolute rounded-full"
                : p.kind === "aqua"
                  ? "absolute rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#75d8ff_45%,#087cc1)]"
                  : "absolute rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#8ff0bb_45%,#23a865)]"
            }
            style={{ width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{ x: p.x, y: p.y, scale: [0, 1, 0.8], opacity: [0, 1, 0] }}
            transition={{ duration: 1.3, ease: easeOut, delay: p.delay }}
          />
        ))}

      <motion.div
        className="float-slow bubble-orb relative grid size-full place-items-center rounded-full"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        style={{
          background:
            "radial-gradient(circle at 30% 24%, rgb(255 255 255 / 0.95) 0 7%, rgb(255 255 255 / 0.3) 15%, transparent 30%), radial-gradient(circle at 50% 50%, rgb(117 216 255 / 0.35) 30%, rgb(57 217 208 / 0.55) 70%, rgb(255 255 255 / 0.9) 100%)",
        }}
      >
        <svg viewBox="0 0 64 64" className="size-20 drop-shadow-[0_3px_4px_rgba(6,96,154,0.45)] sm:size-24">
          <defs>
            <linearGradient id="check-gel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2aa9ec" />
              <stop offset="1" stopColor="#06609a" />
            </linearGradient>
          </defs>
          <motion.path
            d="M16 33.5 27.5 45 49 21"
            fill="none"
            stroke="url(#check-gel)"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, ease: easeOut, delay: 0.45 }}
          />
        </svg>
      </motion.div>
    </div>
  )
}
