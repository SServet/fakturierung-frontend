'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/buttons';

const FIELDS = [
  'first_name','last_name','email','password','password_confirm',
  'company_name','address','city','country','zip','homepage',
  'uid','salutation','title','phone_number','mobile_number',
];

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map(f => [f, ''])));
  const [error, setError] = useState('');

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
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {error && <p className="text-error">{error}</p>}
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
            <Button type="submit" className="md:col-span-2 w-full">Register</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
