import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { formatDateLong, generateId } from '@/utils'
import { Button } from '@/components/shared/Button'
import { Dot } from '@/components/shared/Badge'

// ─────────────────────────────────────────────
// Typing indicator (animated dots)
// ─────────────────────────────────────────────
function TypingDots() {
  const { theme } = useTheme()
  return (
    <div style={{ display: 'flex', gap: 5, padding: '4px 0' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: theme.textTertiary,
          animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// Message bubble
// ─────────────────────────────────────────────
function MessageBubble({ msg, onAcceptEvent }) {
  const { theme } = useTheme()
  const isUser = msg.role === 'user'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      gap: 8,
    }}>
      <div style={{
        maxWidth: '80%', padding: '10px 14px', borderRadius: 16,
        borderBottomRightRadius: isUser ? 4 : 16,
        borderBottomLeftRadius: isUser ? 16 : 4,
        background: isUser ? theme.accent : theme.bgCard,
        color: isUser ? '#fff' : theme.text,
        fontSize: 14, lineHeight: 1.55,
        border: isUser ? 'none' : `1px solid ${theme.separator}`,
        whiteSpace: 'pre-line',
      }}>
        {msg.content}
      </div>

      {/* Extracted event card */}
      {msg.event && (
        <div style={{
          maxWidth: '80%', padding: 14, borderRadius: 14,
          background: theme.bgTertiary,
          border: `1px solid ${theme.separator}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Dot color={msg.event.color} />
            <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{msg.event.title}</span>
          </div>
          <div style={{ fontSize: 13, color: theme.textTertiary, marginBottom: 3 }}>
            📅 {formatDateLong(msg.event.date)}
          </div>
          {msg.event.time && (
            <div style={{ fontSize: 13, color: theme.textTertiary, marginBottom: 3 }}>
              ⏰ {msg.event.time}{msg.event.endTime ? ` – ${msg.event.endTime}` : ''}
            </div>
          )}
          {msg.event.location && (
            <div style={{ fontSize: 13, color: theme.textTertiary, marginBottom: 12 }}>
              📍 {msg.event.location}
            </div>
          )}
          <Button onClick={() => onAcceptEvent(msg.event)} style={{ fontSize: 13, padding: '8px 16px' }}>
            ✓ Termin übernehmen
          </Button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Chat View
// ─────────────────────────────────────────────
const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    content: '👋 Hallo! Ich bin dein KI-Assistent.\n\nBeschreibe einen Termin in natürlicher Sprache – oder lade ein Bild hoch (Einladung, Screenshot, Foto) und ich extrahiere die Termindaten automatisch.\n\nBeispiel: „Morgen um 14 Uhr Zahnarzt in der Praxis Huber, Bahnhofstraße, dauert eine Stunde"',
  },
]

export function ChatView() {
  const { addEvent, setView } = useApp()
  const { theme, s } = useTheme()

  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [dragging, setDragging] = useState(false)

  const bottomRef  = useRef(null)
  const fileRef    = useRef(null)
  const inputRef   = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const pushMessage = (msg) => setMessages((m) => [...m, { id: generateId(), ...msg }])

  // Simulate AI response – replace this with a real API call
  const simulateAIResponse = async (userText) => {
    await new Promise((r) => setTimeout(r, 1400))

    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    const mockEvent = {
      id: generateId(),
      title: 'Zahnarzt',
      date: tomorrow,
      time: '14:00',
      endTime: '15:00',
      category: 'health',
      priority: 'medium',
      location: 'Praxis Huber, Bahnhofstraße',
      notes: 'Extrahiert via KI-Assistent',
      color: '#FF2D55',
      weather: { temp: 9, condition: 'Bedeckt', icon: '☁️' },
    }

    pushMessage({
      role: 'assistant',
      content: 'Ich habe folgenden Termin aus deiner Nachricht erkannt:',
      event: mockEvent,
    })
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    pushMessage({ role: 'user', content: text })
    setLoading(true)
    try {
      await simulateAIResponse(text)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (file) => {
    if (!file) return
    pushMessage({ role: 'user',      content: `📎 Bild hochgeladen: ${file.name}` })
    pushMessage({ role: 'assistant', content: `📸 Analysiere das Bild „${file.name}"…\n\nIch erkenne: Einladung zur Geburtstagsfeier von Anna am Samstag, 15. März um 19:00 Uhr im Restaurant Seeblick. Soll ich diesen Termin erstellen?` })
  }

  const handleAcceptEvent = (event) => {
    addEvent(event)
    pushMessage({ role: 'assistant', content: `✅ Termin „${event.title}" wurde erfolgreich in deinen Kalender eingetragen!` })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px', color: theme.text }}>
        KI Assistent
      </h2>

      {/* Message list */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileUpload(e.dataTransfer.files[0]) }}
        style={{
          flex: 1, overflow: 'auto',
          display: 'flex', flexDirection: 'column', gap: 12,
          padding: 16,
          background: theme.bgSecondary, borderRadius: 16,
          border: dragging ? `2px dashed ${theme.accent}` : `1px solid ${theme.separator}`,
          marginBottom: 12, transition: 'border 0.2s',
          position: 'relative',
        }}
      >
        {dragging && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: theme.accentSoft, borderRadius: 14,
            fontSize: 18, fontWeight: 700, color: theme.accent,
            pointerEvents: 'none',
          }}>
            📎 Bild hier ablegen…
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onAcceptEvent={handleAcceptEvent} />
        ))}

        {loading && (
          <div>
            <div style={{
              display: 'inline-flex', padding: '10px 14px', borderRadius: 16,
              borderBottomLeftRadius: 4, background: theme.bgCard,
              border: `1px solid ${theme.separator}`,
            }}>
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => fileRef.current?.click()}
          style={{ ...s.iconBtn, flexShrink: 0 }}
          title="Bild hochladen"
        >📎</button>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Termin beschreiben oder Bild hochladen…"
          style={s.input}
          disabled={loading}
        />

        <Button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{ flexShrink: 0, padding: '0 20px', fontSize: 18 }}
        >↑</Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { handleFileUpload(e.target.files[0]); e.target.value = '' }}
      />
    </div>
  )
}