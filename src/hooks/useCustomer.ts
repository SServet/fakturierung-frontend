// File: src/hooks/useCustomer.ts

import useSWR from 'swr'
import api from '@/lib/api'

export interface CustomerDetail {
  id: number
  company_name: string
  first_name: string
  last_name: string
  email: string
  address: string
  city: string
  country: string
  zip: string
  homepage: string
  uid: string
  salutation: string
  title: string
  phone_number: string
  mobile_number: string
}

export function useCustomer(
  id: string
): {
  customer: CustomerDetail | null
  isLoading: boolean
  isError: boolean
} {
  const { data, error } = useSWR<{ customer: CustomerDetail }, Error>(
    id ? `/customer/${id}` : null,
    () => api.get(`/customer/${id}`).then(res => res.data)
  )

  return {
    customer: data?.customer ?? null,
    isLoading: !error && !data,
    isError: !!error,
  }
}
