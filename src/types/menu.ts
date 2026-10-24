export type MenuItemId = "momos" | "tofu-bowl" | "cookie-dough"

export interface MenuImage {
  /** Default (smaller) source, also the fallback for browsers without srcset */
  src: string
  srcSet: string
  alt: string
  /** CSS object-position that keeps the food in frame for each crop */
  focus: string
}

export interface MenuItem {
  id: MenuItemId
  /** Position in the meal: 1 = starter, 2 = main, 3 = dessert */
  course: number
  category: string
  name: string
  description: string
  /** Price in whole Indian rupees */
  price: number
  image: MenuImage
}

export interface CartLine {
  id: MenuItemId
  quantity: number
}

export interface CartLineDetail extends CartLine {
  item: MenuItem
  lineTotal: number
}

export interface OrderSnapshot {
  reference: string
  placedAt: string
  lines: CartLineDetail[]
  itemCount: number
  subtotal: number
  /** 0–100 */
  discountPercent: number
  discountAmount: number
  total: number
}
