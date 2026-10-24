import { MAX_QUANTITY, getMenuItem, isMenuItemId } from "@/data/menu"
import type { CartLine, CartLineDetail, MenuItemId, OrderSnapshot } from "@/types/menu"

export const CART_STORAGE_KEY = "rishis-kitchen:cart:v1"
export const DISCOUNT_STORAGE_KEY = "rishis-kitchen:discount:v1"

export type CartAction =
  | { type: "add"; id: MenuItemId }
  | { type: "increment"; id: MenuItemId }
  | { type: "decrement"; id: MenuItemId }
  | { type: "remove"; id: MenuItemId }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] }

const clampQuantity = (n: number) => Math.min(MAX_QUANTITY, Math.max(0, Math.trunc(n)))

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add":
    case "increment": {
      const existing = state.find((line) => line.id === action.id)
      if (!existing) return [...state, { id: action.id, quantity: 1 }]
      if (existing.quantity >= MAX_QUANTITY) return state
      return state.map((line) =>
        line.id === action.id ? { ...line, quantity: clampQuantity(line.quantity + 1) } : line
      )
    }
    case "decrement": {
      const existing = state.find((line) => line.id === action.id)
      if (!existing) return state
      if (existing.quantity <= 1) return state.filter((line) => line.id !== action.id)
      return state.map((line) =>
        line.id === action.id ? { ...line, quantity: line.quantity - 1 } : line
      )
    }
    case "remove":
      return state.filter((line) => line.id !== action.id)
    case "clear":
      return []
    case "hydrate":
      return action.lines
  }
}

/** Accept only well-formed lines for dishes that still exist on the menu. */
export function sanitizeLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return []
  const seen = new Set<MenuItemId>()
  const lines: CartLine[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue
    const { id, quantity } = entry as Record<string, unknown>
    if (!isMenuItemId(id) || seen.has(id)) continue
    if (typeof quantity !== "number" || !Number.isFinite(quantity)) continue
    const q = clampQuantity(quantity)
    if (q < 1) continue
    seen.add(id)
    lines.push({ id, quantity: q })
  }
  return lines
}

export function loadCart(): CartLine[] {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)
    return stored ? sanitizeLines(JSON.parse(stored)) : []
  } catch {
    return []
  }
}

export function saveCart(lines: CartLine[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
  } catch {
    // Storage can be full or blocked (private mode); the cart still works in memory.
  }
}

export function loadDiscount(): number {
  try {
    const value = Number(window.localStorage.getItem(DISCOUNT_STORAGE_KEY))
    return value === 100 ? 100 : 0
  } catch {
    return 0
  }
}

export function saveDiscount(percent: number) {
  try {
    if (percent > 0) window.localStorage.setItem(DISCOUNT_STORAGE_KEY, String(percent))
    else window.localStorage.removeItem(DISCOUNT_STORAGE_KEY)
  } catch {
    // Same as the cart: fine to keep it in memory only.
  }
}

/** Every price shown anywhere is derived here, from menu data × quantity. */
export function describeCart(lines: CartLine[], discountPercent = 0) {
  const details: CartLineDetail[] = []
  for (const line of lines) {
    const item = getMenuItem(line.id)
    if (!item) continue
    details.push({ ...line, item, lineTotal: item.price * line.quantity })
  }
  const itemCount = details.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = details.reduce((sum, line) => sum + line.lineTotal, 0)
  const percent = Math.min(100, Math.max(0, discountPercent))
  const discountAmount = Math.round((subtotal * percent) / 100)
  return {
    lines: details,
    itemCount,
    subtotal,
    discountPercent: percent,
    discountAmount,
    total: subtotal - discountAmount,
  }
}

export function createOrderSnapshot(lines: CartLine[], discountPercent = 0): OrderSnapshot | null {
  const summary = describeCart(lines, discountPercent)
  if (summary.itemCount === 0) return null
  const now = new Date()
  const reference = `RK-${String(now.getTime() % 10000).padStart(4, "0")}`
  return { reference, placedAt: now.toISOString(), ...summary }
}
