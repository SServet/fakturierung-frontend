// File: src/app/invoices/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/buttons';

interface InvoiceDetail {
  id: number;
  invoice_number: string;
  customer: {
    id: number;
    company_name: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  articles: any[] | null;
  subtotal: number;
  tax_total: number;
  total: number;
  draft: boolean;
  published: boolean;
  created_at: string; // e.g. "2025-04-18T23:50:08.500297Z"
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  if (!id) return null;

  // Fetch from /api/invoices/:id
  const { data, error } = useSWR<InvoiceDetail>(
    `/invoices/${id}`,
    () =>
      api.get(`/invoices/${id}`).then(res => {
        const payload = res.data as any;
        // 1) If backend wrapped under "customer", use that
        if (payload.customer) {
          return payload.customer as InvoiceDetail;
        }
        // 2) Otherwise, fallback to payload.invoice (if you ever switch) or raw
        return (payload.invoice as InvoiceDetail) ?? (payload as InvoiceDetail);
      })
  );

  const invoice = data;
  const isLoading = !invoice && !error;

  if (isLoading) {
    return <p className="p-4">Loading invoice…</p>;
  }
  if (error || !invoice) {
    return <p className="p-4 text-error">Failed to load invoice.</p>;
  }

  // Trim microseconds so JS Date can parse
  let createdDateDisplay = '—';
  if (invoice.created_at) {
    const raw = invoice.created_at;
    const iso = raw.replace(/\.(\d{3})\d+Z$/, '.$1Z');
    const d = new Date(iso);
    createdDateDisplay = isNaN(d.getTime())
      ? 'Invalid date'
      : d.toLocaleDateString();
  }

  const formatMoney = (val: number | undefined): string =>
    typeof val === 'number' ? `$${val.toFixed(2)}` : '—';

  return (
    <ProtectedRoute>
      <Container className="py-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/invoices')}
          className="mb-4"
        >
          ← Back to Invoices
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Invoice {invoice.invoice_number}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <dt className="font-medium">Invoice #</dt>
              <dd>{invoice.invoice_number}</dd>

              <dt className="font-medium">Customer</dt>
              <dd>{invoice.customer.company_name}</dd>

              <dt className="font-medium">Created</dt>
              <dd>{createdDateDisplay}</dd>

              <dt className="font-medium">Subtotal</dt>
              <dd>{formatMoney(invoice.subtotal)}</dd>

              <dt className="font-medium">Tax Total</dt>
              <dd>{formatMoney(invoice.tax_total)}</dd>

              <dt className="font-medium">Total</dt>
              <dd>{formatMoney(invoice.total)}</dd>

              <dt className="font-medium">Status</dt>
              <dd>
                {invoice.published === true
                  ? 'Published'
                  : invoice.draft === true
                  ? 'Draft'
                  : 'Unknown'}
              </dd>
            </dl>
          </CardContent>
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
