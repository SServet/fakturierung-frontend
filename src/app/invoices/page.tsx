// File: src/app/invoices/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInvoices, Invoice } from '@/hooks/useInvoices'
import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type StatusFilter = '' | 'Published' | 'Draft'
const STATUS_OPTIONS: StatusFilter[] = ['Published', 'Draft']

export default function InvoicesPage() {
  const router = useRouter()
  const { invoices, isLoading, isError } = useInvoices()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')

  const filtered = invoices.filter(inv => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.company_name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === '' ||
      (statusFilter === 'Published' && inv.published) ||
      (statusFilter === 'Draft' && inv.draft)
    return matchesSearch && matchesStatus
  })

  const badgeClass = (inv: Invoice) =>
    inv.published
      ? 'bg-green-100 text-green-800'
      : inv.draft
      ? 'bg-gray-100 text-gray-800'
      : 'bg-gray-100 text-gray-800'

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Invoices</h1>
        <Button onClick={() => router.push('/invoices/new')}>
          New Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by invoice # or customer"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          {isLoading && <p className="p-4">Loading invoices…</p>}
          {isError && <p className="p-4 text-red-600">Failed to load invoices.</p>}
          {!isLoading && !isError && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((inv: Invoice) => (
                  <tr key={inv.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inv.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inv.customer.company_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      ${inv.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${badgeClass(
                          inv
                        )}`}
                      >
                        {inv.draft ? 'Draft' : inv.published ? 'Published' : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
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
  )
}
