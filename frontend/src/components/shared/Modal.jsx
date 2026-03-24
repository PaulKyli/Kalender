import { useTheme } from '@/hooks/useTheme'

/** Backdrop + centred modal shell. Clicking backdrop calls onClose. */
export function Modal({ children, onClose, maxWidth = 500 }) {
  const { s } = useTheme()

  return (
    <div
      style={s.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-scaleIn"
        style={{ ...s.modal, maxWidth }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

/** Standard modal header row */
export function ModalHeader({ title, onClose, children }) {
  const { theme, s } = useTheme()

  return (
    <div style={{
      padding: '20px 20px 16px',
      borderBottom: `1px solid ${theme.separator}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.text }}>
        {title}
      </h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {children}
        <button onClick={onClose} style={{ ...s.iconBtn, fontSize: 14 }}>✕</button>
      </div>
    </div>
  )
}