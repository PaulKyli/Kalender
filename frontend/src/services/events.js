import { api } from './api'

export const eventsService = {
  async getAll() {
    return await api.get('/events/');
  },

  async create(eventData) {
    return await api.post('/events/', eventData)
  },

  async update(eventId, eventData) {
    return await api.put(`/events/${eventId}/`, eventData)
  },

  async delete(eventId) {
    return await api.delete(`/events/${eventId}/`)
  },
}
