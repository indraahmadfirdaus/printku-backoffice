import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from './UI/atoms/Modal'
import Input from './UI/atoms/Input'
import Button from './UI/atoms/Button'
import { Plus, Trash2, Printer, Edit } from 'lucide-react'

// Validation schema
const printerSchema = yup.object({
  id: yup.string().optional(), // untuk existing printer
  name: yup.string().required('Nama printer harus diisi'),
  category: yup.string().oneOf(['DOCS', 'PHOTO'], 'Kategori printer harus DOCS atau PHOTO').required('Kategori printer harus dipilih'),
  paper_count: yup.number().integer().min(0, 'Jumlah kertas tidak boleh negatif').default(300),
  paper_capacity: yup.number().integer().min(1, 'Kapasitas kertas minimal 1').default(500),
  is_online: yup.boolean().default(false),
  _action: yup.string().oneOf(['create', 'update', 'delete']).optional() // untuk tracking action
})

const editKioskSchema = yup.object({
  name: yup.string().required('Nama kiosk harus diisi'),
  location: yup.string().required('Lokasi kiosk harus diisi'),
  is_online: yup.boolean().default(false),
  printers: yup.array().of(printerSchema).min(1, 'Minimal harus ada 1 printer').required()
})

const EditKioskModal = ({ isOpen, onClose, onSubmit, isLoading = false, kioskData = null }) => {
  const [deletedPrinters, setDeletedPrinters] = useState([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(editKioskSchema),
    defaultValues: {
      name: '',
      location: '',
      is_online: false,
      printers: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'printers'
  })

  // Reset form when kioskData changes
  useEffect(() => {
    if (kioskData && isOpen) {
      reset({
        name: kioskData.name || '',
        location: kioskData.location || '',
        is_online: kioskData.is_online || false,
        printers: kioskData.printers?.map(printer => ({
          id: printer.id,
          name: printer.name,
          category: printer.category,
          paper_count: printer.paper_count,
          paper_capacity: printer.paper_capacity,
          is_online: printer.is_online,
          _action: 'update' // mark as existing printer
        })) || []
      })
      setDeletedPrinters([])
    }
  }, [kioskData, isOpen, reset])

  const handleFormSubmit = async (data) => {
    // Separate printers by action
    const createPrinters = []
    const updatePrinters = []
    
    data.printers.forEach(printer => {
      const printerData = {
        name: printer.name,
        category: printer.category,
        paper_count: parseInt(printer.paper_count) || 300,
        paper_capacity: parseInt(printer.paper_capacity) || 500,
        is_online: printer.is_online
      }

      if (printer.id && printer._action === 'update') {
        // Existing printer to update
        updatePrinters.push({
          id: printer.id,
          ...printerData
        })
      } else {
        // New printer to create
        createPrinters.push(printerData)
      }
    })

    const formattedData = {
      name: data.name,
      location: data.location,
      is_online: data.is_online,
      printers: {
        create: createPrinters,
        update: updatePrinters,
        delete: deletedPrinters
      }
    }
    
    try {
      await onSubmit(formattedData)
      handleClose()
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  const handleClose = () => {
    reset()
    setDeletedPrinters([])
    onClose()
  }

  const addPrinter = () => {
    append({
      name: '',
      category: 'DOCS',
      paper_count: 300,
      paper_capacity: 500,
      is_online: false,
      _action: 'create' // mark as new printer
    })
  }

  const removePrinter = (index) => {
    const printer = fields[index]
    const watchedPrinters = watch('printers')
    const currentPrinter = watchedPrinters[index]
    
    // If it's an existing printer, add to deleted list using the actual database ID
    if (currentPrinter._action === 'update' && currentPrinter.id) {
      setDeletedPrinters(prev => [...prev, currentPrinter.id])
      console.log('Adding to delete list:', currentPrinter.id) // Debug log
    }
    
    // Remove from form
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Kiosk" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Kiosk Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informasi Kiosk</h3>
          
          <Input
            label="Nama Kiosk"
            placeholder="Contoh: Kiosk Mall Central"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Lokasi"
            placeholder="Contoh: Lantai 1 Mall Central"
            required
            error={errors.location?.message}
            {...register('location')}
          />

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register('is_online')}
              />
              <span className="label-text">Kiosk Online</span>
            </label>
          </div>
        </div>

        {/* Printers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Printer ({fields.length})</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPrinter}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Tambah Printer
            </Button>
          </div>

          {errors.printers?.message && (
            <div className="text-error text-sm">{errors.printers.message}</div>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer size={16} className="text-primary" />
                    <span className="font-medium">
                      Printer {index + 1}
                      {field._action === 'update' && (
                        <span className="text-xs text-base-content/60 ml-2">(Existing)</span>
                      )}
                      {field._action === 'create' && (
                        <span className="text-xs text-success ml-2">(New)</span>
                      )}
                    </span>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePrinter(index)}
                      className="text-error hover:bg-error/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nama Printer"
                    placeholder="Contoh: Printer Dokumen"
                    required
                    error={errors.printers?.[index]?.name?.message}
                    {...register(`printers.${index}.name`)}
                  />

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Kategori <span className="text-error">*</span>
                      </span>
                    </label>
                    <select
                      className={`select select-bordered w-full ${
                        errors.printers?.[index]?.category ? 'select-error' : ''
                      }`}
                      {...register(`printers.${index}.category`)}
                    >
                      <option value="DOCS">Dokumen</option>
                      <option value="PHOTO">Foto</option>
                    </select>
                    {errors.printers?.[index]?.category && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.printers[index].category.message}
                        </span>
                      </label>
                    )}
                  </div>

                  <Input
                    label="Jumlah Kertas Saat Ini"
                    type="number"
                    min="0"
                    placeholder="300"
                    error={errors.printers?.[index]?.paper_count?.message}
                    {...register(`printers.${index}.paper_count`)}
                  />

                  <Input
                    label="Kapasitas Maksimal Kertas"
                    type="number"
                    min="1"
                    placeholder="500"
                    error={errors.printers?.[index]?.paper_capacity?.message}
                    {...register(`printers.${index}.paper_capacity`)}
                  />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      {...register(`printers.${index}.is_online`)}
                    />
                    <span className="label-text">Printer Online</span>
                  </label>
                </div>

                {/* Hidden fields for tracking */}
                <input type="hidden" {...register(`printers.${index}.id`)} />
                <input type="hidden" {...register(`printers.${index}._action`)} />
              </div>
            ))}
          </div>

          {/* Show deleted printers info */}
          {deletedPrinters.length > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <p className="text-warning text-sm font-medium">
                {deletedPrinters.length} printer akan dihapus setelah menyimpan perubahan
              </p>
              <div className="text-xs text-warning/80 mt-1">
                IDs: {deletedPrinters.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            className="flex items-center gap-2"
          >
            <Edit size={16} />
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditKioskModal