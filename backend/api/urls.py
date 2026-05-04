from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/login/', views.login, name='login'),
    path('auth/register/', views.register, name='register'),
    
    # Events
    path('events/', views.events, name='events'),
    path('events/<str:event_id>/', views.event_detail, name='event_detail'),
    
    # Settings
    path('settings/', views.settings, name='settings'),

    path('auth/me/', views.get_me, name='get_me'),
]