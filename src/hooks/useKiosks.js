import { createCrudHooks, useApiMutation, useApiQuery } from './useBaseApi'
import { kioskService } from '../services'
import { useKioskStore } from '../stores/kioskStore'

export const useKiosks = () => {
  const crudHooks = createCrudHooks('kiosks', {
    baseUrl: '/kiosks',
    messages: {
      create: 'Kiosk berhasil ditambahkan',
      update: 'Kiosk berhasil diperbarui',
      delete: 'Kiosk berhasil dihapus'
    }
  })

  // Custom hooks for kiosk-specific operations
  const useGetStatus = (id) => useApiQuery(
    ['kiosks', 'status', id],
    `/kiosks/${id}/status`,
    { enabled: !!id }
  )

  const useRestart = () => useApiMutation({
    mutationFn: kioskService.restart,
    successMessage: 'Kiosk berhasil direstart',
    invalidateQueries: [['kiosks']]
  })

  const useUpdateConfig = () => useApiMutation({
    mutationFn: ({ id, config }) => kioskService.updateConfig(id, config),
    successMessage: 'Konfigurasi kiosk berhasil diperbarui',
    invalidateQueries: [['kiosks']]
  })

  // Hook untuk mendapatkan daftar kiosk dengan pagination dan filter
  const useKiosksList = () => {
    const { filters, pagination } = useKioskStore()
    
    return useApiQuery(
      ['kiosks', 'list', filters, pagination],
      () => kioskService.getKiosks({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status,
        location: filters.location
      }),
      {
        keepPreviousData: true,
        staleTime: 30000 // 30 seconds
      }
    )
  }

  // Hook untuk mendapatkan detail kiosk
  const useKioskDetail = (id) => useApiQuery(
    ['kiosks', 'detail', id],
    () => kioskService.getKioskDetail(id),
    { enabled: !!id }
  )

  // Hook untuk membuat kiosk dengan printer
  const useCreateKioskWithPrinters = () => useApiMutation({
    mutationFn: kioskService.createKioskWithPrinters,
    successMessage: 'Kiosk dengan printer berhasil ditambahkan',
    invalidateQueries: [['kiosks']]
  })

  // Hook untuk update kiosk dengan printer
  const useUpdateKioskWithPrinters = () => useApiMutation({
    mutationFn: ({ id, data }) => kioskService.updateKioskWithPrinters(id, data),
    successMessage: 'Kiosk dengan printer berhasil diperbarui',
    invalidateQueries: [['kiosks']]
  })

  // Hook untuk delete kiosk
  const useDeleteKiosk = () => useApiMutation({
    mutationFn: (id) => kioskService.delete(id),
    successMessage: 'Kiosk berhasil dihapus',
    invalidateQueries: [['kiosks']]
  })

  return {
    ...crudHooks,
    useGetStatus,
    useRestart,
    useUpdateConfig,
    useKiosksList,
    useKioskDetail,
    useCreateKioskWithPrinters,
    useUpdateKioskWithPrinters,
    useDeleteKiosk
  }
    // Hapus useGenerateSetupCode dan useSetupCodes
  }
