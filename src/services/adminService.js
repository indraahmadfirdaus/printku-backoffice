import { createService } from './baseService'
import { apiClient } from '../lib/api'

export const adminService = createService('/admin')

// Tambahkan method spesifik ke adminService object
adminService.getAdminProfile = async () => {
  return apiClient.get('/admin/profile') // ✅ Tetap gunakan path lengkap
}

adminService.getAllAdmins = async () => {
  return apiClient.get('/admin/admins')
}

adminService.createAdmin = async (adminData) => {
  return apiClient.post('/admin/create', adminData)
}

adminService.updateAdmin = async (adminId, adminData) => {
  return apiClient.put(`/admin/${adminId}`, adminData)
}

adminService.deleteAdmin = async (adminId) => {
  return apiClient.delete(`/admin/${adminId}`)
}

adminService.loginAdmin = async (credentials) => {
  return apiClient.post('/admin/login', credentials)
}

// Export named functions untuk compatibility
export const { getAdminProfile, getAllAdmins, createAdmin, updateAdmin, deleteAdmin, loginAdmin } = adminService