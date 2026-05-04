import { api } from './api';



export const authService = {
    async login(email, password) {
    try {
        const response = await api.post('/auth/login/', { email, password });
        
        // WICHTIG: Prüfen, ob response existiert
        if (response && response.token) {
        localStorage.setItem('token', response.token);
        return response.user; // Gib den User zurück
        } else {
        throw new Error('Kein Token in der Antwort erhalten');
        }
    } catch (error) {
        console.error('Login Error in authService:', error);
        throw error; // Reiche den Fehler an die UI weiter
    }
    },

  async register(name, email, password) {
    const response = await api.post('/auth/register/', { name, email, password });
    const data = response.data;
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data.user;
  },

  logout() {
    localStorage.removeItem('token');
    // Seite neu laden, um alle States im Speicher zu löschen
    window.location.href = '/login';
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    // Gibt true zurück, wenn ein Token existiert, sonst false
    return !!this.getToken();
  },

  // Hilfsfunktion: Holt die aktuellen User-Daten vom Server (für Page Reloads)
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Ruft die neue Django-Route auf
      const response = await api.get('/auth/me/');
      return response.user; 
    } catch (error) {
      console.error("Fehler beim Abrufen des Users:", error);
      return null;
    }
  }
};