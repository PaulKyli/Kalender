# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class CalendarMembers(models.Model):
    calendar = models.ForeignKey('SharedCalendars', models.DO_NOTHING)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    role = models.CharField(max_length=20, blank=True, null=True)
    joined_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'calendar_members'
        unique_together = (('calendar', 'user'),)


class EventShares(models.Model):
    event = models.ForeignKey('Events', models.DO_NOTHING)
    shared_with_user = models.ForeignKey('Users', models.DO_NOTHING)
    permission = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'event_shares'
        unique_together = (('event', 'shared_with_user'),)


class Events(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    title = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    priority = models.CharField(max_length=20, blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    weather_temp = models.IntegerField(blank=True, null=True)
    weather_condition = models.CharField(max_length=100, blank=True, null=True)
    weather_icon = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    calendar = models.ForeignKey('SharedCalendars', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'events'


class Notifications(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING)
    event = models.ForeignKey(Events, models.DO_NOTHING)
    type = models.CharField(max_length=20, blank=True, null=True)
    scheduled_for = models.DateTimeField()
    sent = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notifications'


class SharedCalendars(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey('Users', models.DO_NOTHING)
    icon = models.CharField(max_length=10, blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'shared_calendars'


class UserSettings(models.Model):
    user = models.OneToOneField('Users', models.DO_NOTHING)
    dark_mode = models.BooleanField(blank=True, null=True)
    religion = models.CharField(max_length=20, blank=True, null=True)
    notifications = models.BooleanField(blank=True, null=True)
    email_reminders = models.BooleanField(blank=True, null=True)
    weather_alerts = models.BooleanField(blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True, null=True)
    location_lat = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    location_lon = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_settings'


class Users(models.Model):
    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    avatar = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
