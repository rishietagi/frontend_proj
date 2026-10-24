import type { MenuItem, MenuItemId } from "@/types/menu"

/**
 * The single source of truth for tonight's menu.
 * Prices are placeholders in whole rupees — change them here and every
 * card, cart line and total updates with them.
 */
export const MENU: readonly MenuItem[] = [
  {
    id: "momos",
    course: 1,
    category: "To share",
    name: "Veg Crispy Pan-Fried Momos",
    description:
      "Golden, crispy-bottomed vegetable momos with soft, savoury centres, served with a spicy red dipping chutney. Little pockets of happiness.",
    price: 129,
    image: {
      src: "/images/momos-800.webp",
      srcSet: "/images/momos-800.webp 800w, /images/momos-1400.webp 1400w",
      alt: "Golden pan-fried momos with charred, crispy bottoms on a white plate, beside small blue bowls of red chilli chutney.",
      focus: "62% 74%",
      credit: {
        photographer: "Sehajpal Singh",
        profileUrl: "https://unsplash.com/@fujix_pal",
        source: "Unsplash",
        photoUrl: "https://unsplash.com/photos/a-plate-of-food-on-a-wooden-table-ZT9wGLDEVNs",
      },
    },
  },
  {
    id: "tofu-bowl",
    course: 2,
    category: "The main event",
    name: "Tofu Gochujang Rice Bowl",
    description:
      "Golden crispy tofu tossed in a glossy, sweet-and-spicy gochujang glaze, served over fluffy rice with crunchy cucumber, carrot, spring onions, and sesame. A little heat, a lot of flavour.",
    price: 249,
    image: {
      src: "/images/tofu-bowl-800.webp",
      srcSet: "/images/tofu-bowl-800.webp 800w, /images/tofu-bowl-1400.webp 1400w",
      alt: "Golden tofu glazed in a glossy red-orange sauce with spring onions, resting on a bowl of fluffy white rice.",
      focus: "38% 58%",
      credit: {
        photographer: "Anya Dunes",
        profileUrl: "https://www.pexels.com/@anya-dunes-2153945617/",
        source: "Pexels",
        photoUrl: "https://www.pexels.com/photo/delicious-spicy-tofu-with-rice-in-a-bowl-35064908/",
      },
    },
  },
  {
    id: "cookie-dough",
    course: 3,
    category: "The finale",
    name: "Cookie Dough & Ice Cream",
    description:
      "Chocolate-chip cookie dough meets a scoop of creamy vanilla ice cream. The perfect sweet ending. Obviously.",
    price: 149,
    image: {
      src: "/images/dessert-cookie-skillet.webp",
      srcSet: "/images/dessert-cookie-skillet.webp 480w",
      alt: "A golden chocolate-chip cookie baked in a cast-iron skillet, topped with three scoops of vanilla ice cream, with two spoons digging in.",
      focus: "50% 40%",
    },
  },
]

/** Home-cooked portions: one kitchen, one chef, a sensible ceiling. */
export const MAX_QUANTITY = 10

const byId = new Map(MENU.map((item) => [item.id, item]))

export function getMenuItem(id: MenuItemId): MenuItem | undefined {
  return byId.get(id)
}

export function isMenuItemId(value: unknown): value is MenuItemId {
  return typeof value === "string" && byId.has(value as MenuItemId)
}
