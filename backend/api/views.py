from django.conf import settings as django_settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Users, Events, UserSettings  # Deine neuen Models
import jwt
import datetime
import uuid
from .serializer import EventSerializer

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
    
@api_view(['GET', 'POST'])
def events(request):
    user_id = get_user_id_from_request(request)
    
    if not user_id:
        return Response({'error': 'Nicht autorisiert'}, status=401)

    if request.method == 'GET':
        events_qs = Events.objects.filter(user_id=user_id)
        serializer = EventSerializer(events_qs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = EventSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                user_id=user_id,
                id=str(uuid.uuid4())
            )
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
def event_detail(request, event_id):
    user_id = get_user_id_from_request(request)
    
    try:
        event_obj = Events.objects.get(id=event_id, user_id=user_id)
    except Events.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)
    
    if request.method == 'PUT':
        serializer = EventSerializer(event_obj, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data)
        
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        event_obj.delete()
        return Response(status=204)

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
        # .values() macht aus dem Model ein Dictionary für den Response
        from django.forms.models import model_to_dict
        return Response(model_to_dict(settings_obj))
    
    elif request.method == 'PUT':
        data = request.data
        settings_obj.dark_mode = data.get('dark_mode', settings_obj.dark_mode)
        settings_obj.notifications = data.get('notifications', settings_obj.notifications)
        settings_obj.timezone = data.get('timezone', settings_obj.timezone)
        settings_obj.save()
        
        from django.forms.models import model_to_dict
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