import { useApiQuery, useApiMutation } from './useBaseApi'
import { pricingService } from '../services/pricingService'

export const usePricing = () => {
  // Get documents pricing
  const useDocumentsPricing = (options = {}) => useApiQuery(
    ['pricing', 'documents'],
    '/pricing/docs',
    {
      select: (data) => data?.data?.pricing || [],
      ...options
    }
  )

  // Get photo pricing
  const usePhotoPricing = (options = {}) => useApiQuery(
    ['pricing', 'photo'],
    '/pricing/photo',
    {
      select: (data) => data?.data?.pricing || [],
      ...options
    }
  )

  // Update document pricing - tidak perlu id, menggunakan color_type
  const useUpdateDocumentPricing = (options = {}) => useApiMutation({
    mutationFn: (data) => pricingService.updateDocumentPricing(data),
    successMessage: 'Harga dokumen berhasil diperbarui',
    invalidateQueries: [['pricing', 'documents']],
    ...options
  })

  // Update photo pricing - tidak perlu id, menggunakan photo_size
  const useUpdatePhotoPricing = (options = {}) => useApiMutation({
    mutationFn: (data) => pricingService.updatePhotoPricing(data),
    successMessage: 'Harga foto berhasil diperbarui',
    invalidateQueries: [['pricing', 'photo']],
    ...options
  })

  return {
    useDocumentsPricing,
    usePhotoPricing,
    useUpdateDocumentPricing,
    useUpdatePhotoPricing
  }
}