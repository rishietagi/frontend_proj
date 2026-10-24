import { useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/useCart"
import { formatCourse, formatPrice } from "@/lib/format"
import { easeOut, spring, springSnappy } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types/menu"

import { DishImage } from "./DishImage"
import { DishName } from "./DishName"
import { QuantityStepper } from "./QuantityStepper"

interface MenuCardProps {
  item: MenuItem
  featured?: boolean
  onAdded?: (from: DOMRect, item: MenuItem) => void
}

export function MenuCard({ item, featured = false, onAdded }: MenuCardProps) {
  const { quantityOf, add, increment, decrement } = useCart()
  const quantity = quantityOf(item.id)
  const inCart = quantity > 0
  const titleId = useId()
  const figureRef = useRef<HTMLDivElement>(null)
  // Where focus should land when the Add button and stepper swap places.
  const [focusStepper, setFocusStepper] = useState(false)
  const focusAdd = useRef(false)

  const handleAdd = () => {
    setFocusStepper(true)
    add(item.id)
    const rect = figureRef.current?.getBoundingClientRect()
    if (rect) onAdded?.(rect, item)
  }

  return (
    <motion.article
      aria-labelledby={titleId}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: easeOut } },
      }}
      className={cn("relative", featured && "lg:z-10")}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={spring}
        className="h-full"
      >
        <Card
          data-in-cart={inCart}
          className={cn(
            "aero-glass h-full gap-0 overflow-visible bg-transparent p-2.5 text-base ring-0 sm:p-3",
            "rounded-[2rem] transition-shadow duration-500 md:flex-row lg:flex-col",
            "data-[in-cart=true]:shadow-[var(--glass-rim),0_0_0_3px_rgb(57_217_208/0.55),0_0_32px_4px_rgb(57_217_208/0.35),var(--shadow-lift)]",
            featured && "lg:rounded-[2.4rem] lg:p-3.5"
          )}
        >
          {/* Photo inside a glass bezel */}
          <div
            ref={figureRef}
            className={cn(
              "relative isolate overflow-hidden rounded-[1.55rem] bg-[linear-gradient(160deg,#d8f5ff,#9fe3fb)]",
              "aspect-[4/3] md:aspect-auto md:min-h-[19rem] md:w-[46%] md:shrink-0 lg:w-full",
              featured ? "lg:aspect-[1/1.02]" : "lg:aspect-[4/3.4]",
              featured && "lg:rounded-[1.9rem]"
            )}
          >
            <DishImage
              item={item}
              eager={item.course === 1}
              sizes="(min-width: 1024px) 34vw, (min-width: 768px) 42vw, 100vw"
              className="absolute inset-0"
            />
            {/* Glass bezel: rim light + a faint top reflection over the photo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                boxShadow:
                  "inset 0 0 0 1px rgb(255 255 255 / 0.55), inset 0 2px 0 rgb(255 255 255 / 0.6), inset 0 -30px 40px -30px rgb(16 59 89 / 0.35)",
                background: "linear-gradient(180deg, rgb(255 255 255 / 0.22), transparent 28%)",
              }}
            />

            {/* Course droplet — the menu is a sequence: starter, main, finale */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="aero-badge grid size-12 place-items-center rounded-full font-heading text-lg font-extrabold">
                <span className="sr-only">Course </span>
                {formatCourse(item.course)}
              </span>
            </div>

            <AnimatePresence>
              {inCart && (
                <motion.span
                  key="in-cart"
                  initial={{ opacity: 0, scale: 0.6, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={springSnappy}
                  className="aero-chip absolute top-3.5 right-3 inline-flex items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-2 text-sm font-bold text-deep"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-[linear-gradient(180deg,#8ff0bb,#34c47c)] text-deep shadow-[inset_0_1px_0_rgb(255_255_255/0.8)]">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  In your cart
                  <span className="tabular">×{quantity}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <CardContent className="flex flex-1 flex-col px-2.5 pt-5 pb-2.5 sm:px-3.5 md:px-6 md:py-6 lg:px-3.5 lg:pt-6 lg:pb-3">
            <p className="label-caps text-ocean-ink">{item.category}</p>
            <h2
              id={titleId}
              className={cn(
                "mt-2 font-heading font-bold tracking-[-0.01em] text-deep",
                featured ? "text-[1.85rem] lg:text-[2.15rem]" : "text-[1.65rem] lg:text-[1.75rem]",
                "leading-[1.1]"
              )}
            >
              <DishName name={item.name} />
            </h2>
            <p className="mt-3 max-w-[46ch] text-[1.02rem] leading-relaxed text-deep-soft">
              {item.description}
            </p>

            <div className="mt-auto flex min-h-[3.5rem] items-center justify-between gap-3 pt-6">
              <p className="tabular font-heading text-[1.75rem] leading-none font-bold text-deep">
                <span className="sr-only">Price: </span>
                {formatPrice(item.price)}
              </p>

              <AnimatePresence mode="popLayout" initial={false}>
                {inCart ? (
                  <motion.div
                    key="stepper"
                    initial={{ opacity: 0, scale: 0.85, x: 12 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={springSnappy}
                  >
                    <QuantityStepper
                      name={item.name}
                      quantity={quantity}
                      onIncrement={() => increment(item.id)}
                      onDecrement={() => {
                        if (quantity <= 1) {
                          focusAdd.current = true
                          setFocusStepper(false)
                        }
                        decrement(item.id)
                      }}
                      autoFocus={focusStepper}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={springSnappy}
                  >
                    <Button
                      ref={(node) => {
                        if (node && focusAdd.current) {
                          focusAdd.current = false
                          node.focus({ preventScroll: true })
                        }
                      }}
                      variant="gel-green"
                      size="pill"
                      onClick={handleAdd}
                      aria-describedby={titleId}
                    >
                      <Plus strokeWidth={2.75} aria-hidden="true" />
                      Add to cart
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.article>
  )
}
