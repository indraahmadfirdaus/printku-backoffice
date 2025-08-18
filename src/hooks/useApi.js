import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiClient } from '../lib/api'
import { authService } from '../services/authService'

// Custom hook untuk GET requests
export const useApiQuery = (key, url, options = {}) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => apiClient.get(url),
    ...options
  })
}

// Custom hook untuk mutations (POST, PUT, DELETE)
export const useApiMutation = (options = {}) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    ...options,
    onSuccess: (data, variables, context) => {
      // Show success toast
      if (options.successMessage) {
        toast.success(options.successMessage, {
          duration: 3000,
          position: 'top-right',
        })
      }
      
      // Invalidate queries if specified
      if (options.invalidateQueries) {
        queryClient.invalidateQueries(options.invalidateQueries)
      }
      
      // Call original onSuccess
      options.onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      // Show error toast
      if (!options.skipErrorToast) {
        toast.error(error.message || 'Terjadi kesalahan tidak terduga', {
          duration: 4000,
          position: 'top-right',
        })
      }
      
      // Call original onError
      options.onError?.(error, variables, context)
    }
  })
}

// Auth hooks
export const useAuth = () => {
  const loginMutation = useApiMutation({
    mutationFn: authService.login,
    skipErrorToast: true, // Handle error toast manually in Login component
  })
  
  const logoutMutation = useApiMutation({
    mutationFn: authService.logout,
    successMessage: 'Logout berhasil'
  })
  
  return {
    login: loginMutation,
    logout: logoutMutation
  }
}

export const useCustomers = () => {
  const getCustomers = (params = {}) => useApiQuery(
    ['customers', params],
    `/customers?${new URLSearchParams(params)}`
  )
  
  const createCustomer = useApiMutation({
    mutationFn: (data) => apiClient.post('/customers', data),
    successMessage: 'Customer berhasil ditambahkan',
    invalidateQueries: ['customers']
  })
  
  const updateCustomer = useApiMutation({
    mutationFn: ({ id, ...data }) => apiClient.put(`/customers/${id}`, data),
    successMessage: 'Customer berhasil diperbarui',
    invalidateQueries: ['customers']
  })
  
  const deleteCustomer = useApiMutation({
    mutationFn: (id) => apiClient.delete(`/customers/${id}`),
    successMessage: 'Customer berhasil dihapus',
    invalidateQueries: ['customers']
  })
  
  return {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  }
}