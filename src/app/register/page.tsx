// File: src/app/register/page.tsx
'use client';

import { FormEvent, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

const FIELDS = [
  'first_name',
  'last_name',
  'email',
  'password',
  'password_confirm',
  'company_name',
  'address',
  'city',
  'country',
  'zip',
  'homepage',
  'uid',
  'salutation',
  'title',
  'phone_number',
  'mobile_number',
];

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map(f => [f, ''])));
  const [error, setError] = useState('');

  // Redirect authenticated users to homepage
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(form as Record<string, any>);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map(f => (
              <Input
                key={f}
                name={f}
                type={f.includes('password') ? 'password' : 'text'}
                placeholder={f.replace('_', ' ')}
                value={(form as any)[f]}
                onChange={handleChange}
                required
              />
            ))}
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
