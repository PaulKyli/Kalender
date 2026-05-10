import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useApp } from '@/context/AppContext'
import { Modal, ModalHeader } from '@/components/shared/Modal'
import { Button } from '@/components/shared/Button'
import { EmptyState } from '@/components/shared/EmptyState'
import { calendarService } from '@/services/calendarService';

export function ManageMembersModal({ calendar, onClose }) {
  const { theme, s } = useTheme();
  const { fetchCalendars } = useApp();
  
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Laden
  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await calendarService.getMembers(calendar.id);

      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [calendar.id]);

  // 2. Hinzufügen
  const handleAdd = async () => {
    if (!email.trim()) return;
    try {
      await calendarService.addMember(calendar.id, email.trim());
      setEmail('');
      loadMembers();
      fetchCalendars?.();
    } catch (err) {
      alert(err.response?.data?.error || 'Fehler beim Hinzufügen');
    }
  };

  // 3. Entfernen
  const handleRemove = async (userId) => {
    try {
      await calendarService.removeMember(calendar.id, userId);
      loadMembers();
      fetchCalendars?.();
    } catch (err) {
      alert(err.response?.data?.error || 'Fehler beim Entfernen');
    }
  };

  return (
    <Modal onClose={onClose} maxWidth={480}>
      <ModalHeader title="Mitglieder verwalten" onClose={onClose} />

      <div style={{ padding: 20 }}>
        {/* Calendar Info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          marginBottom: 20,
          padding: '12px 14px',
          background: theme.bgTertiary,
          borderRadius: 12,
        }}>
          <div style={{
            width: 40, 
            height: 40, 
            borderRadius: 10,
            background: calendar.color + '22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}>
            📅
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>
              {calendar.name}
            </div>
            <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 2 }}>
              {members.length} Mitglied{members.length !== 1 ? 'er' : ''}
            </div>
          </div>
        </div>

        {/* Add Member Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>Mitglied einladen</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input 
              type="email"
              placeholder="name@beispiel.at" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={{ ...s.input, flex: 1 }}
            />
            <Button 
              onClick={handleAdd} 
              disabled={!email.trim()}
              style={{ flexShrink: 0, padding: '0 20px' }}
            >
              Einladen
            </Button>
          </div>
        </div>

        {/* Members List */}
        <div>
          <label style={s.label}>Mitglieder ({members.length})</label>
          
          <div style={{ 
            ...s.card, 
            maxHeight: 280, 
            overflowY: 'auto',
            background: theme.bgTertiary,
          }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: theme.textTertiary }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                <div style={{ fontSize: 14 }}>Lädt Mitglieder...</div>
              </div>
            ) : error ? (
              <div style={{ padding: 40, textAlign: 'center', color: theme.red }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
                <div style={{ fontSize: 14 }}>{error}</div>
                <Button 
                  variant="secondary" 
                  onClick={loadMembers}
                  style={{ marginTop: 12, fontSize: 13, padding: '6px 12px' }}
                >
                  Erneut versuchen
                </Button>
              </div>
            ) : members.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: theme.textTertiary }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
                <div style={{ fontSize: 14 }}>Noch keine Mitglieder</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Lade jemanden ein!</div>
              </div>
            ) : (
              members.map((member, index) => (
                <div 
                  key={member.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom: index === members.length - 1 ? 'none' : `1px solid ${theme.separator}`,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.bgCard + '80'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.purple})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    flexShrink: 0,
                  }}>
                    {member.name?.[0]?.toUpperCase() || '👤'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: 14, 
                      fontWeight: 500, 
                      color: theme.text,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {member.name || 'Unbekannt'}
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: theme.textTertiary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {member.email}
                    </div>
                  </div>

                  {/* Role Badge */}
                  {member.role && (
                    <div style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: member.role === 'owner' ? theme.accent + '22' : theme.bgCard,
                      color: member.role === 'owner' ? theme.accent : theme.textTertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}>
                      {member.role === 'owner' ? 'Owner' : member.role === 'admin' ? 'Admin' : 'Mitglied'}
                    </div>
                  )}

                  {/* Remove Button */}
                  {member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        border: 'none',
                        background: 'transparent',
                        color: theme.red,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        transition: 'background 0.15s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.red + '22'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      title="Mitglied entfernen"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Close Button */}
        <div style={{ marginTop: 20 }}>
          <Button 
            variant="secondary" 
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Fertig
          </Button>
        </div>
      </div>
    </Modal>
  )
}