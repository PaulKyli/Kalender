from django.conf import settings as django_settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Users, Events, UserSettings, CalendarMembers, EventShares, SharedCalendars
from django.db.models import Q, Count
import jwt
import datetime
import uuid
from .serializer import EventSerializer, SharedCalendarSerializer
from django.forms.models import model_to_dict
from django.forms.models import model_to_dict
# ─────────────────────────────────────────────
# Auth Endpoints
# ─────────────────────────────────────────────

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        # User aus der Datenbank holen
        user_obj = Users.objects.get(email=email)
        
        # Simpler Passwort-Check (Solltest später auf hash-checks umstellen!)
        if user_obj.password != password:
            return Response({'error': 'Falsche Daten'}, status=401)

        payload = {
            'user_id': user_obj.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }

        token = jwt.encode(payload, django_settings.SECRET_KEY, algorithm='HS256')

        return Response({
            'token': token,
            'user': {
                'id': user_obj.id,
                'email': user_obj.email,
                'name': user_obj.name,
                'avatar': user_obj.avatar
            }
        })
    except Users.DoesNotExist:
        return Response({'error': 'Falsche Daten'}, status=401)

@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    name = request.data.get('name')
    password = request.data.get('password')
    
    if Users.objects.filter(email=email).exists():
        return Response({'error': 'E-Mail bereits registriert'}, status=400)
    
    # User erstellen
    user_obj = Users.objects.create(
        email=email,
        name=name,
        password=password,
        avatar='👤'
    )
    
    # Standard-Einstellungen für neuen User anlegen
    UserSettings.objects.create(user_id=user_obj.id)
    
    return Response({
        'user': {
            'id': user_obj.id,
            'email': user_obj.email,
            'name': user_obj.name,
        },
        'token': 'initial-token-after-reg' # Oder generiere hier direkt einen echten
    }, status=201)

