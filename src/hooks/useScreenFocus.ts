import { useEffect, useRef } from "react"

/**
 * After a screen change, move focus to the new screen's heading so keyboard
 * and screen-reader users land at the top of what just appeared.
 * Skipped on the very first page load, where the browser's default is right.
 */
export function useScreenFocus<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!enabled) return
    const id = window.setTimeout(() => ref.current?.focus({ preventScroll: true }), 80)
    return () => window.clearTimeout(id)
  }, [enabled])
  return ref
}
