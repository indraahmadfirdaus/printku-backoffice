import { useApiQuery, useApiMutation } from './useBaseApi'
import { adsService } from '../services/adsService'

export const useAds = () => {
  // Transform API data to match component expectations
  const transformAdsData = (apiData) => {
    if (!apiData) return []
    
    return apiData.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      imageUrl: item.image_url,
      youtubeId: item.youtube_id,
      isActive: item.is_active,
      order: item.order,
      createdBy: item.created_by,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      admin: item.admin ? {
        id: item.admin.id,
        fullName: item.admin.full_name,
        email: item.admin.email
      } : null,
      analytics: item.analytics || [],
      totalViewCount: item.total_view_count || 0
    }))
  }

  // Transform single ads data - semua API menggunakan snake_case
  const transformSingleAdsData = (apiData) => {
    if (!apiData) return null
    
    return {
      id: apiData.id,
      title: apiData.title,
      description: apiData.description,
      type: apiData.type,
      imageUrl: apiData.image_url, // Menggunakan snake_case dari API
      youtubeId: apiData.youtube_id, // Menggunakan snake_case dari API
      isActive: apiData.is_active, // Menggunakan snake_case dari API
      order: apiData.order,
      createdBy: apiData.created_by,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
      admin: apiData.admin ? {
        id: apiData.admin.id,
        fullName: apiData.admin.full_name, // Menggunakan snake_case dari API
        email: apiData.admin.email
      } : null
    }
  }

  // Get all ads
  const useAdsList = (options = {}) => useApiQuery(
    ['ads', 'list'],
    () => adsService.getAll(),
    {
      select: (data) => transformAdsData(data?.data || []),
      ...options
    }
  )

  // Get ads by ID
  const useAdsDetail = (id, options = {}) => useApiQuery(
    ['ads', 'detail', id],
    () => adsService.getById(id),
    {
      select: (data) => transformSingleAdsData(data?.data),
      enabled: !!id,
      ...options
    }
  )

  // Upload media
  const useUploadMedia = () => useApiMutation({
    mutationFn: adsService.uploadMedia,
    successMessage: 'Media berhasil diupload',
    showErrorToast: true
  })

  // Create ads
  const useCreateAds = () => useApiMutation({
    mutationFn: adsService.create,
    successMessage: 'Ads berhasil dibuat',
    invalidateQueries: [['ads']]
  })

  // Update ads
  const useUpdateAds = () => useApiMutation({
    mutationFn: ({ id, data }) => adsService.update(id, data),
    successMessage: 'Ads berhasil diperbarui',
    invalidateQueries: [['ads']]
  })

  // Delete ads
  const useDeleteAds = () => useApiMutation({
    mutationFn: adsService.delete,
    successMessage: 'Ads berhasil dihapus',
    invalidateQueries: [['ads']]
  })

  // Set active status
  const useSetActiveAds = () => useApiMutation({
    mutationFn: ({ id, isActive }) => adsService.setActive(id, isActive),
    successMessage: 'Status ads berhasil diperbarui',
    invalidateQueries: [['ads']]
  })

  return {
    useAdsList,
    useAdsDetail,
    useUploadMedia,
    useCreateAds,
    useUpdateAds,
    useDeleteAds,
    useSetActiveAds
  }
}