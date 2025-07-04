// File: src/app/invoices/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useInvoices, InvoiceData } from '@/hooks/useInvoices';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/buttons';
import api from '@/lib/api';

export default function InvoicesPage() {
  const router = useRouter();
  const { invoices, isLoading, isError } = useInvoices();

  const formatEuro = (v?: number) =>
    typeof v === 'number' ? `€${v.toFixed(2)}` : '—';

  const taxRate = (sub?: number, tax?: number) =>
    sub && tax != null && sub > 0
      ? `${((tax / sub) * 100).toFixed(2)}%`
      : '—';

  const handlePublish = async (invoiceId: number, invoiceNumber: string) => {
    await api.put(`/invoices/publish/${invoiceId}`, {
                      invoice_id: invoiceId,
                      invoice_number: invoiceNumber,
                    });
    router.refresh();
  };

  return (
    <ProtectedRoute>
      <Container className="py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <Button onClick={() => router.push('/invoices/new')}>New Invoice</Button>
        </div>
        <Card>
          <CardContent className="overflow-x-auto p-0">
            {isLoading && <p className="p-4">Loading invoices…</p>}
            {isError && <p className="p-4 text-error">Failed to load invoices.</p>}
            {!isLoading && !isError && (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Created</th>
                    <th className="text-right">Tax %</th>
                    <th className="text-right">Total (€)</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: InvoiceData) => (
                    <tr key={inv.id}>
                      <td>{inv.invoice_number}</td>
                      <td>{inv.customer.company_name}</td>
                      <td>
                        {new Date(
                          inv.created_at.replace(/\.(\d{3})\d+Z$/, '.$1Z')
                        ).toLocaleDateString()}
                      </td>
                      <td className="text-right">{taxRate(inv.subtotal, inv.tax_total)}</td>
                      <td className="text-right">{formatEuro(inv.total)}</td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            inv.published ? 'badge-success' : 'badge-ghost'
                          }`}
                        >
                          {inv.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/invoices/${inv.id}`)}
                        >
                          View
                        </Button>
                        {!inv.published && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => router.push(`/invoices/${inv.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handlePublish(inv.id, inv.invoice_number)}
                            >
                              Publish
                            </Button>
                          </>
                        )}
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
