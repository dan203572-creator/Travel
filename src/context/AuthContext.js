import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_AUTH = axios.create({
  baseURL: 'http://localhost:8000/api/auth',
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    if (token) {
      // Устанавливаем токен для всех запросов
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      API_AUTH.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await API_AUTH.get('/me');
      setUser(response.data);
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
      localStorage.removeItem('access_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await API_AUTH.post('/login', formData);
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      await loadUser();
      return { success: true };
    } catch (error) {
      console.error('Ошибка входа:', error);
      return { success: false, error: error.response?.data?.detail || 'Ошибка входа' };
    }
  };

  const register = async (username, email, password) => {
    try {
      await API_AUTH.post('/register', { username, email, password });
      return await login(username, password);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { success: false, error: error.response?.data?.detail || 'Ошибка регистрации' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}