"""
In-Memory Data Storage (ohne Datenbank)
Wird beim Server-Neustart zurückgesetzt
"""

from datetime import datetime, timedelta

# Globale In-Memory Storage
USERS = {
    'demo@kalender.app': {
        'email': 'demo@kalender.app',
        'name': 'Demo User',
        'password': 'demo',  # In Production: Hash verwenden!
        'avatar': '👤',
        'id': 1,
    }
}

# Sample Events (mit dynamischen Daten)
def get_date_offset(days):
    return (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d')

EVENTS = {
    1: [  # User ID 1
        {
            'id': '1',
            'title': 'Arzttermin',
            'date': get_date_offset(0),
            'time': '09:30',
            'endTime': '10:00',
            'category': 'health',
            'priority': 'high',
            'location': 'Dr. Mayer Praxis',
            'notes': 'Blutabnahme – nüchtern erscheinen!',
            'color': '#FF2D55',
        },
        {
            'id': '2',
            'title': 'Team Meeting',
            'date': get_date_offset(0),
            'time': '14:00',
            'endTime': '15:30',
            'category': 'work',
            'priority': 'medium',
            'location': 'Konferenzraum A',
            'notes': 'Q4 Planning',
            'color': '#007AFF',
        },
        {
            'id': '3',
            'title': 'Geburtstag Mama',
            'date': get_date_offset(2),
            'time': '18:00',
            'endTime': '22:00',
            'category': 'family',
            'priority': 'high',
            'location': 'Restaurant Seeblick',
            'notes': 'Blumen kaufen!',
            'color': '#FF9500',
        },
    ]
}

SETTINGS = {
    1: {  # User ID 1
        'darkMode': True,
        'religion': 'none',
        'notifications': True,
        'emailReminders': False,
        'weatherAlerts': True,
    }
}

# Hilfsfunktionen
def get_user_by_email(email):
    return USERS.get(email)

def get_user_by_id(user_id):
    users = USERS.values() # Deine Funktion zum Laden der User
    for user in users:
        if str(user['id']) == str(user_id):
            return user
    return None

def get_events(user_id):
    return EVENTS.get(user_id, [])

def add_event(user_id, event):
    if user_id not in EVENTS:
        EVENTS[user_id] = []
    EVENTS[user_id].append(event)
    return event

def update_event(user_id, event_id, updated_data):
    events = EVENTS.get(user_id, [])
    for i, event in enumerate(events):
        if event['id'] == event_id:
            events[i] = {**event, **updated_data}
            return events[i]
    return None

def delete_event(user_id, event_id):
    events = EVENTS.get(user_id, [])
    EVENTS[user_id] = [e for e in events if e['id'] != event_id]
    return True

def get_settings(user_id):
    return SETTINGS.get(user_id, {})

def update_settings(user_id, settings):
    SETTINGS[user_id] = {**SETTINGS.get(user_id, {}), **settings}
    return SETTINGS[user_id]