import { useTheme } from '@/hooks/useTheme'

/**
 * Reusable iOS-styled button.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 */
export function Button({ children, variant = 'primary', onClick, disabled, style, ...rest }) {
  const { btn, theme } = useTheme()

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...btn(variant),
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}