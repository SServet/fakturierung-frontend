import useSWR from 'swr'
import api from '@/lib/api'

export interface InvoiceData {
  id: number
  invoice_number: string
  customer: {
    id: number
    company_name: string
    first_name: string
    last_name: string
    email: string
  }
  subtotal: number
  tax_total: number
  total: number
  draft: boolean
  published: boolean
  created_at: string
}

export function useInvoices(): {
  invoices: InvoiceData[]
  isLoading: boolean
  isError: boolean
} {
  const { data, error } = useSWR<{ invoices: InvoiceData[] }, Error>(
    '/invoices',
    () => api.get('/invoices').then(res => res.data)
  )

  return {
    invoices: data?.invoices ?? [],
    isLoading: !error && !data,
    isError: !!error,
  }
}
