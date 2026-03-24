import { MONTHS_DE } from '@/constants'

// ─────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────

/** Returns today's date as YYYY-MM-DD string */
export const today = () => new Date().toISOString().slice(0, 10)

/** Days in a given month (0-indexed) */
export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate()

/**
 * First weekday of a month, adjusted for Mon-first grid.
 * Returns 0 (Mon) … 6 (Sun)
 */
export const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

/** Parses a YYYY-MM-DD string safely (avoids timezone offset issues) */
export const parseDate = (dateStr) => {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Formats a YYYY-MM-DD string to German long format */
export const formatDateLong = (dateStr) => {
  const d = parseDate(dateStr)
  if (!d) return ''
  return d.toLocaleDateString('de-AT', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/** Formats a YYYY-MM-DD string to short format: "12. März" */
export const formatDateShort = (dateStr) => {
  const d = parseDate(dateStr)
  if (!d) return ''
  return `${d.getDate()}. ${MONTHS_DE[d.getMonth()]}`
}

/** Returns "Heute", "Morgen", or long date */
export const formatRelativeDate = (dateStr) => {
  const t = today()
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  if (dateStr === t)        return 'Heute'
  if (dateStr === tomorrow) return 'Morgen'
  return formatDateLong(dateStr)
}

/** Pads a number to 2 digits: 5 → "05" */
export const pad2 = (n) => String(n).padStart(2, '0')

/** Builds a YYYY-MM-DD string from year, month (0-indexed), day */
export const toDateStr = (year, month, day) =>
  `${year}-${pad2(month + 1)}-${pad2(day)}`

/** Returns current time as "HH:MM" */
export const currentTime = () => {
  const n = new Date()
  return `${pad2(n.getHours())}:${pad2(n.getMinutes())}`
}

// ─────────────────────────────────────────────
// Event helpers
// ─────────────────────────────────────────────

/** Groups an array of events by their date field */
export const groupEventsByDate = (events) =>
  events.reduce((acc, event) => {
    acc[event.date] = acc[event.date] ? [...acc[event.date], event] : [event]
    return acc
  }, {})

/** Sorts events by date then time */
export const sortEvents = (events) =>
  [...events].sort((a, b) =>
    a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')
  )

/** Returns events for a specific date */
export const eventsForDate = (events, dateStr) =>
  events.filter((e) => e.date === dateStr)

/** Returns upcoming events (today and later), sorted */
export const upcomingEvents = (events, limit = undefined) => {
  const t = today()
  const sorted = sortEvents(events.filter((e) => e.date >= t))
  return limit ? sorted.slice(0, limit) : sorted
}

// ─────────────────────────────────────────────
// Misc helpers
// ─────────────────────────────────────────────

/** Generates a simple unique ID */
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/** Returns hex color with alpha: '#FF0000' + 0.2 → 'rgba(255,0,0,0.2)' */
export const hexAlpha = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/** Clamps a number between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)