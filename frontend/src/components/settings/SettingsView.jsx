import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { RELIGIONS, CATEGORIES } from '@/constants'
import { Toggle } from '@/components/shared/Toggle'
import { Button } from '@/components/shared/Button'
import { SelectField } from '@/components/shared/FormField'

// ─────────────────────────────────────────────
// Settings section group
// ─────────────────────────────────────────────
function SettingsGroup({ title, children }) {
  const { theme, s } = useTheme()
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 12, fontWeight: 700,
        color: theme.textTertiary,
        textTransform: 'uppercase', letterSpacing: '0.6px',
        marginBottom: 8, paddingLeft: 4,
      }}>
        {title}
      </div>
      <div style={s.card}>{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Toggle row
// ─────────────────────────────────────────────
function ToggleRow({ icon, label, description, value, onChange, last }) {
  const { theme } = useTheme()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${theme.separator}`,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 15, color: theme.text, fontWeight: 500 }}>{label}</div>
          {description && (
            <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 1 }}>{description}</div>
          )}
        </div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Shared calendar card
// ─────────────────────────────────────────────
const SHARED_CALENDARS = [
  { id: 'family', name: 'Familie Maier', icon: '👨‍👩‍👧‍👦', members: 4, color: '#FF9500' },
  { id: 'work',   name: 'Team Alpenwerk', icon: '💼',       members: 8, color: '#007AFF' },
]

function SharedCalendarRow({ cal, last }) {
  const { theme } = useTheme()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : `1px solid ${theme.separator}`,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: cal.color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>{cal.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{cal.name}</div>
        <div style={{ fontSize: 12, color: theme.textTertiary }}>{cal.members} Mitglieder</div>
      </div>
      <Button variant="ghost" style={{ fontSize: 13, padding: '6px 12px' }}>Verwalten</Button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Settings View
// ─────────────────────────────────────────────
export function SettingsView() {
  const { user, settings, updateSetting, logout } = useApp()
  const { theme, s } = useTheme()

  const set = (key) => (value) => updateSetting(key, value)

  return (
    <div className="animate-fadeIn">
      <h2 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', color: theme.text }}>
        Einstellungen
      </h2>

      {/* Profile */}
      <SettingsGroup title="Account">
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.purple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, flexShrink: 0,
          }}>{user?.avatar ?? '👤'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: theme.textTertiary }}>{user?.email}</div>
          </div>
          <Button variant="secondary" style={{ fontSize: 13, padding: '7px 14px' }}>Bearbeiten</Button>
        </div>
      </SettingsGroup>

      {/* Appearance */}
      <SettingsGroup title="Darstellung">
        <ToggleRow
          icon="🌙" label="Dark Mode"
          description="iOS-inspiriertes Dunkel-Design"
          value={settings.darkMode}
          onChange={set('darkMode')}
          last
        />
      </SettingsGroup>

      {/* Religion */}
      <SettingsGroup title="Religion & Feiertage">
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${theme.separator}` }}>
          <SelectField
            label="Religion / Kalender-Typ"
            value={settings.religion}
            onChange={(v) => updateSetting('religion', v)}
          >
            {RELIGIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.flag} {r.label}</option>
            ))}
          </SelectField>
        </div>

        {settings.religion === 'islam' && (
          <div style={{ padding: '12px 16px' }}>
            <div style={{
              background: theme.accentSoft, borderRadius: 10, padding: '12px 14px',
              fontSize: 13, color: theme.accent, lineHeight: 1.6,
            }}>
              🌙 <strong>Islamische Extras aktiv:</strong> Tägliche Gebetszeiten-Erinnerungen und während des Ramadan werden Suhur- und Iftar-Zeiten angezeigt.
            </div>
          </div>
        )}
      </SettingsGroup>

      {/* Notifications */}
      <SettingsGroup title="Benachrichtigungen">
        <ToggleRow icon="🔔" label="Push-Benachrichtigungen"
          description="Erinnerungen vor Terminen"
          value={settings.notifications} onChange={set('notifications')} />
        <ToggleRow icon="📧" label="E-Mail Erinnerungen"
          description="Tagesübersicht täglich um 7:00 Uhr"
          value={settings.emailReminders} onChange={set('emailReminders')} />
        <ToggleRow icon="🌤" label="Wetterwarnungen"
          description="Bei schlechtem Wetter für Termine"
          value={settings.weatherAlerts} onChange={set('weatherAlerts')} last />
      </SettingsGroup>

      {/* Shared Calendars */}
      <SettingsGroup title="Geteilte Kalender">
        {SHARED_CALENDARS.map((cal, i) => (
          <SharedCalendarRow key={cal.id} cal={cal} last={i === SHARED_CALENDARS.length - 1} />
        ))}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${theme.separator}` }}>
          <Button variant="secondary" style={{ width: '100%', fontSize: 14 }}>
            + Kalender teilen oder beitreten
          </Button>
        </div>
      </SettingsGroup>

      {/* Category colours */}
      <SettingsGroup title="Kategorien">
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: cat.color + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>{cat.icon}</div>
              <div style={{ flex: 1, fontSize: 14, color: theme.text, fontWeight: 500 }}>{cat.label}</div>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: cat.color }} />
            </div>
          ))}
        </div>
      </SettingsGroup>

      {/* Danger zone */}
      <SettingsGroup title="Konto">
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="secondary" style={{ width: '100%' }} onClick={logout}>
            Abmelden
          </Button>
          <Button variant="danger" style={{ width: '100%' }}>
            Konto löschen
          </Button>
        </div>
      </SettingsGroup>
    </div>
  )
}