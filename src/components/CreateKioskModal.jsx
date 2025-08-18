import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from './UI/atoms/Modal'
import Input from './UI/atoms/Input'
import Button from './UI/atoms/Button'
import { Plus, Trash2, Printer } from 'lucide-react'

// Validation schema
const printerSchema = yup.object({
  name: yup.string().required('Nama printer harus diisi'),
  category: yup.string().oneOf(['DOCS', 'PHOTO'], 'Kategori printer harus DOCS atau PHOTO').required('Kategori printer harus dipilih'),
  paper_count: yup.number().integer().min(0, 'Jumlah kertas tidak boleh negatif').default(300),
  paper_capacity: yup.number().integer().min(1, 'Kapasitas kertas minimal 1').default(500),
  is_online: yup.boolean().default(false)
})

const createKioskSchema = yup.object({
  kiosk_code: yup.string()
    .required('Kode kiosk harus diisi')
    .min(3, 'Kode kiosk minimal 3 karakter')
    .max(20, 'Kode kiosk maksimal 20 karakter')
    .matches(/^[A-Z0-9]+$/, 'Kode kiosk hanya boleh menggunakan huruf dan angka (contoh: KIOSK001, ABC123)'),
  name: yup.string().required('Nama kiosk harus diisi'),
  location: yup.string().required('Lokasi kiosk harus diisi'),
  is_online: yup.boolean().default(false),
  printers: yup.array().of(printerSchema).min(1, 'Minimal harus ada 1 printer').required()
})

const CreateKioskModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(createKioskSchema),
    defaultValues: {
      kiosk_code: '',
      name: '',
      location: '',
      is_online: false,
      printers: [
        {
          name: 'Printer Dokumen',
          category: 'DOCS',
          paper_count: 300,
          paper_capacity: 500,
          is_online: false
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'printers'
  })

  const handleFormSubmit = async (data) => {
    // Convert string numbers to actual numbers
    const formattedData = {
      ...data,
      printers: data.printers.map(printer => ({
        ...printer,
        paper_count: parseInt(printer.paper_count) || 300,
        paper_capacity: parseInt(printer.paper_capacity) || 500
      }))
    }
    
    try {
      await onSubmit(formattedData)
      // Clear form after successful submission
      reset({
        kiosk_code: '',
        name: '',
        location: '',
        is_online: false,
        printers: [
          {
            name: 'Printer Dokumen',
            category: 'DOCS',
            paper_count: 300,
            paper_capacity: 500,
            is_online: false
          }
        ]
      })
    } catch (error) {
      // Error will be handled by parent component
      console.error('Error in form submission:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const addPrinter = () => {
    append({
      name: '',
      category: 'DOCS',
      paper_count: 300,
      paper_capacity: 500,
      is_online: false
    })
  }

  const removePrinter = (index) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  // Handler untuk auto uppercase kode kiosk
  const handleKioskCodeChange = (e) => {
    const value = e.target.value.toUpperCase()
    setValue('kiosk_code', value)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Kiosk Baru" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Kiosk Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informasi Kiosk</h3>
          
          <Input
            label="Kode Kiosk"
            placeholder="Contoh: KIOSK001"
            required
            error={errors.kiosk_code?.message}
            {...register('kiosk_code', {
              onChange: handleKioskCodeChange
            })}
          />

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
                    <span className="font-medium">Printer {index + 1}</span>
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
                      {/* <option value="BOTH">Dokumen & Foto</option> */}
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
              </div>
            ))}
          </div>
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
            <Plus size={16} />
            Tambah Kiosk
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateKioskModal