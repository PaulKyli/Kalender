import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import {
  groupEventsByDate,
  sortEvents,
  eventsForDate,
  upcomingEvents,
  today,
} from '@/utils'

/**
 * Convenience hook that exposes pre-computed event collections.
 * All values are memoised — components only re-render when events change.
 */
export function useEvents() {
  const { events } = useApp()

  const todayStr = today()

  const grouped   = useMemo(() => groupEventsByDate(events), [events])
  const sorted    = useMemo(() => sortEvents(events),        [events])
  const todayEvs  = useMemo(() => eventsForDate(events, todayStr), [events, todayStr])
  const upcoming  = useMemo(() => upcomingEvents(events),    [events])
  const eventDates = useMemo(() => new Set(events.map((e) => e.date)), [events])

  const forDate = (dateStr) => grouped[dateStr] ?? []

  return {
    all:        events,
    grouped,
    sorted,
    todayEvents: todayEvs,
    upcoming,
    eventDates,
    forDate,
  }
}