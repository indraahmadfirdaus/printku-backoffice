import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    return true
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      
      // Actions
      login: (responseData) => {
        const { token, admin } = responseData
        
        set({
          user: {
            id: admin.id,
            name: admin.full_name,
            email: admin.email,
            role: admin.role
          },
          token,
          isAuthenticated: true,
          loading: false
        })
        
        localStorage.setItem('authToken', token)
        localStorage.setItem('isAuthenticated', 'true')
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false
        })
        localStorage.removeItem('authToken')
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('adminEmail')
      },
      
      setLoading: (loading) => set({ loading }),
      
      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),
      
      // Check if user is authenticated with valid token
      checkAuth: () => {
        const token = localStorage.getItem('authToken')
        const isAuth = localStorage.getItem('isAuthenticated') === 'true'
        
        if (token && isAuth && !isTokenExpired(token)) {
          set({ token, isAuthenticated: true })
          return true
        } else {
          // Clear invalid auth data
          get().logout()
          return false
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)