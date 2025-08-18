import { useApiQuery, useApiMutation } from './useBaseApi'
import { adminService } from '../services/adminService'

export const useAdmin = () => {
  // ✅ BENAR - Gunakan pola 3 parameter seperti useAds
  const useAdminProfile = () => {
    return useApiQuery(
      ['admin', 'profile'],
      adminService.getAdminProfile,
      {
        staleTime: 5 * 60 * 1000,
      }
    )
  }

  const useAdmins = () => {
    return useApiQuery(
      ['admin', 'list'],
      adminService.getAllAdmins,
      {
        staleTime: 2 * 60 * 1000,
      }
    )
  }

  // Create admin mutation
  const useCreateAdmin = () => {
    return useApiMutation({
      mutationFn: adminService.createAdmin,
      invalidateQueries: [['admin', 'list']],
      successMessage: 'Admin berhasil dibuat',
      errorMessage: 'Gagal membuat admin'
    })
  }

  // Update admin mutation
  const useUpdateAdmin = () => {
    return useApiMutation({
      mutationFn: ({ id, ...data }) => adminService.updateAdmin(id, data),
      invalidateQueries: [['admin', 'list'], ['admin', 'profile']],
      successMessage: 'Admin berhasil diperbarui',
      errorMessage: 'Gagal memperbarui admin'
    })
  }

  // Delete admin mutation
  const useDeleteAdmin = () => {
    return useApiMutation({
      mutationFn: adminService.deleteAdmin,
      invalidateQueries: [['admin', 'list']],
      successMessage: 'Admin berhasil dihapus',
      errorMessage: 'Gagal menghapus admin'
    })
  }

  return {
    useAdminProfile,
    useAdmins,
    useCreateAdmin,
    useUpdateAdmin,
    useDeleteAdmin
  }
}