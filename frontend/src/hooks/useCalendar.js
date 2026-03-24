import { useState, useCallback } from 'react'
import { getDaysInMonth, getFirstDayOfMonth, toDateStr, today } from '@/utils'

/**
 * Encapsulates month-navigation state for any calendar grid.
 * Returns grid cells and navigation helpers.
 */
export function useCalendar(initialDate = null) {
  const seed = initialDate ? new Date(initialDate) : new Date()

  const [viewYear,  setViewYear]  = useState(seed.getFullYear())
  const [viewMonth, setViewMonth] = useState(seed.getMonth())

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11 }
      return m - 1
    })
  }, [])

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0 }
      return m + 1
    })
  }, [])

  const goToToday = useCallback(() => {
    const now = new Date()
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
  }, [])

  const goToDate = useCallback((dateStr) => {
    const d = new Date(dateStr)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }, [])

  // Build the grid: nulls for leading empty cells, then day numbers
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth)

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad trailing cells to complete the last row
  while (cells.length % 7 !== 0) cells.push(null)

  const todayStr = today()

  return {
    viewYear,
    viewMonth,
    cells,
    todayStr,
    prevMonth,
    nextMonth,
    goToToday,
    goToDate,
    /** Converts a day number to a full YYYY-MM-DD string */
    dateStr: (day) => toDateStr(viewYear, viewMonth, day),
  }
}