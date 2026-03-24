// ─────────────────────────────────────────────
// App-wide Constants
// ─────────────────────────────────────────────

export const MONTHS_DE = [
  'Januar','Februar','März','April','Mai','Juni',
  'Juli','August','September','Oktober','November','Dezember',
]

export const DAYS_SHORT_DE = ['Mo','Di','Mi','Do','Fr','Sa','So']

export const RELIGIONS = [
  { id: 'none',      label: 'Keine / Secular',  flag: '🌍' },
  { id: 'christian', label: 'Christlich',        flag: '✝️'  },
  { id: 'islam',     label: 'Islamisch',         flag: '☪️'  },
  { id: 'jewish',    label: 'Jüdisch',           flag: '✡️'  },
  { id: 'buddhist',  label: 'Buddhistisch',      flag: '☸️'  },
]

export const CATEGORIES = [
  { id: 'work',     label: 'Arbeit',      icon: '💼', color: '#007AFF' },
  { id: 'personal', label: 'Persönlich',  icon: '👤', color: '#34C759' },
  { id: 'health',   label: 'Gesundheit',  icon: '❤️', color: '#FF2D55' },
  { id: 'family',   label: 'Familie',     icon: '👨‍👩‍👧', color: '#FF9500' },
  { id: 'travel',   label: 'Reise',       icon: '✈️', color: '#5AC8FA' },
  { id: 'religion', label: 'Religion',    icon: '🕌', color: '#AF52DE' },
  { id: 'other',    label: 'Sonstige',    icon: '📌', color: '#8E8E93' },
]

export const PRIORITIES = [
  { id: 'high',   label: 'Hoch',    color: '#FF3B30' },
  { id: 'medium', label: 'Mittel',  color: '#FF9500' },
  { id: 'low',    label: 'Niedrig', color: '#34C759' },
]

export const NAV_ITEMS = [
  { id: 'today',    icon: '☀️',  label: 'Heute',          accentKey: 'orange' },
  { id: 'calendar', icon: '📅',  label: 'Kalender',       accentKey: 'accent' },
  { id: 'agenda',   icon: '📋',  label: 'Agenda',         accentKey: 'green'  },
  { id: 'chat',     icon: '🤖',  label: 'KI Assistent',   accentKey: 'purple' },
  { id: 'search',   icon: '🔍',  label: 'Suche',          accentKey: 'teal'   },
  { id: 'settings', icon: '⚙️',  label: 'Einstellungen',  accentKey: 'textTertiary' },
]

export const DEFAULT_SETTINGS = {
  darkMode:       true,
  religion:       'none',
  notifications:  true,
  emailReminders: false,
  weatherAlerts:  true,
}

// Offset days relative to today for sample data
const d = (offsetDays) =>
  new Date(Date.now() + 86400000 * offsetDays).toISOString().slice(0, 10)

export const SAMPLE_EVENTS = [
  {
    id: '1',
    title: 'Arzttermin',
    date: d(0),
    time: '09:30',
    endTime: '10:00',
    category: 'health',
    priority: 'high',
    location: 'Dr. Mayer Praxis',
    notes: 'Blutabnahme – nüchtern erscheinen!',
    color: '#FF2D55',
    weather: { temp: 8, condition: 'Bewölkt', icon: '🌥' },
  },
  {
    id: '2',
    title: 'Team Meeting',
    date: d(0),
    time: '14:00',
    endTime: '15:30',
    category: 'work',
    priority: 'medium',
    location: 'Konferenzraum A',
    notes: 'Q4 Planning – Präsentation vorbereiten',
    color: '#007AFF',
    weather: { temp: 8, condition: 'Bewölkt', icon: '🌥' },
  },
  {
    id: '3',
    title: 'Geburtstag Mama',
    date: d(2),
    time: '18:00',
    endTime: '22:00',
    category: 'family',
    priority: 'high',
    location: 'Restaurant Seeblick',
    notes: 'Blumen kaufen nicht vergessen!',
    color: '#FF9500',
    weather: { temp: 12, condition: 'Sonnig', icon: '☀️' },
  },
  {
    id: '4',
    title: 'Yoga',
    date: d(1),
    time: '07:00',
    endTime: '08:00',
    category: 'health',
    priority: 'low',
    location: 'FitCenter',
    notes: '',
    color: '#FF2D55',
    weather: { temp: 5, condition: 'Klar', icon: '🌤' },
  },
  {
    id: '5',
    title: 'Urlaub Planung',
    date: d(5),
    time: '20:00',
    endTime: '21:00',
    category: 'travel',
    priority: 'low',
    location: 'Zuhause',
    notes: 'Flüge & Hotel buchen',
    color: '#5AC8FA',
    weather: { temp: 10, condition: 'Regen', icon: '🌧' },
  },
  {
    id: '6',
    title: 'Design Review',
    date: d(3),
    time: '10:00',
    endTime: '11:00',
    category: 'work',
    priority: 'medium',
    location: 'Remote – Zoom',
    notes: '',
    color: '#007AFF',
    weather: { temp: 9, condition: 'Bewölkt', icon: '⛅' },
  },
]