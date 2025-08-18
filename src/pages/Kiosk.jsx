import { useState, useEffect } from 'react'
import { useKiosks } from '../hooks/useKiosks'
import { useKioskStore } from '../stores/kioskStore'
import Table from '../components/UI/atoms/Table'
import Button from '../components/UI/atoms/Button'
import Input from '../components/UI/atoms/Input'
import Modal from '../components/UI/atoms/Modal'
import Card from '../components/UI/atoms/Card'
import CreateKioskModal from '../components/CreateKioskModal'
import EditKioskModal from '../components/EditKioskModal'
import DetailKioskModal from '../components/DetailKioskModal'
import { Search, Filter, Plus, Monitor, Wifi, WifiOff, Printer, AlertCircle, Settings, Trash2 } from 'lucide-react'

const Kiosk = () => {
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedKiosk, setSelectedKiosk] = useState(null)
  const [kioskToDelete, setKioskToDelete] = useState(null)
  const [tempFilters, setTempFilters] = useState({
    search: '',
    status: 'all',
    location: ''
  })

  const {
    filters,
    pagination,
    setFilters,
    setPagination,
    setPage,
    setLimit
  } = useKioskStore()

  const { 
    useKiosksList,
    useCreateKioskWithPrinters,
    useUpdateKioskWithPrinters,
    useKioskDetail,
    useDeleteKiosk
  } = useKiosks()

  const { data: kioskData, isLoading, error } = useKiosksList()
  const createKioskMutation = useCreateKioskWithPrinters()
  const updateKioskMutation = useUpdateKioskWithPrinters()
  const deleteKioskMutation = useDeleteKiosk()

  // Get kiosk detail for editing and viewing
  const { data: kioskDetail, isLoading: isLoadingDetail } = useKioskDetail(selectedKiosk?.id)
  
  // Initialize temp filters with current filters
  useEffect(() => {
    setTempFilters(filters)
  }, [filters])

  const handleSearch = (e) => {
    const value = e.target.value
    setFilters({ search: value })
    setPage(1)
  }

  const handleApplyFilters = () => {
    setFilters(tempFilters)
    setPage(1)
    setShowFilterModal(false)
  }

  const handleResetFilters = () => {
    const resetFilters = { search: '', status: 'all', location: '' }
    setTempFilters(resetFilters)
    setFilters(resetFilters)
    setPage(1)
    setShowFilterModal(false)
  }

  const handlePageChange = (page) => {
    setPage(page)
  }

  const handleLimitChange = (limit) => {
    setLimit(limit)
  }

  const handleCreateKiosk = async (data) => {
    try {
      await createKioskMutation.mutateAsync(data)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating kiosk:', error)
    }
  }

  const handleEditKiosk = (kiosk) => {
    setSelectedKiosk(kiosk)
    setShowEditModal(true)
  }

  const handleUpdateKiosk = async (data) => {
    try {
      await updateKioskMutation.mutateAsync({
        id: selectedKiosk.id,
        data
      })
      setShowEditModal(false)
      setSelectedKiosk(null)
    } catch (error) {
      console.error('Error updating kiosk:', error)
    }
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedKiosk(null)
  }

  const handleViewDetail = (kiosk) => {
    setSelectedKiosk(kiosk)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedKiosk(null)
  }

  // Handler untuk konfirmasi delete
  const handleDeleteKiosk = (kiosk) => {
    setKioskToDelete(kiosk)
    setShowDeleteModal(true)
  }

  // Handler untuk eksekusi delete
  const handleConfirmDelete = async () => {
    if (!kioskToDelete) return
    
    try {
      await deleteKioskMutation.mutateAsync(kioskToDelete.id)
      setShowDeleteModal(false)
      setKioskToDelete(null)
    } catch (error) {
      console.error('Error deleting kiosk:', error)
      // Error akan ditangani oleh useApiMutation
    }
  }

  // Handler untuk cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setKioskToDelete(null)
  }

  const columns = [
    {
      key: 'kiosk_code',
      label: 'Kode Kiosk',
      render: (value) => (
        <div className="font-mono font-medium text-sm">{value}</div>
      )
    },
    {
      key: 'name',
      label: 'Nama Kiosk',
      render: (value) => (
        <div className="font-medium text-sm">{value}</div>
      )
    },
    {
      key: 'location',
      label: 'Lokasi',
      render: (value) => (
        <div className="text-sm text-base-content/80">{value}</div>
      )
    },
    {
      key: 'is_online',
      label: 'Status Kiosk',
      render: (value) => (
        <div className="flex items-center gap-1">
          {value ? (
            <>
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-success text-sm font-medium">Online</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span className="text-error text-sm font-medium">Offline</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'printers',
      label: 'Printer Info',
      render: (printers, row) => {
        if (!printers || printers.length === 0) {
          return <span className="text-base-content/60 text-sm">Tidak ada printer</span>
        }

        const onlinePrinters = printers.filter(p => p.is_online).length
        const totalPrinters = printers.length
        const hasLowPaper = printers.some(p => p.paper_count < (p.paper_capacity * 0.2))

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Printer size={14} className="text-base-content/60" />
              <span className="text-sm font-medium">
                {onlinePrinters}/{totalPrinters} Online
              </span>
              {hasLowPaper && (
                <AlertCircle size={12} className="text-warning" title="Ada printer dengan kertas rendah" />
              )}
            </div>
            <div className="text-xs text-base-content/60">
              {printers.map((printer, index) => (
                <div key={index}>
                  {printer.name}: {printer.paper_count}/{printer.paper_capacity}
                </div>
              ))}
            </div>
          </div>
        )
      }
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleViewDetail(row)}
            className="text-xs px-2 py-1"
          >
            Detail
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditKiosk(row)}
            className="text-xs px-2 py-1"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteKiosk(row)}
            className="text-xs px-2 py-1 text-error hover:bg-error/10"
            disabled={deleteKioskMutation.isPending}
          >
            <Trash2 size={12} />
            Hapus
          </Button>
        </div>
      )
    }
  ]

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <p className="text-error">Error loading kiosk data: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manajemen Kiosk</h1>
            <p className="text-base-content/70">
              Kelola kiosk dan printer yang terdaftar
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Tambah Kiosk
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari kiosk..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full"
              leftIcon={<Search size={16} />}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filter
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Daftar Kiosk</h2>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            data={kioskData?.data?.kiosks || []}
            loading={isLoading}
            pagination={{
              page: kioskData?.data?.pagination?.current_page || 1,
              limit: kioskData?.data?.pagination?.per_page || 10,
              total: kioskData?.data?.pagination?.total_count || 0,
              totalPages: kioskData?.data?.pagination?.total_pages || 1,
              has_next: kioskData?.data?.pagination?.has_next || false,
              has_prev: kioskData?.data?.pagination?.has_prev || false,
              onPageChange: handlePageChange,
              onLimitChange: handleLimitChange
            }}
          />
        </div>
      </Card>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Kiosk"
      >
        <div className="space-y-4">
          <Input
            label="Cari"
            placeholder="Nama atau kode kiosk..."
            value={tempFilters.search}
            onChange={(e) => setTempFilters(prev => ({ ...prev, search: e.target.value }))}
          />

          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={tempFilters.status}
              onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">Semua Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <Input
            label="Lokasi"
            placeholder="Filter berdasarkan lokasi..."
            value={tempFilters.location}
            onChange={(e) => setTempFilters(prev => ({ ...prev, location: e.target.value }))}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>
              Terapkan Filter
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Kiosk Modal */}
      <CreateKioskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateKiosk}
        isLoading={createKioskMutation.isPending}
      />

      {/* Edit Kiosk Modal */}
      <EditKioskModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateKiosk}
        isLoading={updateKioskMutation.isPending || isLoadingDetail}
        kioskData={kioskDetail?.data}
      />

      {/* Detail Modal */}
      <DetailKioskModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        kioskData={kioskDetail?.data}
        isLoading={isLoadingDetail}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        title="Konfirmasi Hapus Kiosk"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-error" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base-content mb-2">
                Apakah Anda yakin ingin menghapus kiosk ini?
              </h3>
              <div className="text-sm text-base-content/70 space-y-1">
                <p><strong>Kode Kiosk:</strong> {kioskToDelete?.kiosk_code}</p>
                <p><strong>Nama:</strong> {kioskToDelete?.name}</p>
                <p><strong>Lokasi:</strong> {kioskToDelete?.location}</p>
              </div>
              <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning font-medium">
                  ⚠️ Peringatan: Kiosk dan semua printer terkait akan dihapus secara permanen.
                </p>
                <p className="text-xs text-base-content/60 mt-1">
                  Jika ada print job aktif, penghapusan akan gagal.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
            <Button
              variant="ghost"
              onClick={handleCancelDelete}
              disabled={deleteKioskMutation.isPending}
            >
              Batal
            </Button>
            <Button
              variant="error"
              onClick={handleConfirmDelete}
              disabled={deleteKioskMutation.isPending}
              className="flex items-center gap-2"
            >
              {deleteKioskMutation.isPending ? (
                <div className="loading loading-spinner loading-sm"></div>
              ) : (
                <Trash2 size={16} />
              )}
              Hapus Kiosk
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Kiosk