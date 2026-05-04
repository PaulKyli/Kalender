import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/shared/Button'

const MODES = ['login', 'register']

export function AuthScreen() {
  const { login } = useApp()
  const { theme, s } = useTheme()

  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: 'demo@kalender.app', password: 'demo' })
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async () => {
  setLoading(true)
  try {
    if (mode === 'login') {
      await login(form.email, form.password)
    } else {
      await register(form.name, form.email, form.password)
    }
  } catch (error) {
    // Error wird bereits im Context gehandelt
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 60% 20%, ${theme.accentSoft} 0%, ${theme.bg} 60%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 76, height: 76, borderRadius: 22,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.purple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 18px',
            boxShadow: `0 12px 36px ${theme.accent}55`,
          }}>📅</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.6px', margin: 0, color: theme.text }}>
            Kalender
          </h1>
          <p style={{ color: theme.textTertiary, margin: '8px 0 0', fontSize: 15 }}>
            Dein intelligenter Begleiter
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          background: theme.bgTertiary,
          borderRadius: 12,
          padding: 3,
          marginBottom: 24,
        }}>
          {MODES.map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '9px 0',
              border: 'none', borderRadius: 10,
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              fontFamily: 'inherit', transition: 'all 0.2s',
              background: mode === m ? theme.bgCard : 'transparent',
              color:      mode === m ? theme.text   : theme.textTertiary,
              boxShadow:  mode === m ? `0 2px 8px ${theme.shadow}` : 'none',
            }}>
              {m === 'login' ? 'Anmelden' : 'Registrieren'}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div style={{ ...s.card, padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && (
              <Field label="Vollständiger Name" s={s} theme={theme}>
                <input
                  placeholder="Max Mustermann"
                  value={form.name}
                  onChange={set('name')}
                  style={s.input}
                />
              </Field>
            )}
            <Field label="E-Mail" s={s} theme={theme}>
              <input
                type="email"
                placeholder="name@beispiel.at"
                value={form.email}
                onChange={set('email')}
                style={s.input}
              />
            </Field>
            <Field label="Passwort" s={s} theme={theme}>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                style={s.input}
              />
            </Field>

            <Button
              onClick={handleSubmit}
              disabled={loading || !form.email || !form.password}
              style={{ width: '100%', padding: '13px', fontSize: 16, marginTop: 4 }}
            >
              {loading ? '…' : mode === 'login' ? 'Anmelden →' : 'Account erstellen →'}
            </Button>

            {mode === 'login' && (
              <Button variant="ghost" style={{ width: '100%', fontSize: 14 }}>
                Passwort vergessen?
              </Button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: theme.textTertiary, fontSize: 12, marginTop: 20 }}>
          Demo: E-Mail & Passwort bereits vorausgefüllt
        </p>
      </div>
    </div>
  )
}

// Local helper – keeps the form clean
function Field({ label, s, theme, children }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  )
}