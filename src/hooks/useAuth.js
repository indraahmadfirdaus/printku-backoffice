import { useApiMutation } from './useBaseApi'
import { authService } from '../services'

export const useAuth = () => {
  const loginMutation = useApiMutation({
    mutationFn: authService.login,
    showErrorToast: false, // Handle manually in Login component
  })
  
  const logoutMutation = useApiMutation({
    mutationFn: authService.logout,
    successMessage: 'Logout berhasil'
  })

  const updateProfileMutation = useApiMutation({
    mutationFn: authService.updateProfile,
    successMessage: 'Profile berhasil diperbarui',
    invalidateQueries: [['auth', 'profile']]
  })

  const changePasswordMutation = useApiMutation({
    mutationFn: authService.changePassword,
    successMessage: 'Password berhasil diubah'
  })
  
  return {
    login: loginMutation,
    logout: logoutMutation,
    updateProfile: updateProfileMutation,
    changePassword: changePasswordMutation
  }
}