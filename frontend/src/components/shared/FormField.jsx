import { useTheme } from '@/hooks/useTheme'

/** Wraps a label + input child in a consistent layout */
export function FormField({ label, children, style }) {
  const { s } = useTheme()
  return (
    <div style={style}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  )
}

/** Select with an auto-styled chevron overlay */
export function SelectField({ label, value, onChange, children, style }) {
  const { theme, s } = useTheme()
  return (
    <FormField label={label} style={style}>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={s.select}>
          {children}
        </select>
        <span style={{
          position: 'absolute', right: 12, top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: theme.textTertiary,
          fontSize: 14,
        }}>›</span>
      </div>
    </FormField>
  )
}