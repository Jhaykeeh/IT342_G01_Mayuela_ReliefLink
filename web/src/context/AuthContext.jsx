import { createContext, useContext, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const dashboardPath = (role) => `/${role.toLowerCase()}/dashboard`;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    const u = { id: data.userId, fullName: data.fullName, email: data.email, role: data.role };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(data.token);
    setUser(u);
    return u;
  };

  const register = (payload) => api.post('/api/auth/register', payload);

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // token may already be invalid; clear the local session anyway
    } finally {
      clearSession();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);