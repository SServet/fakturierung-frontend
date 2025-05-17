// File: src/app/clients/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useCustomers } from '@/hooks/useCustomer'
import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ClientsPage() {
  const router = useRouter()
  const { customers, isLoading, isError } = useCustomers()

  return (
    <Container className="py-8">
      {/* Header + Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-semibold">Clients</h1>
        <Button onClick={() => router.push('/clients/new')}>Add Client</Button>
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          {isLoading && <p className="p-4">Loading clients…</p>}
          {isError && <p className="p-4 text-red-600">Failed to load clients.</p>}
          {!isLoading && !isError && (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td>
                      {c.first_name} {c.last_name}
                    </td>
                    <td>{c.email}</td>
                    <td className="text-right">
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
