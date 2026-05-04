import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { DEFAULT_SETTINGS } from '@/constants'
import { today, generateId } from '@/utils'
import { authService } from '@/services/auth'
import { eventsService } from '@/services/events'
import { settingsService } from '@/services/settings'

const AppContext = createContext(null)

const ACTIONS = {
  SET_USER:          'SET_USER',
  LOGOUT:            'LOGOUT',
  SET_VIEW:          'SET_VIEW',
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  SET_EVENTS:        'SET_EVENTS',
  ADD_EVENT:         'ADD_EVENT',
  UPDATE_EVENT:      'UPDATE_EVENT',
  DELETE_EVENT:      'DELETE_EVENT',
  SET_SETTINGS:      'SET_SETTINGS',
  UPDATE_SETTING:    'UPDATE_SETTING',
  OPEN_EVENT_MODAL:  'OPEN_EVENT_MODAL',
  CLOSE_EVENT_MODAL: 'CLOSE_EVENT_MODAL',
  OPEN_NEW_EVENT:    'OPEN_NEW_EVENT',
  SET_LOADING:       'SET_LOADING',
}

const initialState = {
  user:             null,
  activeView:       'today',
  selectedDate:     today(),
  events:           [],
  settings:         DEFAULT_SETTINGS,
  loading:          true,
  eventModal: {
    open:  false,
    event: null,
    mode:  'view',
  },
}

function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload, activeView: 'today' }

    case ACTIONS.LOGOUT:
      return { ...initialState }

    case ACTIONS.SET_VIEW:
      return { ...state, activeView: action.payload }

    case ACTIONS.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload }

    case ACTIONS.SET_EVENTS:
      return { ...state, events: action.payload }

    case ACTIONS.ADD_EVENT:
      return { ...state, events: [...state.events, action.payload] }

    case ACTIONS.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      }

    case ACTIONS.DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload),
      }

    case ACTIONS.SET_SETTINGS:
      return { ...state, settings: action.payload }

    case ACTIONS.UPDATE_SETTING:
      return {
        ...state,
        settings: { ...state.settings, [action.payload.key]: action.payload.value },
      }

    case ACTIONS.OPEN_EVENT_MODAL:
      return {
        ...state,
        eventModal: { open: true, event: action.payload.event, mode: action.payload.mode },
      }

    case ACTIONS.CLOSE_EVENT_MODAL:
      return { ...state, eventModal: { open: false, event: null, mode: 'view' } }

    case ACTIONS.OPEN_NEW_EVENT:
      return {
        ...state,
        selectedDate: action.payload || state.selectedDate,
        eventModal: { open: true, event: null, mode: 'create' },
      }

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // ── 1. AUTH INITIALISIERUNG (Beim Neuladen der Seite) ──
  useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = await authService.getCurrentUser();
      if (userData) {
        // Das hier setzt den User wieder in den State!
        dispatch({ type: ACTIONS.SET_USER, payload: userData });
      } else {
        localStorage.removeItem('token'); // Token war wohl alt/kaputt
      }
    }
    // Wichtig: sag der App, dass der Check fertig ist
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
  };

  initAuth();
}, []);

  // ── 2. AUTOMATISCHES LADEN (Wenn User eingeloggt ist) ──
  useEffect(() => {
    if (state.user) {
      loadEvents()
      loadSettings()
    }
  }, [state.user])

  // ── 3. AUTH FUNKTIONEN ──
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      const user = await authService.login(email, password)
      dispatch({ type: ACTIONS.SET_USER, payload: user })
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login fehlgeschlagen: ' + error.message)
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false })
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      const user = await authService.register(name, email, password)
      dispatch({ type: ACTIONS.SET_USER, payload: user })
    } catch (error) {
      console.error('Register failed:', error)
      alert('Registrierung fehlgeschlagen: ' + error.message)
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false })
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    dispatch({ type: ACTIONS.LOGOUT })
  }, [])

  // ── 4. EVENTS FUNKTIONEN ──
  const loadEvents = useCallback(async () => {
    try {
      const events = await eventsService.getAll()
      dispatch({ type: ACTIONS.SET_EVENTS, payload: events })
    } catch (error) {
      console.error('Load events failed:', error)
    }
  }, [])

  const addEvent = useCallback(async (event) => {
    try {
      const newEvent = await eventsService.create(event)
      dispatch({ type: ACTIONS.ADD_EVENT, payload: newEvent })
    } catch (error) {
      console.error('Add event failed:', error)
      alert('Fehler beim Erstellen des Termins')
    }
  }, [])

  const updateEvent = useCallback(async (event) => {
    try {
      const updated = await eventsService.update(event.id, event)
      dispatch({ type: ACTIONS.UPDATE_EVENT, payload: updated })
    } catch (error) {
      console.error('Update event failed:', error)
      alert('Fehler beim Aktualisieren des Termins')
    }
  }, [])

  const deleteEvent = useCallback(async (id) => {
    try {
      await eventsService.delete(id)
      dispatch({ type: ACTIONS.DELETE_EVENT, payload: id })
    } catch (error) {
      console.error('Delete event failed:', error)
      alert('Fehler beim Löschen des Termins')
    }
  }, [])

  const saveEvent = useCallback((form) => {
    if (form.id) updateEvent(form)
    else addEvent(form)
  }, [addEvent, updateEvent])

  // ── 5. SETTINGS FUNKTIONEN ──
  const loadSettings = useCallback(async () => {
    try {
      const settings = await settingsService.get()
      dispatch({ type: ACTIONS.SET_SETTINGS, payload: settings })
    } catch (error) {
      console.error('Load settings failed:', error)
    }
  }, [])

  const updateSetting = useCallback(async (key, value) => {
    dispatch({ type: ACTIONS.UPDATE_SETTING, payload: { key, value } })
    try {
      await settingsService.update({ [key]: value })
    } catch (error) {
      console.error('Update setting failed:', error)
    }
  }, [])

  // ── 6. NAVIGATION & MODALS ──
  const setView = useCallback((view) => dispatch({ type: ACTIONS.SET_VIEW, payload: view }), [])
  const setSelectedDate = useCallback((date) => dispatch({ type: ACTIONS.SET_SELECTED_DATE, payload: date }), [])

  const openEventModal = useCallback((event, mode = 'view') =>
    dispatch({ type: ACTIONS.OPEN_EVENT_MODAL, payload: { event, mode } }), [])

  const closeEventModal = useCallback(() =>
    dispatch({ type: ACTIONS.CLOSE_EVENT_MODAL }), [])

  const openNewEvent = useCallback((date) =>
    dispatch({ type: ACTIONS.OPEN_NEW_EVENT, payload: date }), [])

  // ── VALUE FÜR CONSUMER ──
  const value = {
    ...state,
    // Wir stellen sicher, dass isLoading aus dem Reducer-State kommt
    isLoading: state.loading, 
    isDark: state.settings?.darkMode || false,
    login,
    register,
    logout,
    setView,
    setSelectedDate,
    addEvent,
    updateEvent,
    deleteEvent,
    saveEvent,
    updateSetting,
    openEventModal,
    closeEventModal,
    openNewEvent,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}