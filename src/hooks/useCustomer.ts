import useSWR from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

export interface CustomerDetail {
  id: number;
  company_name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  homepage: string;
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  mobile_number: string;
  salutation: string;
  title: string;
}

export function useCustomer(id: string): {
  customer: CustomerDetail | null;
  isLoading: boolean;
  isError: boolean;
} {
  const { user, initializing } = useAuth();
  const shouldFetch = !initializing && !!user && !!id;

  const { data, error } = useSWR<{ customer: CustomerDetail }, Error>(
    shouldFetch ? `/customers/${id}` : null,
    () => api.get(`/customers/${id}`).then(r => r.data)
  );

  return {
    customer: data?.customer ?? null,
    isLoading: shouldFetch && !data && !error,
    isError: !!error,
  };
}
