import { createContext } from "react"

import type { CartLine, CartLineDetail, MenuItemId } from "@/types/menu"

export interface CartContextValue {
  lines: CartLineDetail[]
  rawLines: CartLine[]
  itemCount: number
  subtotal: number
  discountPercent: number
  discountAmount: number
  total: number
  quantityOf: (id: MenuItemId) => number
  add: (id: MenuItemId) => void
  increment: (id: MenuItemId) => void
  decrement: (id: MenuItemId) => void
  remove: (id: MenuItemId) => void
  /** Empties the cart and resets any discount (after an order is placed) */
  clear: () => void
  applyDiscount: (percent: number) => void
}

export const CartContext = createContext<CartContextValue | null>(null)
