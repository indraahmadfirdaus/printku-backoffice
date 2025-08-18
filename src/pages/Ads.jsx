import { useState } from 'react'
import { useAds } from '../hooks/useAds'
import Table from '../components/UI/atoms/Table'
import Button from '../components/UI/atoms/Button'
import Card from '../components/UI/atoms/Card'
import CreateAdsModal from '../components/CreateAdsModal'
import DetailAdsModal from '../components/DetailAdsModal'
import { Plus, Image, Video, Eye, EyeOff, Edit, Trash2, ExternalLink, Info } from 'lucide-react'

const Ads = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAdsId, setEditingAdsId] = useState(null)
  const [detailAdsId, setDetailAdsId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const {
    useAdsList,
    useAdsDetail,
    useUploadMedia,
    useCreateAds,
    useUpdateAds,
    useDeleteAds,
    useSetActiveAds
  } = useAds()

  const { data: adsData, isLoading, error } = useAdsList()
  const { data: editingAdsData, isLoading: isLoadingDetail } = useAdsDetail(editingAdsId)
  const { data: detailAdsData, isLoading: isLoadingDetailModal } = useAdsDetail(detailAdsId)
  const uploadMediaMutation = useUploadMedia()
  const createAdsMutation = useCreateAds()
  const updateAdsMutation = useUpdateAds()
  const deleteAdsMutation = useDeleteAds()
  const setActiveAdsMutation = useSetActiveAds()

  // Handle create ads
  const handleCreateAds = async (data) => {
    try {
      await createAdsMutation.mutateAsync(data)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating ads:', error)
    }
  }

  // Handle edit ads
  const handleEditAds = (ads) => {
    setEditingAdsId(ads.id)
  }

  const handleUpdateAds = async (data) => {
    try {
      await updateAdsMutation.mutateAsync({
        id: editingAdsId,
        data
      })
      setEditingAdsId(null)
    } catch (error) {
      console.error('Error updating ads:', error)
    }
  }

  const handleCloseEditModal = () => {
    setEditingAdsId(null)
  }

  // Handle detail ads
  const handleDetailAds = (ads) => {
    setDetailAdsId(ads.id)
  }

  const handleCloseDetailModal = () => {
    setDetailAdsId(null)
  }

  // Handle delete ads
  const handleDeleteAds = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ads ini?')) {
      try {
        await deleteAdsMutation.mutateAsync(id)
      } catch (error) {
        console.error('Error deleting ads:', error)
      }
    }
  }

  // Handle toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      await setActiveAdsMutation.mutateAsync({
        id,
        isActive: !currentStatus
      })
      // Close detail modal after toggle
      setDetailAdsId(null)
    } catch (error) {
      console.error('Error toggling ads status:', error)
    }
  }

  // Handle media upload
  const handleUploadMedia = async (formData) => {
    return await uploadMediaMutation.mutateAsync(formData)
  }

  // Handle image click for preview
  const handleImageClick = (imageUrl, title) => {
    setImagePreview({ url: imageUrl, title })
  }

  // Handle edit from detail modal
  const handleEditFromDetail = (ads) => {
    setDetailAdsId(null)
    setEditingAdsId(ads.id)
  }

  // Table columns dengan kolom urutan
  const columns = [
    {
      key: 'order',
      title: 'Urutan',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (value) => (
        <div className="font-mono font-medium text-sm">{value}</div>
      )
    },
    {
      key: 'title',
      title: 'Judul',
      headerClassName: 'min-w-[150px]',
      render: (value) => (
        <div className="font-medium text-sm max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'description',
      title: 'Deskripsi',
      headerClassName: 'min-w-[200px]',
      render: (value) => (
        <div className="text-sm text-base-content/80 max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'type',
      title: 'Tipe',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (value) => (
        <div className="flex items-center justify-center gap-2">
          {value === 'IMAGE' ? (
            <>
              <Image size={14} className="text-blue-600" />
              <span className="text-sm">Gambar</span>
            </>
          ) : (
            <>
              <Video size={14} className="text-red-600" />
              <span className="text-sm">Video</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'isActive',
      title: 'Status',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (value) => (
        <div className="flex items-center justify-center">
          <span className={`badge badge-sm ${
            value ? 'badge-success' : 'badge-error'
          }`}>
            {value ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
      )
    },
    {
      key: 'totalViewCount',
      title: 'View Count',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (value) => (
        <div className="font-mono font-medium text-sm">
          {value || 0}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Aksi',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDetailAds(row)}
            className="text-xs px-2 py-1 text-info hover:bg-info/10"
          >
            <Info size={12} />
            Detail
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditAds(row)}
            className="text-xs px-2 py-1"
          >
            <Edit size={12} />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteAds(row.id)}
            disabled={deleteAdsMutation.isPending}
            className="text-xs px-2 py-1 text-error hover:bg-error/10"
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
          <p className="text-error">Error loading ads data: {error.message}</p>
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
            <h1 className="text-2xl font-bold mb-2">Manajemen Ads & Media</h1>
            <p className="text-base-content/70">
              Kelola iklan dan promosi yang ditampilkan di kiosk
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Buat Ads Baru
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Daftar Ads</h2>
        </div>
        <Table
          columns={columns}
          data={adsData || []}
          loading={isLoading}
        />
      </Card>

      {/* Create Ads Modal */}
      <CreateAdsModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAds}
        onUploadMedia={handleUploadMedia}
        isLoading={createAdsMutation.isPending}
        isUploading={uploadMediaMutation.isPending}
      />

      {/* Edit Ads Modal */}
      <CreateAdsModal
        isOpen={!!editingAdsId}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateAds}
        onUploadMedia={handleUploadMedia}
        isLoading={updateAdsMutation.isPending || isLoadingDetail}
        isUploading={uploadMediaMutation.isPending}
        adsData={editingAdsData}
      />

      {/* Detail Ads Modal */}
      <DetailAdsModal
        isOpen={!!detailAdsId}
        onClose={handleCloseDetailModal}
        adsData={detailAdsData}
        isLoading={isLoadingDetailModal}
        onToggleActive={handleToggleActive}
        onEdit={handleEditFromDetail}
        onImageClick={handleImageClick}
        isToggling={setActiveAdsMutation.isPending}
      />

      {/* Image Preview Modal */}
      {imagePreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setImagePreview(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={imagePreview.url}
              alt={imagePreview.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
              {imagePreview.title}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ads