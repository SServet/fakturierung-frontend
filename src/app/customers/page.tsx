// File: src/app/clients/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useCustomers } from '@/hooks/useCustomer'
import { Container } from '@/components/ui/container'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ClientsPage() {
  const router = useRouter()
  const { customers, isLoading, isError } = useCustomers()

  return (
    <Container className="py-8">
      {/* Header + Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-semibold">Clients</h1>
        <Button onClick={() => router.push('/clients/new')}>
          Add Client
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          {isLoading && <p className="p-4">Loading clients…</p>}
          {isError && <p className="p-4 text-red-600">Failed to load clients.</p>}
          {!isLoading && !isError && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {c.first_name} {c.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {c.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/clients/${c.id}`)}
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
