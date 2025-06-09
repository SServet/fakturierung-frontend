// src/app/invoices/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useInvoices, InvoiceData } from '@/hooks/useInvoices';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/buttons';

type Filter = '' | 'Published' | 'Draft';

export default function InvoicesPage() {
  const router = useRouter();
  const { invoices, isLoading, isError } = useInvoices();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('');

  const filtered = invoices.filter(inv => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      !filter || (filter === 'Published' ? inv.published : inv.draft);
    return matchesSearch && matchesFilter;
  });

  return (
    <ProtectedRoute>
      <Container className="py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <Button onClick={() => router.push('/invoices/new')}>New Invoice</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by invoice or client"
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-primary"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-primary"
            value={filter}
            onChange={e => setFilter(e.target.value as Filter)}
          >
            <option value="">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <Card>
          <CardContent className="overflow-x-auto p-0">
            {isLoading && <p className="p-4">Loading…</p>}
            {isError && <p className="p-4 text-error">Error loading.</p>}
            {!isLoading && !isError && (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Created</th>
                    <th className="text-right">Total</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv: InvoiceData) => (
                    <tr key={inv.id}>
                      <td>{inv.invoice_number}</td>
                      <td>{inv.customer.company_name}</td>
                      <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td className="text-right">${inv.total.toFixed(2)}</td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            inv.published ? 'badge-success' : 'badge-ghost'
                          }`}
                        >
                          {inv.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/invoices/${inv.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
