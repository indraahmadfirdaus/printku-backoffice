import { useState } from 'react'
import { useCustomers } from '../hooks/useCustomers'
import Table from '../components/UI/atoms/Table'
import Button from '../components/UI/atoms/Button'
import Input from '../components/UI/atoms/Input'
import Modal from '../components/UI/atoms/Modal'

const Customer = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    date_from: '',
    date_to: ''
  })

  const [showFilterModal, setShowFilterModal] = useState(false)
  const [tempFilters, setTempFilters] = useState(filters)

  const { useCustomersList } = useCustomers()
  
  // Fetch data
  const { data: customerData, isLoading: customersLoading } = useCustomersList(filters)

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return '-'
    // Add +62 prefix if not present
    if (phone.startsWith('8')) {
      return `+62${phone}`
    }
    return phone
  }

  // Format job status
  const formatJobStatus = (status) => {
    const statusMap = {
      'PENDING_PAYMENT': { text: 'Menunggu Pembayaran', class: 'badge-warning' },
      'PAID': { text: 'Lunas', class: 'badge-success' },
      'PROCESSING': { text: 'Diproses', class: 'badge-info' },
      'COMPLETED': { text: 'Selesai', class: 'badge-success' },
      'CANCELLED': { text: 'Dibatalkan', class: 'badge-error' }
    }
    return statusMap[status] || { text: status, class: 'badge-ghost' }
  }

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when other filters change
    }))
  }

  // Handle temp filter changes (in modal)
  const handleTempFilterChange = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle search (immediate)
  const handleSearch = (e) => {
    const value = e.target.value
    handleFilterChange('search', value)
  }

  // Handle pagination
  const handlePageChange = (page) => {
    handleFilterChange('page', page)
  }

  // Apply filters from modal
  const handleApplyFilters = () => {
    setFilters({ ...tempFilters, page: 1 })
    setShowFilterModal(false)
  }

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      page: 1,
      limit: 10,
      search: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      date_from: '',
      date_to: ''
    }
    setTempFilters(resetFilters)
    setFilters(resetFilters)
    setShowFilterModal(false)
  }

  // Open filter modal
  const handleOpenFilterModal = () => {
    setTempFilters(filters)
    setShowFilterModal(true)
  }

  // Customer table columns
  const customerColumns = [
    {
      title: 'No. Telepon',
      key: 'phone_number',
      render: (value) => (
        <div className="font-medium">
          {formatPhoneNumber(value)}
        </div>
      )
    },
    {
      title: 'Total Print Job',
      key: 'total_jobs',
      render: (value) => (
        <div className="text-center">
          <span className="badge badge-primary badge-outline">{value}</span>
        </div>
      )
    },
    {
      title: 'Total Pengeluaran',
      key: 'total_spent',
      render: (value) => (
        <span className="font-semibold text-success">{formatCurrency(value)}</span>
      )
    },
    {
      title: 'Print Job Terakhir',
      key: 'last_print_job',
      render: (value) => {
        if (!value) return <span className="text-base-content/50">-</span>
        const status = formatJobStatus(value.status)
        return (
          <div className="space-y-1">
            <div className="text-sm">{formatCurrency(value.total_price)}</div>
            <span className={`badge badge-sm ${status.class}`}>{status.text}</span>
          </div>
        )
      }
    },
    {
      title: 'Bergabung',
      key: 'created_at',
      render: (value) => (
        <div className="text-sm text-base-content/70">
          {formatDate(value)}
        </div>
      )
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Manajemen Customer</h1>
        <p className="text-base-content/70">
          Kelola data customer dan pantau aktivitas print job mereka
        </p>
      </div>

      {/* Customer Table */}
      <div className="bg-base-100 rounded-xl shadow-sm">
        <div className="p-6 border-b border-base-300">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Daftar Customer</h3>
              <p className="text-sm text-base-content/70">
                Total {customerData?.pagination?.total_count || 0} customer
              </p>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex gap-3">
              <div className="w-64">
                <Input
                  placeholder="Cari nomor telepon..."
                  value={filters.search}
                  onChange={handleSearch}
                />
              </div>
              <Button
                variant="outline"
                onClick={handleOpenFilterModal}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filter
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={customerColumns}
            data={customerData?.customers || []}
            loading={customersLoading}
            emptyMessage="Belum ada data customer"
            pagination={{
              page: filters.page,
              limit: filters.limit,
              total: customerData?.pagination?.total_count || 0,
              totalPages: customerData?.pagination?.total_pages || 0,
              has_next: customerData?.pagination?.has_next || false,
              has_prev: customerData?.pagination?.has_prev || false,
              onPageChange: handlePageChange,
              onLimitChange: (limit) => handleFilterChange('limit', limit)
            }}
          />

          {/* Hapus pagination manual yang lama */}
          {/* 
          {customerData?.pagination && customerData.pagination.total_pages > 1 && (
            <div className="flex justify-center mt-6">
              ...
            </div>
          )}
          */}
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Customer"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Urutkan Berdasarkan</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={tempFilters.sort_by}
                onChange={(e) => handleTempFilterChange('sort_by', e.target.value)}
              >
                <option value="created_at">Tanggal Bergabung</option>
                <option value="phone_number">No. Telepon</option>
                <option value="total_jobs">Total Print Job</option>
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Urutan</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={tempFilters.sort_order}
                onChange={(e) => handleTempFilterChange('sort_order', e.target.value)}
              >
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tanggal Dari"
              type="date"
              value={tempFilters.date_from}
              onChange={(e) => handleTempFilterChange('date_from', e.target.value)}
            />
            
            <Input
              label="Tanggal Sampai"
              type="date"
              value={tempFilters.date_to}
              onChange={(e) => handleTempFilterChange('date_to', e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Items per Halaman</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={tempFilters.limit}
              onChange={(e) => handleTempFilterChange('limit', parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilterModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleApplyFilters}
            >
              Terapkan Filter
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Customer