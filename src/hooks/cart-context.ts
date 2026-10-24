import { createContext } from "react"

import type { CartLine, CartLineDetail, MenuItemId } from "@/types/menu"

export interface CartContextValue {
  lines: CartLineDetail[]
  rawLines: CartLine[]
  itemCount: number
  subtotal: number
  total: number
  quantityOf: (id: MenuItemId) => number
  add: (id: MenuItemId) => void
  increment: (id: MenuItemId) => void
  decrement: (id: MenuItemId) => void
  remove: (id: MenuItemId) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
