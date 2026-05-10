import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'
import { CATEGORIES, PRIORITIES } from '@/constants'
import { formatDateLong } from '@/utils'
import { Modal, ModalHeader } from '@/components/shared/Modal'
import { Button } from '@/components/shared/Button'
import { PriorityBadge } from '@/components/shared/Badge'
import { FormField, SelectField } from '@/components/shared/FormField'

// ─────────────────────────────────────────────
// View mode – read-only detail tiles
// ─────────────────────────────────────────────
function InfoTile({ icon, label, children }) {
  const { theme, s } = useTheme()
  return (
    <div style={{ background: theme.bgTertiary, borderRadius: 12, padding: '10px 14px' }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={s.label}>{label}</div>
      <div style={{ fontSize: 14, color: theme.text, fontWeight: 500 }}>{children}</div>
    </div>
  )
}

function ViewMode({ event, onEdit, onDelete, onClose }) {
  const { theme, s } = useTheme()
  const cat = CATEGORIES.find((c) => c.id === event.category)
  const { calendars } = useApp()
  const linkedCal = calendars.find(c => c.id === event.calendar_id || c.id === event.calendar)

  return (
    <>
      <ModalHeader title={event.title} onClose={onClose}>
        <Button variant="secondary" onClick={onEdit} style={{ fontSize: 13, padding: '7px 14px' }}>
          Bearbeiten
        </Button>
      </ModalHeader>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <InfoTile icon="📅" label="Datum">{formatDateLong(event.date)}</InfoTile>
          <InfoTile icon="⏰" label="Zeit">
            {event.time}{event.endTime ? ` – ${event.endTime}` : ''}
          </InfoTile>
          {event.location && <InfoTile icon="📍" label="Ort">{event.location}</InfoTile>}
          <InfoTile icon={cat?.icon ?? '📌'} label="Kategorie">{cat?.label ?? event.category}</InfoTile>
          <InfoTile icon="🔥" label="Priorität"><PriorityBadge priority={event.priority} /></InfoTile>
          <InfoTile icon="📁" label="Kalender">
            {linkedCal ? linkedCal.name : 'Privater Kalender'}
          </InfoTile>
          {event.weather && (
            <InfoTile icon={event.weather.icon} label="Wetter">
              {event.weather.temp}°C · {event.weather.condition}
            </InfoTile>
          )}
        </div>

        {/* Notes */}
        {event.notes && (
          <div style={{ background: theme.bgTertiary, borderRadius: 12, padding: 14 }}>
            <label style={s.label}>Notizen</label>
            <p style={{ margin: 0, fontSize: 14, color: theme.text, lineHeight: 1.6 }}>{event.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="danger" onClick={onDelete}>Löschen</Button>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────
// Edit / Create mode – form
// ─────────────────────────────────────────────
function EditMode({ initial, isNew, onSave, onCancel }) {
  const { theme, s } = useTheme()
  const [form, setForm] = useState(initial)
  const { calendars, loading } = useApp()
  
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setVal = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const canSave = form.title.trim().length > 0

  return (
    <>
      <ModalHeader title={isNew ? 'Neuer Termin' : 'Bearbeiten'} onClose={onCancel} />

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Title */}
        <FormField label="Titel *">
          <input value={form.title} onChange={set('title')}
            placeholder="Termin Titel" style={s.input} autoFocus />
        </FormField>

        {/* Date / Time row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Datum">
            <input type="date" value={form.date} onChange={set('date')}
              style={{ ...s.input, colorScheme: 'dark' }} />
          </FormField>
          <FormField label="Uhrzeit">
            <input type="time" value={form.time} onChange={set('time')}
              style={{ ...s.input, colorScheme: 'dark' }} />
          </FormField>
          <FormField label="Ende">
            <input type="time" value={form.endTime} onChange={set('endTime')}
              style={{ ...s.input, colorScheme: 'dark' }} />
          </FormField>
          <FormField label="Farbe">
            <input type="color" value={form.color} onChange={set('color')}
              style={{ ...s.input, padding: '4px 8px', height: 42, cursor: 'pointer' }} />
          </FormField>
        </div>

        {/* Category / Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <SelectField label="Kategorie" value={form.category} onChange={(v) => setVal('category', v)}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </SelectField>
          <SelectField label="Priorität" value={form.priority} onChange={(v) => setVal('priority', v)}>
            {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </SelectField>
        </div>

        {/* Location */}
        <FormField label="Ort">
          <input value={form.location} onChange={set('location')}
            placeholder="Ort oder Adresse" style={s.input} />
        </FormField>

        {/* NEU: Kalender Auswahl */}
        <SelectField 
          label="In Kalender speichern" 
          value={form.calendar_id ? String(form.calendar_id) : ''}
          onChange={(e) => setForm({ ...form, calendar_id: e.target.value || null })} 
          onChange={(v) => setVal('calendar_id', v)}
        >
          <option value="">Privater Kalender</option>
          {calendars && calendars.length > 0 && calendars.map(cal => (
            <option key={cal.id} value={cal.id}>
              {cal.name}
            </option>
          ))}
        </SelectField>

        {/* Notes */}
        <FormField label="Notizen">
          <textarea value={form.notes} onChange={set('notes')}
            placeholder="Weitere Details…" style={s.textarea} />
        </FormField>

        {/* Submit row */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onCancel}>Abbrechen</Button>
          <Button disabled={!canSave} onClick={() => onSave(form)}>Speichern</Button>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────
// Main EventModal – wires everything together
// ─────────────────────────────────────────────
export function EventModal() {
  const { eventModal, closeEventModal, saveEvent, deleteEvent, selectedDate } = useApp()
  const { open, event, mode } = eventModal
  const { fetchEvents } = useApp();

  const [editing, setEditing] = useState(false)

  if (!open) return null

  const isNew     = mode === 'create'
  const showEdit  = isNew || editing

  const blankForm = {
    title: '', date: selectedDate, time: '', endTime: '',
    category: 'personal', priority: 'medium',
    location: '', notes: '', color: '#007AFF',
    calendar_id: null,
  }

  const handleSave = async (formData) => {
    const cleanedData = {
      ...formData,
      time: formData.time === "" ? null : formData.time,
      endTime: formData.endTime === "" ? null : formData.endTime,
      location: formData.location === "" ? null : formData.location,
      notes: formData.notes === "" ? null : formData.notes,
    };
    try {
      await saveEvent(cleanedData);
      if (fetchEvents) {
        await fetchEvents(); 
      } 
      closeEventModal();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  };

  const handleDelete = () => {
    if (event?.id) deleteEvent(event.id)
    closeEventModal()
  }

  const handleClose = () => {
    closeEventModal()
    setEditing(false)
  }

  return (
    <Modal onClose={handleClose}>
      {showEdit ? (
        <EditMode
          initial={isNew ? blankForm : { ...blankForm, ...event }}
          isNew={isNew}
          onSave={handleSave}
          onCancel={handleClose}
        />
      ) : (
        <ViewMode
          event={event}
          onEdit={() => setEditing(true)}
          onDelete={handleDelete}
          onClose={handleClose}
        />
      )}
    </Modal>
  )
}