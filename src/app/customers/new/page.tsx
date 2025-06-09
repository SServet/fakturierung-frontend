'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/buttons';

export default function NewCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: '',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zip: '',
    homepage: '',
    uid: '',
    salutation: '',
    title: '',
    phone_number: '',
    mobile_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/customer', form);
      router.push('/customers');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container className="py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create Customer</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {error && <p className="text-error">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['company_name', 'Company Name', true],
                ['first_name',   'First Name',   true],
                ['last_name',    'Last Name',    true],
                ['email',        'Email',        true],
                ['address',      'Address',      false],
                ['city',         'City',         false],
                ['country',      'Country',      false],
                ['zip',          'ZIP',          false],
                ['homepage',     'Homepage',     false],
                ['uid',          'UID',          false],
                ['salutation',   'Salutation',   false],
                ['title',        'Title',        false],
                ['phone_number', 'Phone',        false],
                ['mobile_number','Mobile',       false],
              ].map(([key, label, req]) => (
                <Input
                  key={key}
                  name={key}
                  type="text"
                  placeholder={label as string}
                  value={(form as any)[key as string]}
                  onChange={handleChange}
                  required={req as boolean}
                />
              ))}
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving…' : 'Save Customer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
