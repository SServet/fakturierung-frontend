// File: src/app/customers/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useCustomers, CustomerOverview } from '@/hooks/useCustomers';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/buttons';

export default function CustomersPage() {
  const router = useRouter();
  const { customers, isLoading, isError } = useCustomers();

  return (
    <ProtectedRoute>
      <Container className="py-8">
        {/* Header + Add Customer Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-semibold">Customers</h1>
          <Button onClick={() => router.push('/customers/new')}>Add Customer</Button>
        </div>

        {/* Customers List */}
        <Card>
          <CardContent className="overflow-x-auto p-0">
            {isLoading && <p className="p-4">Loading customers…</p>}
            {isError && <p className="p-4 text-error">Failed to load customers.</p>}
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
                  {customers.map((c: CustomerOverview) => (
                    <tr key={c.id}>
                      <td>
                        {c.first_name} {c.last_name}
                      </td>
                      <td>{c.email}</td>
                      <td className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/customers/${c.id}`)}
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
