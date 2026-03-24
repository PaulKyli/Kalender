import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { useCalendar } from '@/hooks/useCalendar'
import { useEvents } from '@/hooks/useEvents'
import { MONTHS_DE, DAYS_SHORT_DE } from '@/constants'
import { Button } from '@/components/shared/Button'
import { EventCard } from '@/components/events/EventCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatRelativeDate } from '@/utils'

// ─────────────────────────────────────────────
// Month Grid
// ─────────────────────────────────────────────
export function CalendarMonthView() {
  const { openNewEvent, openEventModal } = useApp()
  const { theme, s } = useTheme()
  const { grouped } = useEvents()
  const cal = useCalendar()

  const handleDayClick = (ds) => openNewEvent(ds)
  const handleEventClick = (e) => { e.stopPropagation(); openEventModal(/* event */ e, 'view') }

  return (
    <div className="animate-fadeIn">
      {/* Navigation bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={cal.prevMonth} style={s.iconBtn}>‹</button>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', color: theme.text }}>
          {MONTHS_DE[cal.viewMonth]} {cal.viewYear}
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={cal.goToToday} style={{ padding: '7px 14px', fontSize: 13 }}>
            Heute
          </Button>
          <button onClick={cal.nextMonth} style={s.iconBtn}>›</button>
        </div>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DAYS_SHORT_DE.map((d) => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 12, fontWeight: 600,
            color: theme.textTertiary, padding: '4px 0',
          }}>{d}</div>
        ))}
      </div>

      {/* Cell grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cal.cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} style={{ minHeight: 90 }} />
          const ds        = cal.dateStr(day)
          const isToday   = ds === cal.todayStr
          const dayEvents = grouped[ds] ?? []
          const isWeekend = i % 7 >= 5

          return (
            <div
              key={ds}
              onClick={() => handleDayClick(ds)}
              style={{
                ...s.card,
                minHeight: 90,
                padding: '8px 6px',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                border: isToday
                  ? `2px solid ${theme.accent}`
                  : `1px solid ${theme.separator}`,
                background: isToday
                  ? theme.accentSoft
                  : isWeekend
                    ? theme.bgTertiary + '80'
                    : theme.bgCard,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.025)'
                e.currentTarget.style.boxShadow = `0 6px 20px ${theme.shadow}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: 14, fontWeight: isToday ? 700 : 500,
                color: isToday ? theme.accent : isWeekend ? theme.textTertiary : theme.text,
                marginBottom: 6, textAlign: 'right',
              }}>{day}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    onClick={(e) => { e.stopPropagation(); openEventModal(ev, 'view') }}
                    style={{
                      fontSize: 11, fontWeight: 600,
                      background: ev.color + '22', color: ev.color,
                      padding: '2px 5px', borderRadius: 4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >{ev.title}</div>
                ))}
                {dayEvents.length > 3 && (
                  <div style={{ fontSize: 10, color: theme.textTertiary, paddingLeft: 5 }}>
                    +{dayEvents.length - 3} mehr
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Agenda (chronological list)
// ─────────────────────────────────────────────
export function AgendaView() {
  const { openEventModal } = useApp()
  const { theme } = useTheme()
  const { grouped } = useEvents()
  const todayStr = new Date().toISOString().slice(0, 10)

  const sortedDates = Object.keys(grouped).sort()

  if (sortedDates.length === 0) {
    return <EmptyState icon="📭" title="Keine Termine" subtitle="Erstelle deinen ersten Termin" />
  }

  return (
    <div className="animate-fadeIn">
      <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', color: theme.text }}>
        Agenda
      </h2>

      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: 28 }}>
          {/* Date separator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: date === todayStr ? theme.accent : theme.textTertiary,
              letterSpacing: '0.3px',
            }}>
              {date === todayStr ? '🔵 ' : ''}{formatRelativeDate(date).toUpperCase()}
            </div>
            <div style={{ flex: 1, height: 1, background: theme.separator }} />
          </div>

          {grouped[date].map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={(e) => openEventModal(e, 'view')} />
          ))}
        </div>
      ))}
    </div>
  )
}