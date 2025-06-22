import useSWR from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

export interface CustomerOverview {
  id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function useCustomers(): {
  customers: CustomerOverview[];
  isLoading: boolean;
  isError: boolean;
} {
  const { user, initializing } = useAuth();
  const shouldFetch = !initializing && !!user;

  const { data, error } = useSWR<{ customers: CustomerOverview[] }, Error>(
    shouldFetch ? '/customers' : null,
    () => api.get('/customers').then(r => r.data)
  );

  return {
    customers: data?.customers ?? [],
    isLoading: shouldFetch && !data && !error,
    isError: !!error,
  };
}
