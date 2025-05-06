// File: src/providers/AuthProvider.tsx
'use client';

import React, { createContext, useState, ReactNode } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

// Match your Go API's /login user shape + the returned schema
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

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const res = await api.post<{
      token: string;
      schema: string;
      user: { id: string; name: string; email: string };
    }>('/login', { email, password });

    // 1️⃣ Store the JWT for future requests
    localStorage.setItem('token', res.data.token);

    // 2️⃣ Populate `user` state from the response
    setUser({
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      schema: res.data.schema,
    });

    // 3️⃣ Redirect to dashboard
    router.push('/dashboard');
  };

  const register = async (data: Record<string, any>) => {
    await api.post('/registration', data);
    router.push('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
