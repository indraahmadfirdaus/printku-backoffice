import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useKioskStore = create(
  persist(
    (set, get) => ({
      // State
      selectedKiosks: [],
      filters: {
        search: '',
        status: 'all', // all, online, offline
        location: ''
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      
      // Actions
      setSelectedKiosks: (kiosks) => set({ selectedKiosks: kiosks }),
      
      addSelectedKiosk: (kiosk) => set((state) => ({
        selectedKiosks: [...state.selectedKiosks, kiosk]
      })),
      
      removeSelectedKiosk: (kioskId) => set((state) => ({
        selectedKiosks: state.selectedKiosks.filter(k => k.id !== kioskId)
      })),
      
      clearSelectedKiosks: () => set({ selectedKiosks: [] }),
      
      // Filters
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      setSearch: (search) => set((state) => ({
        filters: { ...state.filters, search }
      })),
      
      setStatus: (status) => set((state) => ({
        filters: { ...state.filters, status }
      })),
      
      setLocation: (location) => set((state) => ({
        filters: { ...state.filters, location }
      })),
      
      clearFilters: () => set({
        filters: {
          search: '',
          status: 'all',
          location: ''
        }
      }),
      
      // Pagination
      setPagination: (pagination) => set((state) => ({
        pagination: { ...state.pagination, ...pagination }
      })),
      
      setPage: (page) => set((state) => ({
        pagination: { ...state.pagination, page }
      })),
      
      setLimit: (limit) => set((state) => ({
        pagination: { ...state.pagination, limit, page: 1 }
      })),
      
      setTotal: (total) => set((state) => ({
        pagination: { ...state.pagination, total }
      }))
    }),
    {
      name: 'kiosk-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination
      })
    }
  )
)