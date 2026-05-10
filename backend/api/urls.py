from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login, name='login'),
    path('auth/register/', views.register, name='register'),

    path('events/', views.events, name='events'),
    path('events/<str:event_id>/', views.events, name='events'),
    
    path('settings/', views.settings, name='settings'),

    path('auth/me/', views.get_me, name='get_me'),

    path('calendars/create/', views.create_calendar, name='create_calendar'),
    path('calendars/invite/', views.invite_to_calendar, name='invite_to_calendar'),
    path('calendars/me/', views.get_my_calendars, name='get_my_calendars'),
    path('calendars/<int:calendar_id>/members/', views.manage_calendar_member, name='manage_calendar_member'),
]