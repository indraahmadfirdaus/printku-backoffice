import { apiClient } from '../lib/api'

export const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/admin/login', credentials)
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.message || 'Login gagal')
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || error.message || 'Login gagal'
        throw new Error(message)
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server')
      } else {
        throw new Error(error.message || 'Terjadi kesalahan tidak terduga')
      }
    }
  },
  
  logout: async () => {
    try {
      await apiClient.post('/admin/logout')
    } catch (error) {
      console.warn('Logout request failed:', error)
    }
  },
  
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/admin/refresh-token')
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  getProfile: async () => {
    try {
      const response = await apiClient.get('/admin/profile')
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await apiClient.put('/admin/profile', data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  changePassword: async (data) => {
    try {
      const response = await apiClient.put('/admin/change-password', data)
      return response.data
    } catch (error) {
      throw error
    }
  }
}