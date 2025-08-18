import { apiClient } from '../lib/api'

// Base service class untuk konsistensi
export class BaseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return apiClient.get(`${this.baseUrl}${queryString ? `?${queryString}` : ''}`)
  }

  async getById(id) {
    return apiClient.get(`${this.baseUrl}/${id}`)
  }

  async create(data) {
    return apiClient.post(this.baseUrl, data)
  }

  async update(id, data) {
    return apiClient.put(`${this.baseUrl}/${id}`, data)
  }

  async delete(id) {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  async bulkDelete(ids) {
    return apiClient.post(`${this.baseUrl}/bulk-delete`, { ids })
  }
}

// Factory function untuk membuat service
export const createService = (baseUrl) => new BaseService(baseUrl)