# ─────────────────────────────────────────────
# Events Endpoints
# ─────────────────────────────────────────────
def get_user_id_from_request(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        token = auth_header.replace('Bearer ', '')
        payload = jwt.decode(token, django_settings.SECRET_KEY, algorithms=['HS256'])
        return payload.get('user_id')
    except:
        return None
    
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def events(request, event_id=None):
    user_id = get_user_id_from_request(request)

    if not user_id:
        return Response({'error': 'Nicht autorisiert'}, status=401)

    if event_id:
        try:
            my_groups = CalendarMembers.objects.filter(user_id=user_id).values_list('calendar_id', flat=True)
            event = Events.objects.get(
                Q(id=event_id) & 
                (Q(user_id=user_id) | Q(calendar_id__in=my_groups))
            )
            
            if request.method == 'GET':
                return Response(EventSerializer(event).data)

            elif request.method == 'PUT':
                calendar_id = request.data.get('calendar_id')
                serializer = EventSerializer(event, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save(calendar_id=calendar_id)
                    return Response(serializer.data)
                return Response(serializer.errors, status=400)

            elif request.method == 'DELETE':
                event.delete()
                return Response(status=204)

        except Events.DoesNotExist:
            return Response({'error': 'Termin nicht gefunden'}, status=404)

    else:
        if request.method == 'GET':
            direct_shares = EventShares.objects.filter(shared_with_user_id=user_id).values_list('event_id', flat=True)
            my_groups = CalendarMembers.objects.filter(user_id=user_id).values_list('calendar_id', flat=True)

            events_qs = Events.objects.filter(
                Q(user_id=user_id) | 
                Q(id__in=direct_shares) | 
                Q(calendar_id__in=my_groups)
            ).distinct().values()

            return Response(EventSerializer(events_qs, many=True).data)

        elif request.method == 'POST':
            calendar_id = request.data.get('calendar_id')
            serializer = EventSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(
                    user_id=user_id,
                    id=str(uuid.uuid4()),
                    calendar_id=calendar_id
                )
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

# ─────────────────────────────────────────────
# Settings Endpoints
# ─────────────────────────────────────────────

@api_view(['GET', 'PUT'])
def settings(request):
    user_id = get_user_id_from_request(request)
    
    if not user_id:
        return Response({'error': 'Nicht autorisiert'}, status=401)

    # Settings holen oder erstellen falls nicht da
    settings_obj, created = UserSettings.objects.get_or_create(user_id=user_id)
    
    if request.method == 'GET':
        return Response(model_to_dict(settings_obj))
    
    elif request.method == 'PUT':
        data = request.data
        settings_obj.dark_mode = data.get('dark_mode', settings_obj.dark_mode)
        settings_obj.notifications = data.get('notifications', settings_obj.notifications)
        settings_obj.timezone = data.get('timezone', settings_obj.timezone)
        settings_obj.save()
    
        return Response(model_to_dict(settings_obj))

@api_view(['GET'])
def get_me(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return Response({'error': 'Kein Header'}, status=401)

    token = auth_header.replace('Bearer ', '')

    try:
        payload = jwt.decode(token, django_settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        
        user_obj = Users.objects.get(id=user_id)
        return Response({
            'user': {
                'id': user_obj.id,
                'email': user_obj.email,
                'name': user_obj.name,
                'avatar': user_obj.avatar
            }
        })
    except (jwt.ExpiredSignatureError, jwt.DecodeError, Users.DoesNotExist):
        return Response({'error': 'Token ungültig oder User weg'}, status=401)
    
@api_view(['POST'])
def invite_to_calendar(request):
    owner_id = get_user_id_from_request(request)
    calendar_id = request.data.get('calendar_id')
    guest_email = request.data.get('email')
    
    try:
        calendar = SharedCalendars.objects.get(id=calendar_id, owner_id=owner_id)
        
        guest = Users.objects.get(email=guest_email)

        CalendarMembers.objects.get_or_create(
            calendar=calendar,
            user=guest,
            defaults={'role': 'member', 'joined_at': datetime.datetime.now()}
        )
        
        return Response({'message': f'{guest.name} wurde zum Kalender hinzugefügt!'}, status=201)
        
    except SharedCalendars.DoesNotExist:
        return Response({'error': 'Kalender nicht gefunden oder kein Zugriff'}, status=404)
    except Users.DoesNotExist:
        return Response({'error': 'User mit dieser E-Mail existiert nicht'}, status=404)
    

@api_view(['POST'])
def create_calendar(request):
    user_id = get_user_id_from_request(request)
    if not user_id:
        return Response({'error': 'Nicht autorisiert'}, status=401)
    
    name = request.data.get('name')
    color = request.data.get('color', '#0000FF')  # Default-Farbe Blau
    
    new_calendar = SharedCalendars.objects.create(
        name=name,
        owner_id=user_id, # Die Spalte heißt owner_id in der DB
        color=color,
        created_at=datetime.datetime.now()
    )

    CalendarMembers.objects.create(
        calendar=new_calendar,
        user_id=user_id,
        role='owner',
        joined_at=datetime.datetime.now()
    )
    
    return Response({'id': new_calendar.id, 'name': new_calendar.name}, status=201)

@api_view(['GET'])
def get_my_calendars(request):
    user_id = get_user_id_from_request(request) 
    
    if not user_id:
        return Response({'error': 'Nicht autorisiert'}, status=401)

    calendars = SharedCalendars.objects.filter(
        Q(owner_id=user_id) | Q(calendarmembers__user_id=user_id)
    ).annotate(
        member_count=Count('calendarmembers', distinct=True)
    )
    
    serializer = SharedCalendarSerializer(calendars, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST', 'DELETE'])
def manage_calendar_member(request, calendar_id):
    user_id = get_user_id_from_request(request)
    
    if not user_id:
        return Response({'error': 'Nicht autorisiert'}, status=401)

    if request.method == 'GET':
        try:
            members = CalendarMembers.objects.filter(calendar_id=calendar_id).select_related('user')
            
            data = []
            for m in members:
                data.append({
                    'id': m.user.id,
                    'name': m.user.name,
                    'email': m.user.email
                })
            return Response(data, status=200)
        except Exception as e:
            print(f"Fehler in GET members: {e}") # Das erscheint in deinem Terminal
            return Response({'error': str(e)}, status=500)

    elif request.method == 'POST':
        email = request.data.get('email')
        try:
            user_to_add = Users.objects.get(email=email)
            if CalendarMembers.objects.filter(calendar_id=calendar_id, user_id=user_to_add.id).exists():
                return Response({'error': 'Nutzer ist bereits im Kalender'}, status=400)
            
            CalendarMembers.objects.create(calendar_id=calendar_id, user_id=user_to_add.id)
            return Response({'message': 'Erfolgreich hinzugefügt'}, status=201)
        except Users.DoesNotExist:
            return Response({'error': 'Kein Nutzer mit dieser E-Mail gefunden'}, status=404)

    elif request.method == 'DELETE':
        target_user_id = request.data.get('user_id')
        if not target_user_id:
            return Response({'error': 'Keine User ID angegeben'}, status=400)
            
        CalendarMembers.objects.filter(calendar_id=calendar_id, user_id=target_user_id).delete()
        return Response({'message': 'Mitglied entfernt'}, status=200)