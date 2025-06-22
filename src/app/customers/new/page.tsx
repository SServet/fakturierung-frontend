// File: src/app/customers/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCustomers, CustomerOverview } from '@/hooks/useCustomers';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/buttons';

export default function NewCustomerPage() {
  const router = useRouter();
  const { customers, isLoading, isError } = useCustomers();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/customers', form);
      router.push('/customers');
    } catch (err: any) {
      if (err.response?.status === 405) {
        setError('Method Not Allowed: verify endpoint & HTTP verb.');
      } else {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <Container className="py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create New Customer</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-error mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="first_name"
              placeholder="First Name"
              required
              value={form.first_name}
              onChange={handleChange}
            />
            <Input
              name="last_name"
              placeholder="Last Name"
              required
              value={form.last_name}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full">
              Create Customer
            </Button>
          </form>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Existing Customers</h2>
            {isLoading && <p>Loading…</p>}
            {isError && <p className="text-error">Failed to load.</p>}
            {!isLoading && !isError && (
              <ul className="space-y-2">
                {customers.map((c: CustomerOverview) => (
                  <li key={c.id} className="flex justify-between">
                    <span>
                      {c.company_name}
                    </span>
                    <span className="text-sm text-gray-500">{c.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
