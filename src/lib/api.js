import axios from 'axios'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8181/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor untuk menambahkan auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor untuk handle error dan refresh token
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Format error response without auto-redirect
    const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan'
    const formattedError = {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      success: error.response?.data?.success || false,
      response: error.response // Keep original response for debugging
    }
    
    return Promise.reject(formattedError)
  }
)

// API methods
export const apiClient = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
  
  // Upload file
  upload: (url, formData, config = {}) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    })
  }
}

export default api