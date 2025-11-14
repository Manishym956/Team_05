import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const savedUser = localStorage.getItem('user');

    if (accessToken && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (googleToken) => {
    try {
      setLoading(true);
      setError(null);

      console.log('AuthContext: Sending Google token to backend...');
      
      // Send Google token to backend
      const response = await api.post('/api/auth/google', { token: googleToken });

      console.log('AuthContext: Backend response received:', response.data);

      const { user: userData, accessToken, refreshToken } = response.data;

      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('AuthContext: Tokens stored in localStorage');
      
      setUser(userData);
      console.log('AuthContext: User state updated');
      
      return true;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Login failed';
      console.error('AuthContext: Login error -', {
        status: err.response?.status,
        message,
        error: err,
      });
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Call logout endpoint
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/api/auth/refresh', {
        refreshToken: storedRefreshToken,
      });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      return accessToken;
    } catch (err) {
      // If refresh fails, logout
      await logout();
      throw err;
    }
  }, [logout]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};