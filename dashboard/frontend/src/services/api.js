import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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

