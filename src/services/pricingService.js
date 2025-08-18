import { createService } from './baseService'
import { apiClient } from '../lib/api'

export const pricingService = createService('/pricing')

// Existing methods
pricingService.getActive = async () => {
  return apiClient.get('/pricing/active')
}

pricingService.setActive = async (id) => {
  return apiClient.post(`/pricing/${id}/activate`)
}

// New methods for documents and photo pricing
pricingService.getDocumentsPricing = async () => {
  return apiClient.get('/pricing/docs')
}

pricingService.getPhotoPricing = async () => {
  return apiClient.get('/pricing/photo')
}

// Update methods - menggunakan color_type dan photo_size sebagai identifier
pricingService.updateDocumentPricing = async (data) => {
  return apiClient.put('/pricing/docs', data)
}

pricingService.updatePhotoPricing = async (data) => {
  return apiClient.put('/pricing/photo', data)
}