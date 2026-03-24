# backend/core/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer
from django.http import JsonResponse

@api_view(["GET"])
def event_list(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

def hello_api(request):
    return JsonResponse({'message': 'Hello from Django!', 'status': 'connected'})
