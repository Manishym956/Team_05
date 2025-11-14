import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// RAWG API services
export const gamesAPI = {
  getTrending: () => api.get('/api/games/trending'),
  search: (params) => api.get('/api/games/search', { params }),
  getById: (id) => api.get(`/api/games/${id}`),
};

export const analyticsAPI = {
  getGenreStats: () => api.get('/api/genres/stats'),
  getPlatformStats: () => api.get('/api/platforms/stats'),
};

export const metadataAPI = {
  getGenres: () => api.get('/api/genres'),
  getPlatforms: () => api.get('/api/platforms'),
};

// Twitch API services
export const twitchAPI = {
  getTopStreams: () => api.get('/api/twitch/streams/top'),
  getGameStreams: (gameId) => api.get(`/api/twitch/streams/game/${gameId}`),
};

export default api;

