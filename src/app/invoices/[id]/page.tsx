// File: src/app/invoices/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/buttons';

interface Article {
  id: number;
  description: string;
  amount: number;
  unit_price: number;
  net_price: number;
  tax_rate: number;
  tax_amount: number;
  gross_price: number;
}

interface InvoiceDetail {
  id: number;
  invoice_number: string;
  customer: { id: number; company_name: string };
  articles: Article[] | null;
  subtotal: number;
  tax_total: number;
  total: number;
  draft: boolean;     // you can drop this if unused
  published: boolean;
  created_at: string;
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id?: string };
  const { user, initializing } = useAuth();
  const shouldFetch = !initializing && !!user && !!id;

  const { data, error } = useSWR<{ customer: InvoiceDetail }>(
    shouldFetch ? `/invoices/${id}` : null,
    () => api.get(`/invoices/${id}`).then(r => r.data)
  );

  const invoice = data?.customer;
  const isLoading = initializing || (shouldFetch && !invoice && !error);

  const formatEuro = (v?: number) =>
    typeof v === 'number' ? `€${v.toFixed(2)}` : '—';

  const formatPercent = (v?: number) =>
    typeof v === 'number' ? `${(v * 100).toFixed(2)}%` : '—';

  const handlePublish = async (invoiceId: number) => {
    await api.put(`/invoices/${invoiceId}/publish`);
    router.refresh();
  };

  if (isLoading) return <p className="p-4">Loading invoice…</p>;
  if (!shouldFetch) return null;
  if (error || !invoice) return <p className="p-4 text-error">Failed to load invoice.</p>;

  let createdDate = '—';
  if (invoice.created_at) {
    const iso = invoice.created_at.replace(/\.(\d{3})\d+Z$/, '.$1Z');
    const d = new Date(iso);
    createdDate = isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString();
  }

  return (
    <ProtectedRoute>
      <Container className="py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => router.push('/invoices')}>
            ← Back to Invoices
          </Button>
          {!invoice.published && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/invoices/${id}/edit`)}
              >
                Edit Invoice
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handlePublish(invoice.id)}
              >
                Publish
              </Button>
            </>
          )}
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Invoice {invoice.invoice_number}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <dt className="font-medium">Customer</dt>
              <dd>{invoice.customer.company_name}</dd>
              <dt className="font-medium">Created</dt>
              <dd>{createdDate}</dd>
              <dt className="font-medium">Subtotal</dt>
              <dd>{formatEuro(invoice.subtotal)}</dd>
              <dt className="font-medium">Tax Total</dt>
              <dd>{formatEuro(invoice.tax_total)}</dd>
              <dt className="font-medium">Total</dt>
              <dd>{formatEuro(invoice.total)}</dd>
              <dt className="font-medium">Status</dt>
              <dd>{invoice.published ? 'Published' : 'Draft'}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {invoice.articles && invoice.articles.length > 0 ? (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Unit Price (€)</th>
                    <th className="text-right">Tax Rate (%)</th>
                    <th className="text-right">Net Price (€)</th>
                    <th className="text-right">Tax Amount (€)</th>
                    <th className="text-right">Gross Price (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.articles.map(item => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td className="text-center">{item.amount}</td>
                      <td className="text-right">{formatEuro(item.unit_price)}</td>
                      <td className="text-right">{formatPercent(item.tax_rate)}</td>
                      <td className="text-right">{formatEuro(item.net_price)}</td>
                      <td className="text-right">{formatEuro(item.tax_amount)}</td>
                      <td className="text-right">{formatEuro(item.gross_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-4">No line items.</p>
            )}
          </CardContent>
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
