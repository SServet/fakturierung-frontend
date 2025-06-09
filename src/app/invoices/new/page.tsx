'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCustomers } from '@/hooks/useCustomers';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/buttons';

export default function NewInvoicePage() {
  const router = useRouter();
  const { customers, isLoading, isError } = useCustomers();
  const [form, setForm] = useState({
    customer_id: '',
    invoice_number: '',
    // Add other invoice fields here if needed
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // POST to /api/invoices
      await api.post('/invoices', {
        customer_id: Number(form.customer_id),
        invoice_number: form.invoice_number,
      });
      router.push('/invoices');
    } catch (err: any) {
      if (err.response?.status === 405) {
        setError('Method Not Allowed: verify the API endpoint and HTTP verb.');
      } else {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  if (isLoading) return <p>Loading customers…</p>;
  if (isError) return <p className="text-error">Failed to load customers.</p>;

  return (
    <Container className="py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-error mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              name="customer_id"
              required
              className="select select-bordered w-full"
              value={form.customer_id}
              onChange={handleChange}
            >
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </option>
              ))}
            </select>
            <Input
              name="invoice_number"
              placeholder="Invoice Number"
              required
              value={form.invoice_number}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full">
              Create Invoice
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
