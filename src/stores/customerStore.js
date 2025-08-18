import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCustomerStore = create(
  persist(
    (set, get) => ({
      // State
      selectedCustomers: [],
      filters: {
        search: '',
        status: 'all',
        dateRange: null
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },

      // Actions
      setSelectedCustomers: (customers) => set({ selectedCustomers: customers }),
      
      addSelectedCustomer: (customer) => set((state) => ({
        selectedCustomers: [...state.selectedCustomers, customer]
      })),
      
      removeSelectedCustomer: (customerId) => set((state) => ({
        selectedCustomers: state.selectedCustomers.filter(c => c.id !== customerId)
      })),
      
      clearSelectedCustomers: () => set({ selectedCustomers: [] }),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
      })),
      
      resetFilters: () => set({
        filters: {
          search: '',
          status: 'all',
          dateRange: null
        },
        pagination: {
          page: 1,
          limit: 10,
          total: 0
        }
      })
    }),
    {
      name: 'customer-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination
      })
    }
  )
)