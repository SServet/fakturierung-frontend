// src/providers/AuthProvider.tsx
'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  name: string;
  email: string;
  schema: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  initializing: boolean;             // NEW
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);  // NEW
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
    setInitializing(false);  // finished checking localStorage
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{
      token: string;
      schema: string;
      user: { id: string; name: string; email: string };
    }>('/login', { email, password });

    const { token, schema, user: u } = res.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const decoded = jwtDecode<User>(token);
    setUser({ ...decoded, name: u.name, email: u.email, schema });
    router.push('/dashboard');
  };

  const register = async (data: Record<string, any>) => {
    await api.post('/registration', data);
    router.push('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
