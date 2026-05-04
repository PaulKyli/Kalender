import { useApp } from '@/context/AppContext'
import { useTheme } from '@/hooks/useTheme'

// Layout
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar }  from '@/components/layout/TopBar'

// Auth
import { AuthScreen } from '@/components/auth/AuthScreen'

// Views
import { TodayView }                        from '@/components/calendar/TodayView'
import { CalendarMonthView, AgendaView }    from '@/components/calendar/CalendarViews'
import { SearchView }                       from '@/components/calendar/SearchView'
import { ChatView }                         from '@/components/chat/ChatView'
import { SettingsView }                     from '@/components/settings/SettingsView'

// Modals
import { EventModal } from '@/components/events/EventModal'

const VIEWS = {
  today:    TodayView,
  calendar: CalendarMonthView,
  agenda:   AgendaView,
  chat:     ChatView,
  search:   SearchView,
  settings: SettingsView,
}

// Eine kleine interne Komponente für den Lade-Zustand
function LoadingSpinner({ isDark }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      background: isDark ? '#000' : '#F2F2F7',
      color: isDark ? '#fff' : '#000',
      fontFamily: 'sans-serif'
    }}>
      {/* Einfacher CSS-Spinner */}
      <div style={{
        width: '40px',
        height: '40px',
        border: `3px solid ${isDark ? '#333' : '#ddd'}`,
        borderTop: '3px solid #007AFF', // iOS Blau
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '15px'
      }} />
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      <span style={{ fontSize: '14px', opacity: 0.6 }}>Synchronisiere...</span>
    </div>
  )
}

function AuthenticatedApp() {
  const { activeView } = useApp()
  const { s, isDark } = useTheme()

  const ActiveView = VIEWS[activeView] ?? TodayView

  return (
    <div data-theme={isDark ? 'dark' : 'light'} style={s.app}>
      <Sidebar />
      <main style={s.main}>
        <TopBar />
        <div style={s.content}>
          <ActiveView />
        </div>
      </main>
      <EventModal />
    </div>
  )
}

export default function App() {
  // WICHTIG: isLoading muss aus dem Context kommen
  const { user, isLoading } = useApp()
  const { isDark } = useTheme()

  // Hintergrundfarbe für das gesamte Dokument setzen
  document.documentElement.style.background = isDark ? '#000' : '#F2F2F7'

  // SCHRITT 1: Während der Auth-Check läuft, zeigen wir NUR den Spinner
  if (isLoading) {
    return <LoadingSpinner isDark={isDark} />
  }

  // SCHRITT 2: Wenn der Check fertig ist und KEIN User da ist -> Login
  if (!user) {
    return <AuthScreen />
  }

  // SCHRITT 3: Wenn der Check fertig ist und ein User da ist -> App
  return <AuthenticatedApp />
}