from .models.calendar_models import SharedCalendars
from rest_framework import serializers

from .models import Events

class EventSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)
    
    endTime = serializers.TimeField(source='end_time', required=False, allow_null=True)
    time = serializers.TimeField(required=False, allow_null=True)
    location = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Events
        # Liste alle Felder auf, die du im Frontend sehen willst
        fields = [
            'id', 
            'title', 
            'time', 
            'endTime', 
            'date', 
            'category', 
            'color', 
            'priority', 
            'location', 
            'notes',
            'user_id',
            'calendar_id'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        for field, value in data.items():
            if value is None:
                data[field] = ""
        
        return data

class SharedCalendarSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = SharedCalendars
        fields = ['id', 'name', 'color', 'icon', 'member_count']