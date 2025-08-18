import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from './UI/atoms/Modal'
import Button from './UI/atoms/Button'
import Input from './UI/atoms/Input'
import { Upload, Image, Video, X, Eye, EyeOff } from 'lucide-react'
import AlertModal from './UI/atoms/AlertModal'

// Validation schema
const adsSchema = yup.object({
  title: yup.string().required('Judul wajib diisi').max(100, 'Judul maksimal 100 karakter'),
  description: yup.string().required('Deskripsi wajib diisi').max(500, 'Deskripsi maksimal 500 karakter'),
  type: yup.string().oneOf(['IMAGE', 'VIDEO'], 'Tipe harus IMAGE atau VIDEO').required('Tipe wajib dipilih'),
  image_url: yup.string().when('type', {
    is: 'IMAGE',
    then: (schema) => schema.required('URL gambar wajib diisi untuk tipe IMAGE'),
    otherwise: (schema) => schema.nullable()
  }),
  youtube_id: yup.string().when('type', {
    is: 'VIDEO',
    then: (schema) => schema.required('YouTube ID wajib diisi untuk tipe VIDEO'),
    otherwise: (schema) => schema.nullable()
  }),
  duration: yup.number().when('type', {
    is: 'VIDEO',
    then: (schema) => schema.min(1, 'Durasi minimal 1 detik').required('Durasi wajib diisi untuk tipe VIDEO'),
    otherwise: (schema) => schema.transform(() => 5).default(5) // Always 5 for IMAGE
  }),
  is_active: yup.boolean().default(true),
  order: yup.number().min(1, 'Urutan minimal 1').required('Urutan wajib diisi')
})

const CreateAdsModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onUploadMedia,
  isLoading = false,
  isUploading = false,
  adsData = null // For edit mode
}) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' })

  const isEditMode = !!adsData

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(adsSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'IMAGE',
      image_url: '',
      youtube_id: '',
      duration: 5, // Default 5 seconds for IMAGE
      is_active: true,
      order: 1
    }
  })

  const watchType = watch('type')
  const watchImageUrl = watch('image_url')
  const watchYoutubeId = watch('youtube_id')

  // Reset form when modal opens/closes or data changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && adsData) {
        reset({
          title: adsData.title || '',
          description: adsData.description || '',
          type: adsData.type || 'IMAGE',
          image_url: adsData.imageUrl || '',
          youtube_id: adsData.youtubeId || '',
          duration: adsData.duration || (adsData.type === 'VIDEO' ? 30 : 5),
          is_active: adsData.isActive ?? true,
          order: adsData.order || 1
        })
        setUploadedImageUrl(adsData.imageUrl || null)
      } else {
        reset({
          title: '',
          description: '',
          type: 'IMAGE',
          image_url: '',
          youtube_id: '',
          duration: 5,
          is_active: true,
          order: 1
        })
        setUploadedImageUrl(null)
      }
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }, [isOpen, isEditMode, adsData, reset])

  const showAlert = (title, message, type = 'info') => {
    setAlertModal({ isOpen: true, title, message, type })
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        showAlert(
          'File Tidak Didukung',
          'Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.',
          'error'
        )
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert(
          'File Terlalu Besar',
          'Ukuran file terlalu besar. Maksimal 5MB.',
          'error'
        )
        return
      }

      setSelectedFile(file)
      
      // Reset uploaded image URL when new file is selected
      setUploadedImageUrl(null)
      setValue('image_url', '')
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Handle media upload
  const handleUploadMedia = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('media', selectedFile)

    try {
      const result = await onUploadMedia(formData)
      // Use the correct response structure from API
      if (result?.data?.file_url) {
        setUploadedImageUrl(result.data.file_url)
        setValue('image_url', result.data.file_url)
        setSelectedFile(null)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  // Handle form submission
  const handleFormSubmit = (data) => {
    // Clean up data based on type
    const cleanData = {
      ...data,
      image_url: data.type === 'IMAGE' ? data.image_url : null,
      youtube_id: data.type === 'VIDEO' ? data.youtube_id : null,
      duration: data.type === 'VIDEO' ? data.duration : 5 // Always 5 seconds for IMAGE
    }

    onSubmit(cleanData)
  }

  // Extract YouTube ID from URL - simplified
  const extractYouTubeId = (url) => {
    if (!url) return ''
    
    // If it's already just an ID (11 characters), return as is
    if (url.length === 11 && !/[\/\?\&\=]/.test(url)) {
      return url
    }
    
    // Extract from various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  const handleYouTubeUrlChange = (e) => {
    const value = e.target.value
    const youtubeId = extractYouTubeId(value)
    setValue('youtube_id', youtubeId)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditMode ? 'Edit Ads' : 'Buat Ads Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Info Section */}
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-info mt-0.5 flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-base-content">Tentang Ads & Media</h4>
                <div className="text-sm text-base-content/80 space-y-1">
                  <p>• Ads akan ditampilkan secara bergiliran di layar kiosk</p>
                  <p>• Gambar akan ditampilkan selama 5 detik, video sesuai durasi yang ditentukan</p>
                  <p>• Urutan menentukan prioritas tampilan (angka kecil = prioritas tinggi)</p>
                  <p>• Hanya ads yang aktif yang akan ditampilkan di kiosk</p>
                  <p>• Format gambar yang didukung: JPEG, PNG, GIF, WebP</p>
                  <p>• Video menggunakan YouTube dengan embed player</p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <Input
              label="Judul Ads"
              placeholder="Masukkan judul ads..."
              {...register('title')}
              error={errors.title?.message}
            />

            <div className="form-control">
              <label className="label">
                <span className="label-text">Deskripsi</span>
              </label>
              <textarea
                className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Masukkan deskripsi ads..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description.message}</span>
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tipe Ads</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  {...register('type')}
                >
                  <option value="IMAGE">Gambar</option>
                  <option value="VIDEO">Video YouTube</option>
                </select>
              </div>

              <Input
                label="Urutan"
                type="number"
                min="1"
                placeholder="1"
                {...register('order')}
                error={errors.order?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Durasi (detik)"
                type="number"
                min="1"
                placeholder={watchType === 'VIDEO' ? '180' : '5'}
                disabled={watchType === 'IMAGE'}
                {...register('duration')}
                error={errors.duration?.message}
                helperText={watchType === 'IMAGE' ? 'Durasi gambar otomatis 5 detik' : 'Masukkan durasi video dalam detik'}
              />
              
              <div className="form-control">
                <label className="cursor-pointer label justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    {...register('is_active')}
                  />
                  <span className="label-text">Aktifkan ads</span>
                </label>
              </div>
            </div>
          </div>

          {/* Content based on type */}
          {watchType === 'IMAGE' && (
            <div className="space-y-4">
              <div className="divider">
                <div className="flex items-center gap-2">
                  <Image size={16} />
                  <span>Konten Gambar</span>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Upload Gambar</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="file-input file-input-bordered flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleUploadMedia}
                    disabled={!selectedFile || isUploading}
                    loading={isUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Upload
                  </Button>
                </div>
                <label className="label">
                  <span className="label-text-alt">Format: JPG, PNG, GIF, WebP. Maksimal 5MB.</span>
                </label>
              </div>

              {/* Preview */}
              {(previewUrl || uploadedImageUrl) && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Preview</span>
                  </label>
                  <div className="relative w-full max-w-md">
                    <img
                      src={previewUrl || uploadedImageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    {(previewUrl && !uploadedImageUrl) || (selectedFile && previewUrl) ? (
                      <div className="absolute top-2 right-2">
                        <div className="badge badge-warning">Belum diupload</div>
                      </div>
                    ) : uploadedImageUrl && !selectedFile ? (
                      <div className="absolute top-2 right-2">
                        <div className="badge badge-success">Berhasil diupload</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Simplified URL field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">URL Gambar</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.image_url ? 'input-error' : ''} ${uploadedImageUrl ? 'bg-base-200' : ''}`}
                  placeholder="URL gambar akan muncul setelah upload..."
                  {...register('image_url')}
                  readOnly={!!uploadedImageUrl}
                />
                {errors.image_url && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.image_url.message}</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {watchType === 'VIDEO' && (
            <div className="space-y-4">
              <div className="divider">
                <div className="flex items-center gap-2">
                  <Video size={16} />
                  <span>Konten Video YouTube</span>
                </div>
              </div>

              {/* Simplified YouTube input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">YouTube URL</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.youtube_id ? 'input-error' : ''}`}
                  placeholder="Masukkan URL YouTube atau ID video"
                  onChange={handleYouTubeUrlChange}
                />
                {errors.youtube_id && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.youtube_id.message}</span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt">Contoh: https://youtu.be/dQw4w9WgXcQ atau dQw4w9WgXcQ</span>
                </label>
              </div>

              {/* YouTube Preview */}
              {watchYoutubeId && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Preview YouTube</span>
                  </label>
                  <div className="aspect-video w-full max-w-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${watchYoutubeId}`}
                      title="YouTube Preview"
                      className="w-full h-full rounded-lg border"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={watchType === 'IMAGE' && !watchImageUrl}
            >
              {isEditMode ? 'Perbarui' : 'Buat'} Ads
            </Button>
          </div>
        </form>
      </Modal>
      
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  )
}

export default CreateAdsModal