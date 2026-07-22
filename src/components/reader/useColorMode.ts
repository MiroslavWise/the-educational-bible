import { useEffect, useState } from "react"

export type ColorMode = "light" | "dark" | "system"

const STORAGE_KEY = "tb-color-mode"

/** Persisted light/dark toggle. Starts as "system" so SSR and the first client
 * render match, then hydrates from localStorage. */
export function useColorMode(): { mode: ColorMode; toggle: () => void; setMode: (m: ColorMode) => void } {
  const [mode, setMode] = useState<ColorMode>("system")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null
    if (stored === "light" || stored === "dark" || stored === "system") {
      setMode(stored)
    }
  }, [])

  const apply = (m: ColorMode) => {
    setMode(m)
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch {
      /* ignore */
    }
  }

  const toggle = () => {
    const resolved =
      mode === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : mode
    apply(resolved === "dark" ? "light" : "dark")
  }

  return { mode, toggle, setMode: apply }
}
