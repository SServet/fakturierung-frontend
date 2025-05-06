// src/hooks/useCustomers.ts
import useSWR from 'swr';
import api from '../lib/api';

// 1) Define exactly what a Customer looks like
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  // …any other fields your API includes…
}

// 2) Tell SWR that data will be Customer[]
export function useCustomers(): {
  customers: Customer[];
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error } = useSWR<Customer[], Error>(
    '/customers',
    () =>
      api
        .get<{ customers: Customer[] }>('/customers')
        .then(res => res.data.customers)
  );
  console.log(data)
  return {
    customers: data ?? [],            // always an array
    isLoading: !error && !data,
    isError: !!error,
  };
}
