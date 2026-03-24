import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { LIGHT_THEME, DARK_THEME, buildStyles, btnStyle, badgeStyle, dotStyle } from '@/styles/theme'

/**
 * Returns the active theme object, pre-built styles, and helpers.
 * Components import this instead of touching the theme files directly.
 */
export function useTheme() {
  const { isDark } = useApp()

  const theme = isDark ? DARK_THEME : LIGHT_THEME

  // Memoised so re-renders only happen when dark mode actually changes
  const s = useMemo(() => buildStyles(theme), [theme])

  const btn   = useMemo(() => (variant) => btnStyle(theme, variant),   [theme])
  const badge = useMemo(() => (color)   => badgeStyle(color),           [])
  const dot   = useMemo(() => (color)   => dotStyle(color),             [])

  return { theme, s, btn, badge, dot, isDark }
}