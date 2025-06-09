// src/app/customers/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useCustomer } from '@/hooks/useCustomer'
import { Container } from '@/components/ui/container'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/buttons'

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const router = useRouter()
  const { customer, isLoading, isError } = useCustomer(id)

  if (isLoading) {
    return <p className="p-4">Loading customer…</p>
  }
  if (isError || !customer) {
    return (
      <p className="p-4 text-error">
        Failed to load customer details.
      </p>
    )
  }

  return (
    <ProtectedRoute>
      <Container className="py-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/customers')}
          className="mb-4"
        >
          ← Back to Customers
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              {customer.first_name} {customer.last_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <dt className="font-medium">Company</dt>
              <dd>{customer.company_name}</dd>

              <dt className="font-medium">Email</dt>
              <dd>{customer.email}</dd>

              <dt className="font-medium">Address</dt>
              <dd>
                {customer.address}, {customer.city} {customer.zip}
                {customer.country && `, ${customer.country}`}
              </dd>

              {customer.homepage && (
                <>
                  <dt className="font-medium">Homepage</dt>
                  <dd>
                    <a
                      href={customer.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {customer.homepage}
                    </a>
                  </dd>
                </>
              )}

              {customer.uid && (
                <>
                  <dt className="font-medium">UID</dt>
                  <dd>{customer.uid}</dd>
                </>
              )}

              <dt className="font-medium">Phone</dt>
              <dd>{customer.phone_number || '—'}</dd>

              <dt className="font-medium">Mobile</dt>
              <dd>{customer.mobile_number || '—'}</dd>

              {(customer.salutation || customer.title) && (
                <>
                  <dt className="font-medium">Salutation & Title</dt>
                  <dd>
                    {[customer.salutation, customer.title]
                      .filter(Boolean)
                      .join(' ')}
                  </dd>
                </>
              )}
            </dl>
          </CardContent>
        </Card>
      </Container>
    </ProtectedRoute>
  )
}
