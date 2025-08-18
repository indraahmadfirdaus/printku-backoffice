import { useApiQuery } from './useBaseApi'
import { customerService } from '../services/customerService'

export const useCustomers = () => {
  // Get customer overview
  const useCustomerOverview = (options = {}) => useApiQuery(
    ['customers', 'overview'],
    '/customers/overview',
    {
      select: (data) => data?.data || {},
      ...options
    }
  )

  // Get customers list with pagination and filters
  const useCustomersList = (params = {}, options = {}) => useApiQuery(
    ['customers', 'list', params],
    '/customers',
    {
      params,
      select: (data) => ({
        customers: data?.data?.customers || [],
        pagination: data?.data?.pagination || {}
      }),
      ...options
    }
  )

  return {
    useCustomerOverview,
    useCustomersList
  }
}