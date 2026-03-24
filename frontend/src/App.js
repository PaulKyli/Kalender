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

// ─────────────────────────────────────────────
// View router
// ─────────────────────────────────────────────
const VIEWS = {
  today:    TodayView,
  calendar: CalendarMonthView,
  agenda:   AgendaView,
  chat:     ChatView,
  search:   SearchView,
  settings: SettingsView,
}

// ─────────────────────────────────────────────
// Inner app (authenticated)
// ─────────────────────────────────────────────
function AuthenticatedApp() {
  const { activeView } = useApp()
  const { theme, s, isDark } = useTheme()

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

      {/* Global modals */}
      <EventModal />
    </div>
  )
}

// ─────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────
export default function App() {
  const { user } = useApp()
  const { isDark } = useTheme()

  // Apply background to <html> so there's no flash on load
  document.documentElement.style.background = isDark ? '#000' : '#F2F2F7'

  if (!user) return <AuthScreen />
  return <AuthenticatedApp />
}