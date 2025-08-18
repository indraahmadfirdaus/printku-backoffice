import { createService } from './baseService'
import { apiClient } from '../lib/api'

export const transactionService = createService('/transactions')

// Get transaction overview
transactionService.getOverview = async () => {
  return apiClient.get('/transactions/overview')
}

// Get transactions with filters and pagination
transactionService.getTransactions = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return apiClient.get(`/transactions${queryString ? `?${queryString}` : ''}`)
}

// Get transaction by ID - Updated untuk detail lengkap
transactionService.getById = async (id) => {
  return apiClient.get(`/transactions/${id}`)
}

// Export transactions
transactionService.export = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return apiClient.get(`/transactions/export?${queryString}`, {
    responseType: 'blob'
  })
}