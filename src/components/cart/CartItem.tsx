import { motion } from "motion/react"
import { X } from "lucide-react"

import { DishName } from "@/components/menu/DishName"
import { QuantityStepper } from "@/components/menu/QuantityStepper"
import { formatPrice } from "@/lib/format"
import { easeOut } from "@/lib/motion"
import type { CartLineDetail } from "@/types/menu"

interface CartItemProps {
  line: CartLineDetail
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

export function CartItem({ line, onIncrement, onDecrement, onRemove }: CartItemProps) {
  const { item, quantity, lineTotal } = line

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.22, ease: easeOut } }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="aero-chip relative grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 rounded-[1.4rem] p-3 sm:grid-cols-[5rem_1fr]"
    >
      <div className="relative row-span-2 aspect-square overflow-hidden rounded-[1.05rem] bg-sky/40 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.7)]">
        <img
          src={item.image.src}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition: item.image.focus }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit]"
          style={{ background: "linear-gradient(180deg, rgb(255 255 255 / 0.35), transparent 40%)" }}
        />
      </div>

      <div className="min-w-0 pr-9">
        <h3 className="font-heading text-[1.12rem] leading-tight font-bold text-deep">
          <DishName name={item.name} />
        </h3>
        <p className="tabular mt-0.5 text-[0.95rem] text-deep-soft">
          {formatPrice(item.price)} each
        </p>
      </div>

      <div className="col-start-2 flex items-center justify-between gap-2">
        <QuantityStepper
          name={item.name}
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          className="bg-white/70"
        />
        <p className="tabular font-heading text-[1.2rem] font-bold text-deep">
          <span className="sr-only">Line total: </span>
          {formatPrice(lineTotal)}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.name} from cart`}
        className="absolute top-1.5 right-1.5 grid size-11 place-items-center rounded-full text-deep-soft transition-colors hover:bg-white/80 hover:text-destructive"
      >
        <X className="size-[1.1rem]" aria-hidden="true" />
      </button>
    </motion.li>
  )
}
