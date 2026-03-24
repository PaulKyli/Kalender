import { useTheme } from '@/hooks/useTheme'
import { PRIORITIES } from '@/constants'

/** Coloured text badge, e.g. for priorities or categories */
export function Badge({ color, children, style }) {
  const { badge } = useTheme()
  return <span style={{ ...badge(color), ...style }}>{children}</span>
}

/** Small coloured dot */
export function Dot({ color, size = 10, style }) {
  const { dot } = useTheme()
  return <span style={{ ...dot(color), width: size, height: size, ...style }} />
}

/** Priority badge with auto-resolved label and color */
export function PriorityBadge({ priority }) {
  const p = PRIORITIES.find((x) => x.id === priority)
  if (!p) return null
  return <Badge color={p.color}>{p.label}</Badge>
}