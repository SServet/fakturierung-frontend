// File: src/hooks/useInvoices.ts
import useSWR from 'swr'
import api from '@/lib/api'

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

export interface Invoice {
    id: number
    invoice_number: string
    customer: {
      id: number
      company_name: string
      first_name: string
      last_name: string
      email: string
    }
    articles: any[] | null
    subtotal: number
    tax_total: number
    total: number
    draft: boolean
    published: boolean
    created_at: string  // ISO timestamp
  }

export function useInvoices(): {
  invoices: Invoice[]
  isLoading: boolean
  isError: boolean
} {
    const { data, error } = useSWR<Invoice[], Error>(
        '/invoice',
        () =>
          api
            .get<{ invoices: Invoice[] }>('/invoices')
            .then(res => res.data.invoices)
      );
      console.log(data)
      return {
        invoices: data ?? [],            // always an array
        isLoading: !error && !data,
        isError: !!error,
      };
}
