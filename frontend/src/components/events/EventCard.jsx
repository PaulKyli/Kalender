import { useTheme } from '@/hooks/useTheme'
import { PriorityBadge } from '@/components/shared/Badge'
import { useApp } from '@/context/AppContext'

/**
 * Compact event row card used in lists (Today, Agenda, etc.)
 */
export function EventCard({ event, onClick }) {
  const { theme, s } = useTheme()
  const { calendars } = useApp()

  const linkedCalendar = calendars.find(c => c.id === event.calendar)
  
  const displayColor = linkedCalendar ? linkedCalendar.color : event.color

  return (
    <article
      onClick={() => onClick?.(event)}
      style={{
        ...s.card,
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 8,
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = `0 8px 24px ${theme.shadow}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Category colour bar */}
      <div style={{
        width: 3, borderRadius: 4,
        background: displayColor,
        alignSelf: 'stretch',
        flexShrink: 0,
      }} />

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{
            fontSize: 15, fontWeight: 600, color: theme.text,
            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {event.title}
          </span>
          {linkedCalendar && (
            <span style={{ 
              fontSize: 10, 
              background: linkedCalendar.color + '22', 
              color: linkedCalendar.color,
              padding: '2px 6px',
              borderRadius: 4,
              fontWeight: 700
            }}>
              {linkedCalendar.name.toUpperCase()}
            </span>
          )}
          <PriorityBadge priority={event.priority} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {event.time && (
            <Chip>⏰ {event.time}{event.endTime ? ` – ${event.endTime}` : ''}</Chip>
          )}
          {event.location && (
            <Chip>📍 {event.location}</Chip>
          )}
          {event.weather && (
            <Chip>{event.weather.icon} {event.weather.temp}°C</Chip>
          )}
        </div>
      </div>
    </article>
  )
}

function Chip({ children }) {
  const { theme } = useTheme()
  return (
    <span style={{ fontSize: 13, color: theme.textTertiary }}>{children}</span>
  )
}