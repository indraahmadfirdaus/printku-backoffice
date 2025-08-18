import { useState } from 'react'
import { usePricing } from '../hooks/usePricing'
import Table from '../components/UI/atoms/Table'
import Button from '../components/UI/atoms/Button'
import Card from '../components/UI/atoms/Card'
import EditPricingModal from '../components/EditPricingModal'
// Hapus ini
// import Modal from '../components/UI/atoms/Modal'
import Input from '../components/UI/atoms/Input'

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('documents')
  const [editModal, setEditModal] = useState({ isOpen: false, type: null, data: null })
  const [editForm, setEditForm] = useState({})
  const [errors, setErrors] = useState({})
  
  const { useDocumentsPricing, usePhotoPricing, useUpdateDocumentPricing, useUpdatePhotoPricing } = usePricing()
  
  // Fetch data
  const { data: documentsPricing, isLoading: documentsLoading } = useDocumentsPricing()
  const { data: photoPricing, isLoading: photoLoading } = usePhotoPricing()
  
  // Mutations
  const updateDocumentMutation = useUpdateDocumentPricing({
    onSuccess: () => {
      setEditModal({ isOpen: false, type: null, data: null })
      setEditForm({})
      setErrors({})
    }
  })
  
  const updatePhotoMutation = useUpdatePhotoPricing({
    onSuccess: () => {
      setEditModal({ isOpen: false, type: null, data: null })
      setEditForm({})
      setErrors({})
    }
  })

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Format color type
  const formatColorType = (colorType) => {
    const types = {
      'BLACK_WHITE': 'Hitam Putih',
      'COLOR': 'Berwarna'
    }
    return types[colorType] || colorType
  }

  // Format photo size
  const formatPhotoSize = (size) => {
    const sizes = {
      'SIZE_2R': '2R (6x9 cm)',
      'SIZE_3R': '3R (9x13 cm)',
      'SIZE_4R': '4R (10x15 cm)',
      'SIZE_5R': '5R (13x18 cm)',
      'SIZE_6R': '6R (15x20 cm)'
    }
    return sizes[size] || size
  }

  // Validation functions
  const validateDocumentForm = (data) => {
    const errors = {}
    if (!data.price_per_page || data.price_per_page <= 0) {
      errors.price_per_page = 'Harga harus lebih dari 0'
    }
    return errors
  }

  const validatePhotoForm = (data) => {
    const errors = {}
    if (!data.price_per_copy || data.price_per_copy <= 0) {
      errors.price_per_copy = 'Harga harus lebih dari 0'
    }
    return errors
  }

  // Handle edit functions
  const handleEditDocument = (document) => {
    setEditModal({ isOpen: true, type: 'document', data: document })
    setEditForm({
      color_type: document.color_type,
      price_per_page: document.price_per_page
    })
    setErrors({})
  }

  const handleEditPhoto = (photo) => {
    setEditModal({ isOpen: true, type: 'photo', data: photo })
    setEditForm({
      photo_size: photo.photo_size,
      price_per_copy: photo.price_per_copy
    })
    setErrors({})
  }

  // Handle form input change
  const [hasChanges, setHasChanges] = useState(false)
  
  // Update handleInputChange untuk track perubahan dan parse number
  const handleInputChange = (field, value) => {
    // Parse value to number for price fields
    const parsedValue = (field === 'price_per_page' || field === 'price_per_copy') 
      ? parseFloat(value) || 0 
      : value
    
    setEditForm(prev => ({ ...prev, [field]: parsedValue }))
    
    // Check if data has changed
    const originalValue = editModal.type === 'document' 
      ? editModal.data?.price_per_page 
      : editModal.data?.price_per_copy
    
    setHasChanges(parsedValue !== originalValue)
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Handle form submission
  const handleSubmitEdit = () => {
    if (editModal.type === 'document') {
      // Ensure price_per_page is a number
      const formData = {
        ...editForm,
        price_per_page: parseFloat(editForm.price_per_page) || 0
      }
      
      const validationErrors = validateDocumentForm(formData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }
      updateDocumentMutation.mutate(formData)
    } else if (editModal.type === 'photo') {
      // Ensure price_per_copy is a number
      const formData = {
        ...editForm,
        price_per_copy: parseFloat(editForm.price_per_copy) || 0
      }
      
      const validationErrors = validatePhotoForm(formData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }
      updatePhotoMutation.mutate(formData)
    }
  }

  // Handle close modal
  const handleCloseModal = () => {
    setEditModal({ isOpen: false, type: null, data: null })
    setEditForm({})
    setErrors({})
    setHasChanges(false)
  }

  // Documents table columns
  const documentsColumns = [
    {
      title: 'Jenis Cetak',
      key: 'color_type',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${value === 'COLOR' ? 'bg-rainbow bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' : 'bg-gray-500'}`}></div>
          <span className="font-medium">{formatColorType(value)}</span>
        </div>
      )
    },
    {
      title: 'Harga per Halaman',
      key: 'price_per_page',
      render: (value) => (
        <span className="font-semibold text-primary">{formatCurrency(value)}</span>
      )
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditDocument(row)}
            disabled={updateDocumentMutation.isPending}
          >
            Edit
          </Button>
        </div>
      )
    }
  ]

  // Photo table columns
  const photoColumns = [
    {
      title: 'Ukuran Foto',
      key: 'photo_size',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-base-300 rounded border-2 border-base-content/20 flex items-center justify-center">
            <span className="text-xs font-bold">{value.replace('SIZE_', '')}</span>
          </div>
          <span className="font-medium">{formatPhotoSize(value)}</span>
        </div>
      )
    },
    {
      title: 'Harga per Copy',
      key: 'price_per_copy',
      render: (value) => (
        <span className="font-semibold text-primary">{formatCurrency(value)}</span>
      )
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditPhoto(row)}
            disabled={updatePhotoMutation.isPending}
          >
            Edit
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Pengaturan Harga</h1>
        <p className="text-base-content/70">
          Kelola harga layanan cetak dokumen dan foto di kiosk Anda
        </p>
      </div>

      {/* QRIS Fee Notice */}
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-warning mb-1">Informasi Biaya QRIS</h3>
            <p className="text-sm text-base-content/80">
              0.63% dari transaksi akan dikenakan untuk biaya penggunaan layanan QRIS dari payment gateway Xendit
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Total Jenis Dokumen</p>
              <p className="text-xl font-bold">{documentsPricing?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Total Ukuran Foto</p>
              <p className="text-xl font-bold">{photoPricing?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Harga Terendah</p>
              <p className="text-xl font-bold">
                {documentsPricing?.length > 0 
                  ? formatCurrency(Math.min(...documentsPricing.map(d => d.price_per_page)))
                  : '-'
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Harga Tertinggi</p>
              <p className="text-xl font-bold">
                {photoPricing?.length > 0 
                  ? formatCurrency(Math.max(...photoPricing.map(p => p.price_per_copy)))
                  : '-'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="bg-base-100 rounded-xl shadow-sm">
        <div className="flex border-b border-base-300">
          <button
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'documents'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-base-content/70 hover:text-base-content hover:bg-base-200'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Cetak Dokumen
            </div>
          </button>
          <button
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'photo'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-base-content/70 hover:text-base-content hover:bg-base-200'
            }`}
            onClick={() => setActiveTab('photo')}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Cetak Foto
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Harga Cetak Dokumen</h3>
                  <p className="text-sm text-base-content/70">
                    Atur harga per halaman untuk cetak dokumen hitam putih dan berwarna
                  </p>
                </div>
              </div>
              
              <Table
                columns={documentsColumns}
                data={documentsPricing || []}
                loading={documentsLoading}
                emptyMessage="Belum ada data harga dokumen"
              />
            </div>
          )}

          {activeTab === 'photo' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Harga Cetak Foto</h3>
                  <p className="text-sm text-base-content/70">
                    Atur harga per copy untuk berbagai ukuran foto
                  </p>
                </div>
              </div>
              
              <Table
                columns={photoColumns}
                data={photoPricing || []}
                loading={photoLoading}
                emptyMessage="Belum ada data harga foto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditPricingModal
        isOpen={editModal.isOpen}
        onClose={handleCloseModal}
        editModal={editModal}
        editForm={editForm}
        errors={errors}
        onInputChange={handleInputChange}
        onSubmit={handleSubmitEdit}
        updateDocumentMutation={updateDocumentMutation}
        updatePhotoMutation={updatePhotoMutation}
        formatColorType={formatColorType}
        formatPhotoSize={formatPhotoSize}
      />
    </div>
  )
}

export default Pricing