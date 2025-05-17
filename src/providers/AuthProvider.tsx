// File: src/providers/AuthProvider.tsx
'use client';

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
} from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  schema: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const res = await api.post<{
      token: string;
      schema: string;
      user: { id: string; name: string; email: string };
    }>('/login', { email, password });

    localStorage.setItem('token', res.data.token);
    setUser({
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      schema: res.data.schema,
    });

    router.push('/dashboard');
  };

  const register = async (data: Record<string, any>) => {
    await api.post('/registration', data);
    router.push('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context
 */
export function useAuth() {
  return useContext(AuthContext);
}
