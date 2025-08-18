import { createService } from './baseService'
import { apiClient } from '../lib/api'

export const kioskService = createService('/kiosks')

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

// Custom methods for kiosk
kioskService.getStatus = async (id) => {
  return apiClient.get(`/kiosks/${id}/status`)
}

kioskService.restart = async (id) => {
  return apiClient.post(`/kiosks/${id}/restart`)
}

kioskService.updateConfig = async (id, config) => {
  return apiClient.put(`/kiosks/${id}/config`, config)
}

// Method untuk mendapatkan daftar kiosk dengan pagination dan filter
kioskService.getKiosks = async (params = {}) => {
  const { page = 1, limit = 10, search = '', status = 'all', location = '' } = params
  
  const queryParams = {
    page: page.toString(),
    limit: limit.toString()
  }
  
  if (search) queryParams.search = search
  if (status && status !== 'all') queryParams.status = status
  if (location) queryParams.location = location
  
  const queryString = buildQueryString(queryParams)
  return apiClient.get(`/kiosks${queryString}`)
}

// Method untuk mendapatkan detail kiosk beserta printer
kioskService.getKioskDetail = async (id) => {
  return apiClient.get(`/kiosks/${id}`)
}

// Method untuk membuat kiosk dengan printer
kioskService.createKioskWithPrinters = async (data) => {
  return apiClient.post('/kiosks/with-printers', data)
}

// Method untuk update kiosk dengan printer
kioskService.updateKioskWithPrinters = async (id, data) => {
  return apiClient.put(`/kiosks/${id}/with-printers`, data)
}

// Hapus Setup Code methods
// kioskService.generateSetupCode = async (data) => {
//   return apiClient.post('/kiosks/generate/setup/code', data)
// }

// kioskService.getSetupCodes = async () => {
//   return apiClient.get('/kiosks/setup/codes')
// }