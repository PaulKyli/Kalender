import { useTheme } from '@/hooks/useTheme'

/** iOS-style toggle switch */
export function Toggle({ value, onChange }) {
  const { theme } = useTheme()

  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: 50,
        height: 30,
        borderRadius: 15,
        background: value ? theme.green : theme.bgTertiary,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.25s',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: 2,
        left: value ? 22 : 2,
        transition: 'left 0.25s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      }} />
    </button>
  )
}