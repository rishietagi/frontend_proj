import { useState } from "react"
import { UtensilsCrossed } from "lucide-react"

import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types/menu"

interface DishImageProps {
  item: MenuItem
  sizes: string
  className?: string
  eager?: boolean
}

/** Food photo with a soft fade-in and a designed fallback if it can't load. */
export function DishImage({ item, sizes, className, eager }: DishImageProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  if (status === "error") {
    return (
      <div
        role="img"
        aria-label={item.image.alt}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center",
          className
        )}
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.9), transparent 45%), linear-gradient(160deg, #c9f1ff, #75d8ff 55%, #39d9d0)",
        }}
      >
        <span className="aero-chip grid size-16 place-items-center rounded-full text-ocean-ink">
          <UtensilsCrossed className="size-7" aria-hidden="true" />
        </span>
        <span className="font-heading text-lg font-bold text-deep">{item.name}</span>
        <span className="text-sm text-deep-soft">Photo unavailable</span>
      </div>
    )
  }

  return (
    <img
      src={item.image.src}
      srcSet={item.image.srcSet}
      sizes={sizes}
      alt={item.image.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setStatus("ready")}
      onError={() => setStatus("error")}
      style={{ objectPosition: item.image.focus }}
      className={cn(
        "h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        status === "ready" ? "opacity-100" : "opacity-0",
        className
      )}
    />
  )
}
