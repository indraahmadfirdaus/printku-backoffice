import { createService } from './baseService'
import { apiClient } from '../lib/api'

export const adsService = createService('/ads')

// Media upload method
adsService.uploadMedia = async (formData) => {
  return apiClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// Get all ads
adsService.getAll = async () => {
  return apiClient.get('/ads')
}

// Get ads by ID
adsService.getById = async (id) => {
  return apiClient.get(`/ads/${id}`)
}

// Create ads
adsService.create = async (data) => {
  return apiClient.post('/ads', data)
}

// Update ads
adsService.update = async (id, data) => {
  return apiClient.put(`/ads/${id}`, data)
}

// Delete ads
adsService.delete = async (id) => {
  return apiClient.delete(`/ads/${id}`)
}

// Legacy methods (keep for backward compatibility)
adsService.upload = async (formData) => {
  return adsService.uploadMedia(formData)
}

adsService.getActive = async () => {
  return apiClient.get('/ads/active')
}

adsService.setActive = async (id, isActive) => {
  return apiClient.put(`/ads/${id}/status`, { active: isActive })
}