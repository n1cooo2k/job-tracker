import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

/** Reads the current theme from the <html data-theme> set by the inline boot
 *  script in index.html, then keeps it in sync with state and localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'dark',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}
