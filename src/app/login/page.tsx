// File: src/app/login/page.tsx
'use client';

import { FormEvent, useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md rounded-lg shadow-card overflow-hidden">
        <CardHeader className="bg-white">
          <CardTitle className="text-center text-2xl font-semibold">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-8 space-y-4">
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <Button
              type="submit"
              className="w-full py-3 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800"
            >
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
