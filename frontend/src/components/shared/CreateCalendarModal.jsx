import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useApp } from '@/context/AppContext'
import { Modal, ModalHeader } from '@/components/shared/Modal'
import { Button } from '@/components/shared/Button'
import { calendarService } from '@/services/calendarService'

export function CreateCalendarModal({ onClose }) {
  const { theme, s } = useTheme()
  const { fetchCalendars } = useApp()
  
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1') // Default Indigo
  const [loading, setLoading] = useState(false)

  const colors = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981', 
    '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4'
  ]

  const handleCreate = async () => {
    if (!name.trim()) return
    
    try {
      setLoading(true)
      await calendarService.createCalendar(name.trim(), color)
      fetchCalendars?.() // Liste im Hintergrund aktualisieren
      onClose() // Modal zu
    } catch (err) {
      alert(err.message || 'Fehler beim Erstellen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose} maxWidth={400}>
      <ModalHeader title="Neuer Kalender" onClose={onClose} />

      <div style={{ padding: 20 }}>
        {/* Name Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>Name des Kalenders</label>
          <input 
            type="text"
            placeholder="z.B. Arbeit oder Familie" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            style={s.input}
            autoFocus
          />
        </div>

        {/* Color Picker */}
        <div style={{ marginBottom: 24 }}>
          <label style={s.label}>Farbe wählen</label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 12,
            marginTop: 8 
          }}>
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  height: 40,
                  borderRadius: 10,
                  background: c,
                  border: color === c ? `3px solid ${theme.text}` : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                  transform: color === c ? 'scale(1.05)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Button 
            variant="secondary" 
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Abbrechen
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!name.trim() || loading}
            style={{ flex: 2 }}
          >
            {loading ? 'Wird erstellt...' : 'Erstellen'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}