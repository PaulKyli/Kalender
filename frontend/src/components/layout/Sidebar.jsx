import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { useEvents } from '@/hooks/useEvents'
import { useCalendar } from '@/hooks/useCalendar'
import { NAV_ITEMS, MONTHS_DE, DAYS_SHORT_DE } from '@/constants'
import { today } from '@/utils'
import { Button } from '@/components/shared/Button'
import { Dot } from '@/components/shared/Badge'

// ─────────────────────────────────────────────
// Mini Calendar
// ─────────────────────────────────────────────
function MiniCalendar() {
  const { selectedDate, setSelectedDate, setView } = useApp()
  const { theme, s } = useTheme()
  const { eventDates } = useEvents()
  const cal = useCalendar()

  const handleDayClick = (ds) => {
    setSelectedDate(ds)
    setView('calendar')
  }

  return (
    <div style={{ padding: '12px 8px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
        <button onClick={cal.prevMonth} style={{ ...s.iconBtn, width: 26, height: 26, fontSize: 13, borderRadius: 7 }}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
          {MONTHS_DE[cal.viewMonth].slice(0, 3)} {cal.viewYear}
        </span>
        <button onClick={cal.nextMonth} style={{ ...s.iconBtn, width: 26, height: 26, fontSize: 13, borderRadius: 7 }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
        {DAYS_SHORT_DE.map((d) => (
          <div key={d} style={{ fontSize: 10, fontWeight: 600, color: theme.textTertiary, padding: '2px 0' }}>{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cal.cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const ds = cal.dateStr(day)
          const isToday    = ds === cal.todayStr
          const isSelected = ds === selectedDate
          const hasEvent   = eventDates.has(ds)

          return (
            <button key={ds} onClick={() => handleDayClick(ds)} style={{
              border: 'none', cursor: 'pointer',
              padding: '5px 0', borderRadius: 7,
              fontSize: 12, fontWeight: isToday ? 700 : 400,
              background: isSelected ? theme.accent : isToday ? theme.accentSoft : 'transparent',
              color: isSelected ? '#fff' : isToday ? theme.accent : theme.text,
              fontFamily: 'inherit', position: 'relative',
              lineHeight: 1.4,
            }}>
              {day}
              {hasEvent && !isSelected && (
                <span style={{
                  position: 'absolute', bottom: 1, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: isToday ? theme.accent : theme.green,
                  display: 'block',
                }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────
export function Sidebar() {
  const { user, activeView, setView, openNewEvent, toggleCalendar } = useApp()
  const { theme, s } = useTheme()
  const { todayEvents } = useEvents()
  const { calendars, loading } = useApp()
  const { activeCalendarFilter, setActiveCalendarFilter } = useApp()

  return (
    <aside style={s.sidebar}>
      {/* Brand / User */}
      <div style={{
        padding: '52px 20px 16px',
        borderBottom: `1px solid ${theme.separator}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.purple})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>📅</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: theme.text }}>
              Kalender
            </div>
            <div style={{ fontSize: 12, color: theme.textTertiary }}>
              {user?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id
          const accent   = theme[item.accentKey] ?? theme.accent

          return (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px', margin: '2px 8px',
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
              background: isActive ? theme.accentSoft : 'transparent',
              color:      isActive ? theme.accent     : theme.textSecondary,
              fontWeight: isActive ? 600 : 400,
              fontSize: 15, border: 'none',
              width: 'calc(100% - 16px)', textAlign: 'left',
              fontFamily: 'inherit',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
                background: isActive ? accent + '22' : theme.bgTertiary,
              }}>
                {item.icon}
              </div>
              <span style={{ flex: 1 }}>{item.label}</span>

              {/* Badge for today's event count */}
              {item.id === 'today' && todayEvents.length > 0 && (
                <span style={{
                  background: theme.red, color: '#fff',
                  borderRadius: 10, padding: '1px 7px',
                  fontSize: 11, fontWeight: 700,
                }}>
                  {todayEvents.length}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Shared Calendars Section */}
      <div style={{ borderTop: `1px solid ${theme.separator}`, padding: '12px 0' }}>
        <div style={{ 
          padding: '0 20px 8px', fontSize: 11, fontWeight: 700, 
          color: theme.textTertiary, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          Geteilte Kalender
        </div>
        
        {/* Button für "Alle anzeigen" */}
        <button 
          onClick={() => {
            if (activeCalendarFilter.length === calendars.length) {
              setActiveCalendarFilter([]);
            } else {
              setActiveCalendarFilter(calendars.map(c => c.id));
            }
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 20px', width: 'calc(100% - 16px)', margin: '0 8px',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            background: activeCalendarFilter?.length === calendars.length ? '#0000FF20' : 'transparent',
            textAlign: 'left', fontFamily: 'inherit'
          }}
        >
          <div style={{ 
            width: 10, height: 10, borderRadius: '50%',
            border: `2px solid #0000FF`, 
            background: activeCalendarFilter?.length === calendars.length ? '#0000FF' : 'transparent',
            transition: 'all 0.2s'
          }} />
          <span style={{ fontSize: 14, color: '#0000FF', fontWeight: activeCalendarFilter?.length === calendars.length ? 600 : 500 }}>
            Alle Kalender
          </span>
        </button>

        {/* Liste der dynamischen Kalender */}
        {calendars.map(cal => {
          const isActive = activeCalendarFilter?.includes(cal.id);
          
          return (
            <button 
              key={cal.id} 
              onClick={() => toggleCalendar(cal.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 20px', width: 'calc(100% - 16px)', margin: '2px 8px',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                background: isActive ? `${cal.color}20` : 'transparent',
                textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s'
              }}
            >
              <div style={{ 
                width: 10, height: 10, borderRadius: '50%', 
                border: `2px solid ${cal.color}`,
                background: isActive ? cal.color : 'transparent',
                transition: 'all 0.2s'
              }} />
              <span style={{ 
                fontSize: 14, 
                color: cal.color, 
                fontWeight: isActive ? 600 : 500 
              }}>
                {cal.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Mini Calendar */}
      <div style={{ borderTop: `1px solid ${theme.separator}` }}>
        <MiniCalendar />
      </div>

      {/* Add Button */}
      <div style={{ padding: 12, borderTop: `1px solid ${theme.separator}` }}>
        <button onClick={() => openNewEvent()} style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, padding: '12px',
          border: 'none', borderRadius: 12, cursor: 'pointer',
          background: theme.accent, color: '#fff',
          fontSize: 15, fontWeight: 600, fontFamily: 'inherit',
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
          Neuer Termin
        </button>
      </div>
    </aside>
  )
}