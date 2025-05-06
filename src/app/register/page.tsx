// File: src/app/customers/page.tsx
'use client';

import { useCustomers } from '@/hooks/useCustomer';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CustomersPage() {
  const { customers, isLoading, isError } = useCustomers();

  return (
    <Container className="py-8">
      <Card className="rounded-lg shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Your Customers</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 bg-white">
          {isLoading && <p>Loading…</p>}
          {isError && <p className="text-red-600">Failed to load customers.</p>}
          {!isLoading && !isError && customers.map(c => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{c.first_name} {c.last_name}</p>
                <p className="text-sm text-gray-600">{c.email}</p>
              </div>
              <Button className="mt-2 sm:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}
