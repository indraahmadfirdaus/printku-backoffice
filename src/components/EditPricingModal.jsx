import Input from './UI/atoms/Input'

const EditPricingModal = ({
  isOpen,
  onClose,
  editModal,
  editForm,
  errors,
  onInputChange,
  onSubmit,
  updateDocumentMutation,
  updatePhotoMutation,
  formatColorType,
  formatPhotoSize
}) => {
  if (!isOpen) return null

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box w-11/12 max-w-md bg-base-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-base-content">
            Edit Harga {editModal.type === 'document' ? 'Dokumen' : 'Foto'}
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {editModal.type === 'document' && (
            <>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Jenis Cetak</span>
                </label>
                <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${editForm.color_type === 'COLOR' ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' : 'bg-base-content/60'}`}></div>
                  <span className="font-medium text-base-content">{formatColorType(editForm.color_type)}</span>
                </div>
              </div>
              
              <Input
                label="Harga per Halaman"
                type="number"
                value={editForm.price_per_page || ''}
                onChange={(e) => onInputChange('price_per_page', e.target.value)}
                error={errors.price_per_page}
                placeholder="Masukkan harga per halaman"
                required
              />
            </>
          )}

          {editModal.type === 'photo' && (
            <>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Ukuran Foto</span>
                </label>
                <div className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                  <div className="w-8 h-6 bg-base-300 rounded border-2 border-base-content/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-base-content">{editForm.photo_size?.replace('SIZE_', '')}</span>
                  </div>
                  <span className="font-medium text-base-content">{formatPhotoSize(editForm.photo_size)}</span>
                </div>
              </div>
              
              <Input
                label="Harga per Copy"
                type="number"
                value={editForm.price_per_copy || ''}
                onChange={(e) => onInputChange('price_per_copy', e.target.value)}
                error={errors.price_per_copy}
                placeholder="Masukkan harga per copy"
                required
              />
            </>
          )}

          {/* Buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={updateDocumentMutation.isPending || updatePhotoMutation.isPending}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSubmit}
              disabled={
                updateDocumentMutation.isPending || 
                updatePhotoMutation.isPending ||
                (editModal.type === 'document' && (!editForm.price_per_page || editForm.price_per_page <= 0)) ||
                (editModal.type === 'photo' && (!editForm.price_per_copy || editForm.price_per_copy <= 0)) ||
                Object.keys(errors).length > 0
              }
            >
              {(updateDocumentMutation.isPending || updatePhotoMutation.isPending) && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              Simpan
            </button>
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}

export default EditPricingModal