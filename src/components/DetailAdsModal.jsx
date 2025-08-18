import { Image, Video, Edit, ExternalLink } from 'lucide-react'
import Modal from './UI/atoms/Modal'
import Button from './UI/atoms/Button'

const DetailAdsModal = ({ 
  isOpen, 
  onClose, 
  adsData, 
  isLoading, 
  onEdit,
  onImageClick
}) => {
  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Ads"
      size="lg"
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : adsData ? (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Judul</h4>
                <p className="text-base">{adsData.title}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Tipe</h4>
                <div className="flex items-center gap-2">
                  {adsData.type === 'IMAGE' ? (
                    <>
                      <Image size={16} className="text-blue-600" />
                      <span>Gambar</span>
                    </>
                  ) : (
                    <>
                      <Video size={16} className="text-red-600" />
                      <span>Video</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Status</h4>
                <span className={`badge ${
                  adsData.isActive ? 'badge-success' : 'badge-error'
                }`}>
                  {adsData.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Urutan</h4>
                <p className="text-base font-mono">{adsData.order}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Durasi (detik)</h4>
                <p className="text-base font-mono">{adsData.duration}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Total View</h4>
                <p className="text-base font-mono">{adsData.totalViewCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Deskripsi</h4>
            <p className="text-base leading-relaxed">{adsData.description}</p>
          </div>

          {/* Content Preview */}
          <div className="space-y-4">
            <div className="divider">
              <div className="flex items-center gap-2">
                {adsData.type === 'IMAGE' ? (
                  <>
                    <Image size={16} />
                    <span>Konten Gambar</span>
                  </>
                ) : (
                  <>
                    <Video size={16} />
                    <span>Konten Video</span>
                  </>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {adsData.type === 'IMAGE' ? (
                adsData.imageUrl ? (
                  <img
                    src={adsData.imageUrl}
                    alt={adsData.title}
                    className="max-w-full h-48 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity mx-auto"
                    onClick={() => onImageClick && onImageClick(adsData.imageUrl, adsData.title)}
                  />
                ) : (
                  <div className="h-48 bg-gray-100 rounded border flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Image size={32} className="mx-auto mb-2 text-gray-400" />
                      <span>Tidak ada gambar</span>
                    </div>
                  </div>
                )
              ) : (
                adsData.youtubeId ? (
                  <div className="space-y-3">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${adsData.youtubeId}`}
                      title={adsData.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    ></iframe>
                    <a
                      href={`https://www.youtube.com/watch?v=${adsData.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm justify-center"
                    >
                      <ExternalLink size={14} />
                      Lihat di YouTube
                    </a>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 rounded border flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Video size={32} className="mx-auto mb-2 text-gray-400" />
                      <span>Tidak ada video</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Creator Info */}
          <div className="space-y-4">
            <div className="divider">
              <span>Informasi Pembuat</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Dibuat oleh</h4>
                <div className="space-y-1">
                  <p className="text-base">{adsData.admin?.fullName || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{adsData.admin?.email}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Tanggal Dibuat</h4>
                <p className="text-base">
                  {new Date(adsData.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Analytics */}
          {adsData.analytics && adsData.analytics.length > 0 && (
            <div className="space-y-4">
              <div className="divider">
                <span>Analytics</span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Analytics Harian</h4>
                <div className="border border-gray-200 rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                  {adsData.analytics.map((analytic, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm">
                        {new Date(analytic.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="font-mono font-medium">{analytic.view_count} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              onClick={() => onEdit && onEdit(adsData)}
              className="flex items-center gap-2"
            >
              <Edit size={14} />
              Edit Ads
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Data tidak ditemukan</p>
        </div>
      )}
    </Modal>
  )
}

export default DetailAdsModal