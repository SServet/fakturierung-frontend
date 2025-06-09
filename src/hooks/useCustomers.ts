// src/hooks/useCustomers.ts
import useSWR from 'swr'
import api from '@/lib/api'

export interface CustomerOverview {
  id: number
  company_name: string
  first_name: string
  last_name: string
  email: string
}

export function useCustomers(): {
  customers: CustomerOverview[]
  isLoading: boolean
  isError: boolean
} {
  const { data, error } = useSWR<{ customers: CustomerOverview[] }, Error>(
    '/customers',
    () => api.get('/customers').then(res => res.data)
  )

  return {
    customers: data?.customers ?? [],
    isLoading: !error && !data,
    isError: !!error,
  }
}
