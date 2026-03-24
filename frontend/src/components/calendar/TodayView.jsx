import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { useEvents } from '@/hooks/useEvents'
import { pad2 } from '@/utils'
import { EventCard } from '@/components/events/EventCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/shared/Button'

// ─────────────────────────────────────────────
// Live Clock Widget
// ─────────────────────────────────────────────
function ClockWidget() {
  const { theme } = useTheme()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`
  const dateStr = now.toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1px', color: theme.text, lineHeight: 1 }}>
        {timeStr}
      </div>
      <div style={{ fontSize: 15, color: theme.textTertiary, marginTop: 4 }}>{dateStr}</div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Today Summary Card
// ─────────────────────────────────────────────
function TodaySummary({ count }) {
  const { theme, s } = useTheme()
  const { openNewEvent } = useApp()

  return (
    <div style={{ ...s.card, padding: 20, marginBottom: 20 }}>
      <ClockWidget />

      <div style={{
        marginTop: 16, paddingTop: 16,
        borderTop: `1px solid ${theme.separator}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 14, color: theme.textTertiary }}>
          {count === 0
            ? '🎉 Heute nichts geplant'
            : `${count} Termin${count !== 1 ? 'e' : ''} heute`}
        </span>
        <Button onClick={() => openNewEvent()} style={{ fontSize: 13, padding: '7px 14px' }}>
          + Termin
        </Button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Prayer Times Widget (visible when religion = 'islam')
// ─────────────────────────────────────────────
const PRAYER_TIMES = [
  { name: 'Fajr',    time: '05:43', passed: true  },
  { name: 'Şuruk',   time: '07:12', passed: true  },
  { name: 'Dhuhr',   time: '12:22', passed: false, next: true },
  { name: 'Asr',     time: '15:04', passed: false },
  { name: 'Maghrib', time: '17:31', passed: false },
  { name: 'Isha',    time: '19:08', passed: false },
]

export function PrayerWidget() {
  const { theme, s } = useTheme()

  return (
    <div style={{ ...s.card, padding: 16, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 24 }}>🌙</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>Gebetszeiten heute</div>
          <div style={{ fontSize: 12, color: theme.textTertiary }}>Ramadan aktiv · Klagenfurt</div>
        </div>
        <div style={{ fontSize: 12, color: theme.orange, fontWeight: 600 }}>
          🌅 Iftar: 17:31
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {PRAYER_TIMES.map((p) => (
          <div key={p.name} style={{
            padding: '8px 10px', borderRadius: 10,
            background: p.next ? theme.accentSoft : p.passed ? theme.bgTertiary + '80' : theme.bgTertiary,
            border: p.next ? `1px solid ${theme.accent}44` : '1px solid transparent',
          }}>
            <div style={{ fontSize: 10, color: p.next ? theme.accent : theme.textTertiary, fontWeight: 600, marginBottom: 3 }}>
              {p.next ? '▶ Nächstes' : p.name}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: p.passed ? theme.textTertiary : theme.text }}>
              {p.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Today View (root)
// ─────────────────────────────────────────────
export function TodayView() {
  const { settings, openEventModal } = useApp()
  const { theme } = useTheme()
  const { todayEvents, upcoming } = useEvents()

  return (
    <div className="animate-fadeIn">
      <TodaySummary count={todayEvents.length} />

      {settings.religion === 'islam' && <PrayerWidget />}

      {/* Today's events */}
      {todayEvents.length > 0 && (
        <>
          <SectionHeader>Heute</SectionHeader>
          {todayEvents.map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={(e) => openEventModal(e, 'view')} />
          ))}
        </>
      )}

      {/* Upcoming */}
      {upcoming.filter((e) => e.date !== new Date().toISOString().slice(0, 10)).length > 0 && (
        <>
          <SectionHeader style={{ marginTop: todayEvents.length ? 20 : 0 }}>Demnächst</SectionHeader>
          {upcoming
            .filter((e) => e.date !== new Date().toISOString().slice(0, 10))
            .slice(0, 6)
            .map((ev) => (
              <EventCard key={ev.id} event={ev} onClick={(e) => openEventModal(e, 'view')} />
            ))}
        </>
      )}

      {upcoming.length === 0 && todayEvents.length === 0 && (
        <EmptyState icon="🗓" title="Keine Termine geplant" subtitle="Füge deinen ersten Termin hinzu" />
      )}
    </div>
  )
}

function SectionHeader({ children, style }) {
  const { theme } = useTheme()
  return (
    <h3 style={{ fontSize: 17, fontWeight: 700, color: theme.text, margin: '0 0 12px', ...style }}>
      {children}
    </h3>
  )
}