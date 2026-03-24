import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { useEvents } from '@/hooks/useEvents'
import { EventCard } from '@/components/events/EventCard'

export function SearchView() {
  const { openEventModal } = useApp()
  const { theme, s } = useTheme()
  const { all: events } = useEvents()

  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const q = query.trim().toLowerCase()
  const results = q
    ? events.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        (e.location ?? '').toLowerCase().includes(q) ||
        (e.notes ?? '').toLowerCase().includes(q)
      )
    : []

  return (
    <div className="animate-fadeIn">
      <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', color: theme.text }}>
        Suche
      </h2>

      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{
          position: 'absolute', left: 14, top: '50%',
          transform: 'translateY(-50%)',
          color: theme.textTertiary, fontSize: 17, pointerEvents: 'none',
        }}>🔍</span>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Titel, Ort oder Notizen durchsuchen…"
          style={{ ...s.input, paddingLeft: 44, fontSize: 16 }}
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              border: 'none', borderRadius: '50%',
              width: 20, height: 20,
              background: theme.textTertiary, color: theme.bgSecondary,
              cursor: 'pointer', fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0,
            }}
          >✕</button>
        )}
      </div>

      {/* Results */}
      {query && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 0', color: theme.textTertiary }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🔎</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: theme.textSecondary }}>Keine Ergebnisse</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>Keine Treffer für „{query}"</div>
        </div>
      )}

      {!query && (
        <div style={{ textAlign: 'center', paddingTop: 50, color: theme.textTertiary }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16 }}>Suche nach Terminen, Orten oder Notizen</div>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div style={{ fontSize: 13, color: theme.textTertiary, marginBottom: 12 }}>
            {results.length} Ergebnis{results.length !== 1 ? 'se' : ''} für „{query}"
          </div>
          {results.map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={(e) => openEventModal(e, 'view')} />
          ))}
        </>
      )}
    </div>
  )
}