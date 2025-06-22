import useSWR from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

export interface InvoiceData {
  id: number;
  invoice_number: string;
  customer: {
    id: number;
    company_name: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  subtotal: number;
  tax_total: number;
  total: number;
  draft: boolean;
  published: boolean;
  created_at: string;
}

export function useInvoices(): {
  invoices: InvoiceData[];
  isLoading: boolean;
  isError: boolean;
} {
  const { user, initializing } = useAuth();
  const shouldFetch = !initializing && !!user;

  const { data, error } = useSWR<{ invoices: InvoiceData[] }, Error>(
    shouldFetch ? '/invoices' : null,
    () => api.get('/invoices').then(r => r.data)
  );

  return {
    invoices: data?.invoices ?? [],
    isLoading: shouldFetch && !data && !error,
    isError: !!error,
  };
}
