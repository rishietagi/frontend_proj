const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function formatPrice(amount: number): string {
  return rupees.format(amount)
}

export function pluralItems(count: number): string {
  return `${count} ${count === 1 ? "item" : "items"}`
}

export function formatCourse(course: number): string {
  return String(course).padStart(2, "0")
}
