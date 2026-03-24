import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { NAV_ITEMS } from '@/constants'

const VIEW_TITLES = Object.fromEntries(NAV_ITEMS.map((n) => [n.id, n.label]))

export function TopBar() {
  const { activeView, setView, openNewEvent, updateSetting, settings } = useApp()
  const { theme, s, isDark } = useTheme()

  return (
    <header style={s.header}>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px', color: theme.text }}>
        {VIEW_TITLES[activeView] ?? 'Kalender'}
      </h1>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Search shortcut */}
        <button onClick={() => setView('search')} style={s.iconBtn} title="Suche">🔍</button>

        {/* Quick add (hidden on chat view) */}
        {activeView !== 'chat' && (
          <button
            onClick={() => openNewEvent()}
            style={{
              border: 'none', borderRadius: 10, padding: '8px 16px',
              background: theme.accent, color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'opacity 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            Termin
          </button>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={() => updateSetting('darkMode', !settings.darkMode)}
          style={s.iconBtn}
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}