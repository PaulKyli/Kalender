import { useTheme } from '@/hooks/useTheme'

export function EmptyState({ icon = '📭', title, subtitle, action }) {
  const { theme } = useTheme()
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: theme.textTertiary }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 14 }}>{subtitle}</div>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  )
}