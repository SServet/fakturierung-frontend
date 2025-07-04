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
  article_id: string;
  description: string;
  amount: number;
  unit_price: number;
  tax_rate: number;
  net_price: number;
  percent_discount: number;
  euro_discount: number;
  tax_amount: number;
  gross_price: number;
}

interface CustomerDetail {
  id: number;
  company_name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  homepage: string;
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  mobile_number: string;
  saluatation: string;
  title: string;
}

interface InvoiceDetail {
  id: number;
  invoice_number: string;
  customer: CustomerDetail;
  articles: Article[];
  subtotal: number;
  tax_total: number;
  total_discount: number;
  total: number;
  draft: boolean;
  published: boolean;
  created_at: string;
}

interface InvoiceResponse {
  invoice: InvoiceDetail;
  message: string;
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id?: string };
  const { user, initializing } = useAuth();
  const shouldFetch = !initializing && !!user && !!id;

  const fetcher = () =>
    api.get<InvoiceResponse>(`/invoices/${id}`).then(res => res.data.invoice);

  const { data: invoice, error } = useSWR<InvoiceDetail>(
    shouldFetch ? `/invoices/${id}` : null,
    fetcher
  );

  const isLoading = initializing || (shouldFetch && !invoice && !error);

  if (isLoading) return <p className="p-4">Loading invoice…</p>;
  if (!shouldFetch) return null;
  if (error || !invoice) return <p className="p-4 text-error">Failed to load invoice.</p>;

  const safeFormat = (val: unknown, digits = 2) =>
    typeof val === 'number' ? val.toFixed(digits) : '—';

  const safeString = (val: unknown) =>
    typeof val === 'string' && val.trim() !== '' ? val : '—';

  const createdDate = (() => {
    if (!invoice?.created_at) return '—';
    const iso = invoice.created_at.replace(/\.(\d{3})\d+Z$/, '.$1Z');
    const dateObj = new Date(iso);
    return isNaN(dateObj.getTime()) ? 'Invalid date' : dateObj.toLocaleDateString();
  })();

  const customer = invoice.customer || {};

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
                onClick={() => router.push(`/invoices/${id}/edit`)}>
                Edit Invoice
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  api.put(`/invoices/publish/${id}`, {
                      invoice_id: id,
                      invoice_number: invoice.invoice_number,
                    }).then(() => router.refresh())
                }>
                Publish
              </Button>
            </>
          )}
        </div>

        {/* Invoice Summary */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Invoice {safeString(invoice.invoice_number)}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <dt className="font-medium">Customer</dt>
              <dd>{safeString(customer.company_name)}</dd>
              <dt className="font-medium">Address</dt>
              <dd>
                {safeString(customer.address)}, {safeString(customer.zip)}{' '}
                {safeString(customer.city)}
              </dd>
              <dt className="font-medium">Contact</dt>
              <dd>{safeString(customer.email)}</dd>
              <dt className="font-medium">Created</dt>
              <dd>{createdDate}</dd>
              <dt className="font-medium">Subtotal</dt>
              <dd>€{safeFormat(invoice.subtotal)}</dd>
              <dt className="font-medium">Tax Total</dt>
              <dd>€{safeFormat(invoice.tax_total)}</dd>
              <dt className="font-medium">Total Discount</dt>
              <dd>€{safeFormat(invoice.total_discount)}</dd>
              <dt className="font-medium">Total</dt>
              <dd>€{safeFormat(invoice.total)}</dd>
              <dt className="font-medium">Status</dt>
              <dd>{invoice.published ? 'Published' : 'Draft'}</dd>
            </dl>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {Array.isArray(invoice.articles) && invoice.articles.length > 0 ? (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className="text-center">Amount</th>
                    <th className="text-right">Unit Price (€)</th>
                    <th className="text-right">Discount (%)</th>
                    <th className="text-right">Discount (€)</th>
                    <th className="text-right">Tax Rate (%)</th>
                    <th className="text-right">Net Price (€)</th>
                    <th className="text-right">Tax Amount (€)</th>
                    <th className="text-right">Gross Price (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.articles.map(item => (
                    <tr key={item.id}>
                      <td>{safeString(item.description)}</td>
                      <td className="text-center">{item.amount ?? '—'}</td>
                      <td className="text-right">€{safeFormat(item.unit_price)}</td>
                      <td className="text-right">{safeFormat(item.percent_discount * 100)}%</td>
                      <td className="text-right">€{safeFormat(item.euro_discount)}</td>
                      <td className="text-right">{safeFormat(item.tax_rate * 100)}%</td>
                      <td className="text-right">€{safeFormat(item.net_price)}</td>
                      <td className="text-right">€{safeFormat(item.tax_amount)}</td>
                      <td className="text-right">€{safeFormat(item.gross_price)}</td>
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
