import { createContext, useContext, useReducer, useCallback } from 'react'
import { SAMPLE_EVENTS, DEFAULT_SETTINGS } from '@/constants'
import { today, generateId } from '@/utils'

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const AppContext = createContext(null)

// ─────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────
const ACTIONS = {
  SET_USER:          'SET_USER',
  LOGOUT:            'LOGOUT',
  SET_VIEW:          'SET_VIEW',
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  ADD_EVENT:         'ADD_EVENT',
  UPDATE_EVENT:      'UPDATE_EVENT',
  DELETE_EVENT:      'DELETE_EVENT',
  UPDATE_SETTING:    'UPDATE_SETTING',
  OPEN_EVENT_MODAL:  'OPEN_EVENT_MODAL',
  CLOSE_EVENT_MODAL: 'CLOSE_EVENT_MODAL',
  OPEN_NEW_EVENT:    'OPEN_NEW_EVENT',
}

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────
const initialState = {
  user:             null,
  activeView:       'today',
  selectedDate:     today(),
  events:           SAMPLE_EVENTS,
  settings:         DEFAULT_SETTINGS,
  // Modal state
  eventModal: {
    open:  false,
    event: null,
    mode:  'view', // 'view' | 'create'
  },
}

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────
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

    case ACTIONS.ADD_EVENT: {
      const newEvent = { ...action.payload, id: generateId() }
      return { ...state, events: [...state.events, newEvent] }
    }

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
        eventModal: {
          open: true,
          event: null,
          mode: 'create',
        },
      }

    default:
      return state
  }
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // ── Auth ──
  const login  = useCallback((user) => dispatch({ type: ACTIONS.SET_USER, payload: user }), [])
  const logout = useCallback(()      => dispatch({ type: ACTIONS.LOGOUT }), [])

  // ── Navigation ──
  const setView = useCallback((view) => dispatch({ type: ACTIONS.SET_VIEW, payload: view }), [])
  const setSelectedDate = useCallback((date) => dispatch({ type: ACTIONS.SET_SELECTED_DATE, payload: date }), [])

  // ── Events ──
  const addEvent = useCallback((event) =>
    dispatch({ type: ACTIONS.ADD_EVENT, payload: event }), [])

  const updateEvent = useCallback((event) =>
    dispatch({ type: ACTIONS.UPDATE_EVENT, payload: event }), [])

  const deleteEvent = useCallback((id) =>
    dispatch({ type: ACTIONS.DELETE_EVENT, payload: id }), [])

  const saveEvent = useCallback((form) => {
    if (form.id) updateEvent(form)
    else         addEvent(form)
  }, [addEvent, updateEvent])

  // ── Settings ──
  const updateSetting = useCallback((key, value) =>
    dispatch({ type: ACTIONS.UPDATE_SETTING, payload: { key, value } }), [])

  // ── Modals ──
  const openEventModal = useCallback((event, mode = 'view') =>
    dispatch({ type: ACTIONS.OPEN_EVENT_MODAL, payload: { event, mode } }), [])

  const closeEventModal = useCallback(() =>
    dispatch({ type: ACTIONS.CLOSE_EVENT_MODAL }), [])

  const openNewEvent = useCallback((date) =>
    dispatch({ type: ACTIONS.OPEN_NEW_EVENT, payload: date }), [])

  const value = {
    // State
    ...state,
    isDark: state.settings.darkMode,
    // Actions
    login,
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

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}