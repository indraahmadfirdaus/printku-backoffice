import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from './UI/atoms/Modal'
import Input from './UI/atoms/Input'
import Button from './UI/atoms/Button'
import { useAdmin } from '../hooks/useAdmin'
import { useAuthStore } from '../stores/authStore'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

const schema = yup.object({
  full_name: yup
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .required('Nama lengkap wajib diisi'),
  email: yup
    .string()
    .email('Format email tidak valid')
    .required('Email wajib diisi'),
  password: yup
    .string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password wajib diisi'),
  role: yup
    .string()
    .oneOf(['CLIENT_ADMIN', 'PARTNER_ADMIN', 'SUPER_ADMIN'], 'Role tidak valid')
    .required('Role wajib dipilih')
})

const CreateAdminModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore()
  const { useCreateAdmin } = useAdmin()
  const createAdminMutation = useCreateAdmin()
  const [showPassword, setShowPassword] = useState(false)

  // Only SUPER_ADMIN can create admins
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      role: 'CLIENT_ADMIN'
    }
  })

  const handleFormSubmit = async (data) => {
    try {
      await createAdminMutation.mutateAsync(data)
      reset()
      onClose()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    setShowPassword(false)
    onClose()
  }

  // Don't render if not SUPER_ADMIN
  if (!isSuperAdmin) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Admin Baru" size="md">
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

        {/* Password with toggle visibility */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password <span className="text-error">*</span></span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              required
              error={errors.password?.message}
              {...register('password')}
              className="pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.password.message}</span>
            </label>
          )}
        </div>

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
            disabled={createAdminMutation.isPending}
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={createAdminMutation.isPending}
            className="flex items-center gap-2"
          >
            <UserPlus size={16} />
            Tambah Admin
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateAdminModal