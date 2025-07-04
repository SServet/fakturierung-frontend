// File: src/app/invoices/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCustomers, CustomerOverview } from '@/hooks/useCustomers';
import { useArticles, ArticleOption } from '@/hooks/useArticles';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ArticleItem {
  id: number;
  article_id: string;
  description: string;
  amount: number;
  unit_price: number;
  percent_discount: number;
  euro_discount: number;
  tax_rate: number;
  net_price: number;
  tax_amount: number;
  gross_price: number;
}

interface InvoiceDetail {
  id: number;
  invoice_number: string;
  customer: { id: number };
  articles: ArticleItem[];
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

export default function Page() {
  const router = useRouter();
  const { id } = useParams() as { id?: string };
  const { user, initializing } = useAuth();
  const shouldFetch = !initializing && !!user && !!id;

  // Fetch existing invoice
  const fetchInvoice = () => api.get<InvoiceResponse>(`/invoices/${id}`).then(r => r.data.invoice);
  const { data: invoice, error: invoiceError } = useSWR<InvoiceDetail>(
    shouldFetch ? `/invoices/${id}` : null,
    fetchInvoice
  );

  // Fetch available articles
  const { articles: allArticles, isLoading: articlesLoading } = useArticles();
  const { customers } = useCustomers();

  const [originalIds, setOriginalIds] = useState<number[]>([]);
  const [form, setForm] = useState({
    customer_id: '',
    date: '',
    articles: [] as ArticleItem[],
  });

  // Initialize form
  useEffect(() => {
    if (invoice) {
      setOriginalIds(invoice.articles.map(a => a.id));
      setForm({
        customer_id: String(invoice.customer.id),
        date: invoice.created_at.split('T')[0],
        articles: invoice.articles.map(a => ({ ...a })),
      });
    }
  }, [invoice]);

  // Handlers
  const handleCancel = () => router.push(`/invoices/${id}`);

  const handleChange = (index: number, field: keyof ArticleItem, value: any) => {
    setForm(prev => {
      const articles = [...prev.articles];
      articles[index] = { ...articles[index], [field]: value };
      return { ...prev, articles };
    });
  };

  const handleAdd = () => setForm(prev => ({
    ...prev,
    articles: [
      ...prev.articles,
      {
        id: Date.now(),
        article_id: '',
        description: '',
        amount: 1,
        unit_price: 0,
        percent_discount: 0,
        euro_discount: 0,
        tax_rate: 0,
        net_price: 0,
        tax_amount: 0,
        gross_price: 0,
      },
    ],
  }));

  const handleRemove = (i: number) => setForm(prev => ({
    ...prev,
    articles: prev.articles.filter((_, idx) => idx !== i),
  }));

  const handleSelect = (i: number, value: string) => {
    const found = allArticles.find(a => `${a.ean} - ${a.description}` === value);
    if (found) handleChange(i, 'article_id', found.id.toString());
  };

  const compute = (a: ArticleItem) => {
    const net = a.amount * a.unit_price * (1 - a.percent_discount);
    const taxAmt = (net - a.euro_discount) * a.tax_rate;
    return {
      net_price: net,
      tax_amount: taxAmt,
      gross_price: net - a.euro_discount + taxAmt,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = form.articles.map(a => ({ ...a, ...compute(a) }));
    const subtotal = updated.reduce((sum, a) => sum + a.net_price - a.euro_discount, 0);
    const tax_total = updated.reduce((sum, a) => sum + a.tax_amount, 0);
    const total_discount = updated.reduce(
      (sum, a) => sum + a.euro_discount + a.amount * a.unit_price * a.percent_discount,
      0
    );
    const total = subtotal + tax_total;
    await api.put(`/invoices/${id}`, {
      customer_id: Number(form.customer_id),
      created_at: form.date,
      articles: updated,
      subtotal,
      tax_total,
      total_discount,
      total,
    });
    router.push(`/invoices/${id}`);
  };

  const loading = initializing || (shouldFetch && !invoice) || articlesLoading;
  if (loading) return <p className="p-4">Loading invoice…</p>;
  if (invoiceError || !invoice) return <p className="p-4 text-error">Failed to load invoice.</p>;

  return (
    <ProtectedRoute>
      <Container className="py-8">
        <header className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Edit Invoice {invoice.invoice_number}</h1>
          <div className="space-x-2">
            <button className="btn btn-outline" onClick={handleCancel}>Cancel</button>
            {!invoice.published && (
              <button
                className="btn btn-secondary"
                onClick={() =>
                  api
                    .put(`/invoices/publish/${id}`, {
                      invoice_id: id,
                      invoice_number: invoice.invoice_number,
                    })
                    .then(() => router.push(`/invoices/${id}`))
                }
              >
                Publish
              </button>
            )}
          </div>
        </header>
        <Card className="max-w-3xl mx-auto">
          <CardHeader />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Customer</label>
                  <select
                    className="select select-bordered w-full"
                    value={form.customer_id}
                    onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}
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
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <datalist id="article-list">
                  {allArticles.map(a => (
                    <option key={a.id} value={`${a.ean} - ${a.description}`} />
                  ))}
                </datalist>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Unit Price (€)</th>
                      <th>Disc %</th>
                      <th>Disc €</th>
                      <th>Tax %</th>
                      <th>Net (€)</th>
                      <th>Tax (€)</th>
                      <th>Gross (€)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.articles.map((itm, i) => {
                      const { net_price, tax_amount, gross_price } = compute(itm);
                      return (
                        <tr key={i}>
                          <td>
                            {originalIds.includes(itm.id) ? (
                              <input
                                disabled
                                className="input input-bordered w-full"
                                value={itm.description}
                              />
                            ) : (
                              <input
                                list="article-list"
                                className="input input-bordered w-full"
                                defaultValue={itm.description}
                                onBlur={e => handleSelect(i, e.target.value)}
                                placeholder="EAN or name"
                                required
                              />
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input input-bordered w-full"
                              value={itm.amount}
                              onChange={e => handleChange(i, 'amount', Number(e.target.value))}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input input-bordered w-full"
                              value={itm.unit_price}
                              onChange={e => handleChange(i, 'unit_price', Number(e.target.value))}
                              disabled={originalIds.includes(itm.id)}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input input-bordered w-full"
                              value={itm.percent_discount * 100}
                              onChange={e => handleChange(i, 'percent_discount', Number(e.target.value) / 100)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input input-bordered w.full"
                              value={itm.euro_discount}
                              onChange={e => handleChange(i, 'euro_discount', Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="input input-bordered w.full"
                              value={itm.tax_rate * 100}
                              onChange={e => handleChange(i, 'tax_rate', Number(e.target.value)/100)}
                            />
                          </td>
                          <td>€{net_price.toFixed(2)}</td>
                          <td>€{tax_amount.toFixed(2)}</td>
                          <td>€{gross_price.toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => handleRemove(i)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button
                  type="button"
                  className="btn btn-outline mt-2"
                  onClick={handleAdd}
                >
                  Add Article
                </button>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
