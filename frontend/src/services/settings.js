import { api } from './api'

export const settingsService = {
  async get() {
    return await api.get('/settings/')
  },

  async update(settings) {
    return await api.put('/settings/', settings)
  },
}