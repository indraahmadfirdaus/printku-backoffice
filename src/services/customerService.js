import { createService } from './baseService'
import { apiClient } from '../lib/api'

export const customerService = createService('/customers')

// Custom methods specific to customers
customerService.getOverview = async () => {
  return apiClient.get('/customers/overview')
}

customerService.getStats = async () => {
  return apiClient.get('/customers/stats')
}

customerService.export = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return apiClient.get(`/customers/export?${queryString}`, {
    responseType: 'blob'
  })
}