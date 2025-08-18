import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { apiClient } from '../lib/api'

// Base hook untuk GET requests dengan caching dan error handling
export const useApiQuery = (key, urlOrFunction, options = {}) => {
  const {
    showErrorToast = true,
    enabled = true,
    params,
    ...queryOptions
  } = options

  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      try {
        // Jika parameter kedua adalah function, panggil function tersebut
        if (typeof urlOrFunction === 'function') {
          return await urlOrFunction()
        }
        
        // Jika parameter kedua adalah string URL, gunakan apiClient.get
        let url = urlOrFunction
        
        // Handle params jika ada
        if (params && typeof params === 'object') {
          const searchParams = new URLSearchParams()
          
          Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              searchParams.append(key, String(value))
            }
          })
          
          const queryString = searchParams.toString()
          if (queryString) {
            url += (url.includes('?') ? '&' : '?') + queryString
          }
        }
        
        return await apiClient.get(url)
      } catch (error) {
        if (showErrorToast) {
          toast.error(error.message || 'Gagal memuat data')
        }
        throw error
      }
    },
    enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...queryOptions
  })
}

// Base hook untuk mutations dengan toast notifications
export const useApiMutation = (options = {}) => {
  const queryClient = useQueryClient()
  
  const {
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
    invalidateQueries = [],
    optimisticUpdate,
    ...mutationOptions
  } = options

  return useMutation({
    ...mutationOptions,
    retry: 0,
    onMutate: async (variables) => {
      // Optimistic updates
      if (optimisticUpdate) {
        await queryClient.cancelQueries(optimisticUpdate.queryKey)
        const previousData = queryClient.getQueryData(optimisticUpdate.queryKey)
        queryClient.setQueryData(optimisticUpdate.queryKey, optimisticUpdate.updater(previousData, variables))
        return { previousData }
      }
      return mutationOptions.onMutate?.(variables)
    },
    onSuccess: (data, variables, context) => {
      // Show success toast
      if (showSuccessToast && successMessage) {
        toast.success(successMessage, {
          duration: 3000,
          position: 'top-right',
        })
      }
      
      // Invalidate and refetch queries
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries(queryKey)
        })
      }
      
      // Call original onSuccess
      mutationOptions.onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(optimisticUpdate.queryKey, context.previousData)
      }
      
      // Show error toast
      if (showErrorToast) {
        const message = errorMessage || error.message || 'Terjadi kesalahan tidak terduga'
        toast.error(message, {
          duration: 4000,
          position: 'top-right',
        })
      }
      
      // Call original onError
      mutationOptions.onError?.(error, variables, context)
    }
  })
}

// Helper function untuk membuat query string yang aman
const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') {
    return ''
  }
  
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

// Generic CRUD hooks factory
export const createCrudHooks = (resource, options = {}) => {
  const {
    baseUrl = `/${resource}`,
    queryKey = resource,
    messages = {}
  } = options

  const defaultMessages = {
    create: `${resource} berhasil ditambahkan`,
    update: `${resource} berhasil diperbarui`,
    delete: `${resource} berhasil dihapus`,
    ...messages
  }

  return {
    // GET all with pagination and filters
    useGetAll: (params = {}) => {
      const queryString = buildQueryString(params)
      return useApiQuery(
        [queryKey, 'list', params],
        `${baseUrl}${queryString}`
      )
    },

    // GET by ID
    useGetById: (id, options = {}) => useApiQuery(
      [queryKey, 'detail', id],
      `${baseUrl}/${id}`,
      {
        enabled: !!id,
        ...options
      }
    ),

    // CREATE
    useCreate: (options = {}) => useApiMutation({
      mutationFn: (data) => apiClient.post(baseUrl, data),
      successMessage: defaultMessages.create,
      invalidateQueries: [[queryKey]],
      ...options
    }),

    // UPDATE
    useUpdate: (options = {}) => useApiMutation({
      mutationFn: ({ id, ...data }) => apiClient.put(`${baseUrl}/${id}`, data),
      successMessage: defaultMessages.update,
      invalidateQueries: [[queryKey]],
      ...options
    }),

    // DELETE
    useDelete: (options = {}) => useApiMutation({
      mutationFn: (id) => apiClient.delete(`${baseUrl}/${id}`),
      successMessage: defaultMessages.delete,
      invalidateQueries: [[queryKey]],
      ...options
    }),

    // BULK DELETE
    useBulkDelete: (options = {}) => useApiMutation({
      mutationFn: (ids) => apiClient.post(`${baseUrl}/bulk-delete`, { ids }),
      successMessage: `${defaultMessages.delete} (${ids?.length || 0} item)`,
      invalidateQueries: [[queryKey]],
      ...options
    })
  }
}