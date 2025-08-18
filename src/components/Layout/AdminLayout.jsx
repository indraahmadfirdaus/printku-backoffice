import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Monitor, 
  DollarSign, 
  Image, 
  UserCog,
  LogOut,
  Receipt
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAppStore } from '../../stores/appStore'
import { useAuth } from '../../hooks/useApi'

const AdminLayout = () => {
  const navigate = useNavigate()
  const { user, logout: logoutFromStore } = useAuthStore()
  const { logout } = useAuth()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Customer', path: '/customer' },
    { icon: Monitor, label: 'Kiosk', path: '/setup/kiosk' },
    { icon: DollarSign, label: 'Pricing', path: '/setup/pricing' },
    { icon: Image, label: 'Ads', path: '/setup/ads' },
    { icon: Receipt, label: 'Transaksi', path: '/transaksi' },
    { icon: UserCog, label: 'Akun Admin', path: '/akun-admin' },
  ]

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
      logoutFromStore()
      toast.success('Logout berhasil', {
        duration: 3000,
        position: 'top-right',
      })
      navigate('/login')
    } catch (error) {
      // Even if API call fails, still logout locally
      logoutFromStore()
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-base-100" data-theme="blackboxz">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-base-200 shadow-lg transition-all duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-primary">BlackBoxZ</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="btn btn-ghost btn-sm"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors ${
                      location.pathname === item.path ? 'bg-primary text-primary-content' : ''
                    }`}
                  >
                    <Icon size={20} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
          {!sidebarCollapsed && user && (
            <div className="mb-3">
              <p className="text-sm font-medium">{user.full_name}</p>
              <p className="text-xs text-base-content/60">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-error hover:text-error-content transition-colors"
            disabled={logout.isPending}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout