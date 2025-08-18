import { useApiQuery, useApiMutation } from './useBaseApi'
import { transactionService } from '../services/transactionService'

export const useTransactions = () => {
  // Get transaction overview
  const useTransactionOverview = (options = {}) => useApiQuery(
    ['transactions', 'overview'],
    transactionService.getOverview,
    {
      select: (data) => data?.data || {},
      ...options
    }
  )

  // Get transactions list with filters
  const useTransactionsList = (params = {}, options = {}) => useApiQuery(
    ['transactions', 'list', params],
    () => transactionService.getTransactions(params),
    {
      select: (data) => data?.data || { transactions: [], pagination: {} },
      keepPreviousData: true,
      ...options
    }
  )

  // Get transaction by ID - Updated untuk detail lengkap
  const useTransactionDetail = (id, options = {}) => useApiQuery(
    ['transactions', 'detail', id],
    () => transactionService.getById(id),
    {
      select: (data) => data?.data || {},
      enabled: !!id,
      ...options
    }
  )

  // Export transactions
  const useExportTransactions = (options = {}) => useApiMutation({
    mutationFn: (params) => transactionService.export(params),
    successMessage: 'Data transaksi berhasil diekspor',
    ...options
  })

  return {
    useTransactionOverview,
    useTransactionsList,
    useTransactionDetail,
    useExportTransactions
  }
}