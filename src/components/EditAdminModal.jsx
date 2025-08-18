import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from './UI/atoms/Modal'
import Input from './UI/atoms/Input'
import Button from './UI/atoms/Button'
import { useAdmin } from '../hooks/useAdmin'
import { Edit } from 'lucide-react'

const schema = yup.object({
  full_name: yup
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .required('Nama lengkap wajib diisi'),
  email: yup
    .string()
    .email('Format email tidak valid')
    .required('Email wajib diisi'),
  role: yup
    .string()
    .oneOf(['CLIENT_ADMIN', 'PARTNER_ADMIN', 'SUPER_ADMIN'], 'Role tidak valid')
    .required('Role wajib dipilih')
})

const EditAdminModal = ({ isOpen, onClose, adminData }) => {
  const { useUpdateAdmin } = useAdmin()
  const updateAdminMutation = useUpdateAdmin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (adminData && isOpen) {
      setValue('full_name', adminData.full_name || '')
      setValue('email', adminData.email || '')
      setValue('role', adminData.role || 'CLIENT_ADMIN')
    }
  }, [adminData, isOpen, setValue])

  const handleFormSubmit = async (data) => {
    try {
      await updateAdminMutation.mutateAsync({
        id: adminData.id,
        ...data
      })
      reset()
      onClose()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Admin" size="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          required
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Masukkan email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="form-control">
          <label className="label">
            <span className="label-text">Role <span className="text-error">*</span></span>
          </label>
          <select
            className={`select select-bordered w-full ${
              errors.role ? 'select-error' : ''
            }`}
            {...register('role')}
          >
            <option value="CLIENT_ADMIN">Client Admin</option>
            <option value="PARTNER_ADMIN">Partner Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          {errors.role && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.role.message}</span>
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={updateAdminMutation.isPending}
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={updateAdminMutation.isPending}
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

export default EditAdminModal