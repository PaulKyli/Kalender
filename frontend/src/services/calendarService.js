import { api } from './api';

export const calendarService = {
  async getMembers(calendarId) {
    return await api.get(`/calendars/${calendarId}/members/`);
  },

  async addMember(calendarId, email) {
    return await api.post(`/calendars/${calendarId}/members/`, { email });
  },

  async removeMember(calendarId, userId) {
    const response = await api.delete(`/calendars/${calendarId}/members/`, { 
      data: { user_id: userId } 
    });
    return response; 
  },

  async createCalendar(name, color) {
    return await api.post('/calendars/create/', { name, color });
  },
};
