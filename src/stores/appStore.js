import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // UI State
  sidebarCollapsed: false,
  theme: 'blackboxz',
  loading: false,
  
  // Notifications
  notifications: [],
  
  // Actions
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  setTheme: (theme) => set({ theme }),
  
  setLoading: (loading) => set({ loading }),
  
  // Notification actions
  addNotification: (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))
    
    // Auto remove notification
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] })
}))