'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCustomers } from '@/hooks/useCustomers';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/buttons';

interface InvoiceItem {
  id: number;
  itemNumber: string;
  description: string;
  qty: number;
  unitPrice: number;
  taxRate: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const { customers, isLoading: loadingCustomers, isError: errorCustomers } = useCustomers();
  const [form, setForm] = useState({
    customer_id: '',
    invoice_number: '',
    payment_terms: '10 Tage',
    service_from: new Date().toISOString().slice(0, 10),
    service_to: new Date().toISOString().slice(0, 10),
  });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'customer_search') {
      setSearchTerm(value);
      // reset customer_id when typing
      setForm(prev => ({ ...prev, customer_id: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const selectCustomer = (id: number, name: string) => {
    setForm(prev => ({ ...prev, customer_id: String(id) }));
    setSearchTerm(name);
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: prev.length + 1, itemNumber: '', description: '', qty: 1, unitPrice: 0, taxRate: 19 },
    ]);
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.customer_id) {
      setError('Bitte wählen Sie einen Kunden aus.');
      return;
    }
    try {
      await api.post('/invoices', {
        ...form,
        items,
      });
      router.push('/invoices');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
    }
  };

  if (loadingCustomers) return <p>Loading…</p>;
  if (errorCustomers) return <p className="text-error">Failed to load customers.</p>;

  const filteredCustomers = searchTerm
    ? customers.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Container className="py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Invoice Creation</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-error mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Data */}
              <div className="relative">
                <h3 className="font-medium mb-2">Customer Data</h3>
                <Input
                  name="customer_search"
                  placeholder="Search Customer"
                  value={searchTerm}
                  onChange={handleChange}
                  className="w-full"
                />
                {filteredCustomers.length > 0 && (
                  <ul className="absolute z-10 bg-base-100 w-full mt-1 border border-base-300 max-h-40 overflow-auto">
                    {filteredCustomers.map(c => (
                      <li
                        key={c.id}
                        onClick={() => selectCustomer(c.id, `${c.first_name} ${c.last_name}`)}
                        className="px-4 py-2 hover:bg-base-200 cursor-pointer"
                      >
                        {c.first_name} {c.last_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Invoice Data */}
              <div>
                <h3 className="font-medium mb-2">Invoice Data</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Invoice Number</span>
                    </label>
                    <Input
                      name="invoice_number"
                      placeholder="Invoice Number"
                      required
                      value={form.invoice_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Terms</span>
                    </label>
                    <Input
                      name="payment_terms"
                      value={form.payment_terms}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Service From</span>
                    </label>
                    <Input
                      type="date"
                      name="service_from"
                      value={form.service_from}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Service To</span>
                    </label>
                    <Input
                      type="date"
                      name="service_to"
                      value={form.service_to}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h3 className="font-medium mb-2">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Item#</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Tax Rate</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <th>{item.id}</th>
                        <td>
                          <Input
                            className="w-full"
                            value={item.itemNumber}
                            onChange={e => updateItem(item.id, 'itemNumber', e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            className="w-full"
                            value={item.description}
                            onChange={e => updateItem(item.id, 'description', e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className="w-20"
                            value={item.qty}
                            onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            step="0.01"
                            className="w-24"
                            value={item.unitPrice}
                            onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <select
                            className="select select-bordered w-24"
                            value={item.taxRate}
                            onChange={e => updateItem(item.id, 'taxRate', Number(e.target.value))}
                          >
                            <option value={19}>19%</option>
                            <option value={7}>7%</option>
                            <option value={0}>0%</option>
                          </select>
                        </td>
                        <td>
                          {(item.qty * item.unitPrice * (1 + item.taxRate / 100)).toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button type="button" className="mt-4 btn-accent" onClick={addItem}>
                Add Item
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Create Invoice
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}