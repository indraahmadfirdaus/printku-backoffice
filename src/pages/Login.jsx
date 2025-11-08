import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Input, Card } from '../components/UI/atoms'
import { useAuthStore } from '../stores/authStore'
import { useAuth } from '../hooks/useApi'
import orangeLogo from '../assets/orange.png'
import { Eye, EyeOff } from 'lucide-react'

const schema = yup.object({
  email: yup
    .string()
    .email('Format email tidak valid')
    .required('Email wajib diisi'),
  password: yup
    .string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password wajib diisi')
})

const Login = () => {
  const navigate = useNavigate()
  const { login: loginToStore } = useAuthStore()
  const { login } = useAuth()
  const isSubmittingRef = useRef(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    // Prevent double submission
    if (isSubmittingRef.current || login.isPending) {
      return
    }
    
    isSubmittingRef.current = true
    
    try {
      console.log('Attempting login with:', data)
      const response = await login.mutateAsync(data)
      
      console.log('Login response:', response)
      
      // Store auth data
      loginToStore(response)
      
      // Show success toast
      toast.success(`Selamat datang, ${response.admin.full_name}!`, {
        duration: 3000,
        position: 'top-right',
      })
      
      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      
      // Show error toast
      const errorMessage = error.message || 'Email atau password salah'
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      })
      
      // Set form errors if needed
      if (error.status === 401) {
        setError('email', { message: 'Email atau password salah' })
        setError('password', { message: 'Email atau password salah' })
      }
    } finally {
      isSubmittingRef.current = false
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center" data-theme="blackboxz">
      <Card className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={orangeLogo} alt="BlackBoxZ Logo" className="h-12" />
        </div>
        
        <h1 className="text-3xl font-bold text-center text-primary mb-2">BlackBoxZ</h1>
        <p className="text-center text-base-content/60 mb-6">Admin Panel Login</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            type="email"
            label="Email"
            placeholder="Masukkan email admin"
            error={errors.email?.message}
            {...register('email')}
          />
          
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Masukkan password"
            error={errors.password?.message}
            suffix={
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            {...register('password')}
          />
          
          <div className="mt-6">
            <Button 
              type="submit" 
              loading={login.isPending}
              disabled={login.isPending || isSubmittingRef.current}
              fullWidth
            >
              {login.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Login