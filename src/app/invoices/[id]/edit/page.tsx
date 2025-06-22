// File: src/app/invoices/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCustomers, CustomerOverview } from '@/hooks/useCustomers';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/buttons';

interface Article {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoiceDetail {
  id: number;
  invoice_number: string;
  customer: { id: number };
  articles: Article[];
  subtotal: number;
  draft: boolean;
  published: boolean;
  created_at: string;
}

export default function InvoiceEditPage() {
  const router = useRouter();
  const { id } = useParams() as { id?: string };
  const { user, initializing } = useAuth();
  const shouldFetch = !initializing && !!user && !!id;

  const { data: invData } = useSWR<{ customer: InvoiceDetail }>(
    shouldFetch ? `/invoices/${id}` : null,
    () => api.get(`/invoices/${id}`).then(r => r.data)
  );
  const invoice = invData?.customer;
  const { customers } = useCustomers();

  const [form, setForm] = useState({
    customer_id: '',
    date: '',
    articles: [] as Article[],
  });

  useEffect(() => {
    if (invoice) {
      setForm({
        customer_id: String(invoice.customer.id),
        date: invoice.created_at.split('T')[0],
        articles: invoice.articles,
      });
    }
  }, [invoice]);

  const handlePublish = async () => {
    await api.put(`/invoices/${id}/publish`);
    router.push(`/invoices/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = form.articles.reduce(
      (sum, a) => sum + a.quantity * a.unit_price,
      0
    );
    await api.put(`/invoices/${id}`, {
      customer_id: Number(form.customer_id),
      created_at: form.date,
      articles: form.articles,
      subtotal,
    });
    router.push(`/invoices/${id}`);
  };

  if (!invoice) return <p className="p-4">Loading…</p>;

  return (
    <ProtectedRoute>
      <Container className="py-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Edit Invoice {invoice.invoice_number}
          </h1>
          {!invoice.published && (
            <Button variant="primary" onClick={handlePublish}>
              Publish
            </Button>
          )}
        </header>
        <Card className="max-w-3xl mx-auto">
          <CardHeader />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Customer</label>
                <select
                  name="customer_id"
                  className="select select-bordered w-full"
                  value={form.customer_id}
                  onChange={e =>
                    setForm(f => ({ ...f, customer_id: e.target.value }))
                  }
                  required
                >
                  <option value="">Select…</option>
                  {customers.map((c: CustomerOverview) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Date</label>
                <Input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={e =>
                    setForm(f => ({ ...f, date: e.target.value }))
                  }
                  required
                />
              </div>
              {/* Line items editing... */}
              <div className="mt-6">
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
