import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { getMenuItem, MAX_QUANTITY } from "@/data/menu"
import {
  CART_STORAGE_KEY,
  cartReducer,
  describeCart,
  loadCart,
  loadDiscount,
  sanitizeLines,
  saveCart,
  saveDiscount,
  type CartAction,
} from "@/lib/cart"
import { pluralItems } from "@/lib/format"
import { CartContext, type CartContextValue } from "@/hooks/cart-context"
import type { CartLine, MenuItemId } from "@/types/menu"

type Announceable = Exclude<CartAction, { type: "hydrate" } | { type: "clear" }>

function describeChange(action: Announceable, lines: CartLine[]): string {
  const name = getMenuItem(action.id)?.name ?? "Dish"
  const quantity = lines.find((line) => line.id === action.id)?.quantity ?? 0
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = `${pluralItems(count)} in your order.`
  if (action.type === "remove" || quantity === 0) return `${name} removed. ${total}`
  if (action.type === "add" && quantity === 1) return `${name} added. ${total}`
  if (quantity >= MAX_QUANTITY && action.type !== "decrement")
    return `${name}: ${quantity}, the most Rishi can make today. ${total}`
  return `${name}: ${quantity}. ${total}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [rawLines, dispatch] = useReducer(cartReducer, undefined, loadCart)
  const [discountPercent, setDiscountPercent] = useState(loadDiscount)
  const [announcement, setAnnouncement] = useState("")
  const lastAction = useRef<Announceable | null>(null)
  const skipSave = useRef(false)

  // Persist every change locally.
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false
      return
    }
    saveCart(rawLines)
  }, [rawLines])

  useEffect(() => {
    saveDiscount(discountPercent)
  }, [discountPercent])

  // Keep two open tabs in agreement.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return
      let parsed: unknown = []
      try {
        parsed = event.newValue ? JSON.parse(event.newValue) : []
      } catch {
        parsed = []
      }
      skipSave.current = true
      dispatch({ type: "hydrate", lines: sanitizeLines(parsed) })
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // Announce the result of the latest change to assistive tech.
  useEffect(() => {
    const action = lastAction.current
    if (!action) return
    lastAction.current = null
    setAnnouncement(describeChange(action, rawLines))
  }, [rawLines])

  const run = useCallback((action: Announceable) => {
    lastAction.current = action
    dispatch(action)
  }, [])

  const add = useCallback((id: MenuItemId) => run({ type: "add", id }), [run])
  const increment = useCallback((id: MenuItemId) => run({ type: "increment", id }), [run])
  const decrement = useCallback((id: MenuItemId) => run({ type: "decrement", id }), [run])
  const remove = useCallback((id: MenuItemId) => run({ type: "remove", id }), [run])
  const clear = useCallback(() => {
    dispatch({ type: "clear" })
    setDiscountPercent(0)
  }, [])
  const applyDiscount = useCallback((percent: number) => {
    setDiscountPercent(Math.min(100, Math.max(0, percent)))
    setAnnouncement(`${percent}% discount applied.`)
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const summary = describeCart(rawLines, discountPercent)
    return {
      ...summary,
      rawLines,
      quantityOf: (id) => rawLines.find((line) => line.id === id)?.quantity ?? 0,
      add,
      increment,
      decrement,
      remove,
      clear,
      applyDiscount,
    }
  }, [rawLines, discountPercent, add, increment, decrement, remove, clear, applyDiscount])

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </CartContext.Provider>
  )
}
