import { useState } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import { useAuthStore } from '../stores/authStore'
import Table from '../components/UI/atoms/Table'
import Button from '../components/UI/atoms/Button'
import Card from '../components/UI/atoms/Card'
import CreateAdminModal from '../components/CreateAdminModal'
import EditAdminModal from '../components/EditAdminModal'
import { Plus, UserCog, Shield, Edit, Trash2, Eye } from 'lucide-react'

const AkunAdmin = () => {
  const { user } = useAuthStore()
  const { useAdminProfile, useAdmins, useDeleteAdmin } = useAdmin()
  
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Queries
  const { data: profileData, isLoading: isLoadingProfile } = useAdminProfile()
  const { data: adminsData, isLoading: isLoadingAdmins } = useAdmins()

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      SUPER_ADMIN: { class: 'badge-error', text: 'Super Admin', icon: Shield },
      CLIENT_ADMIN: { class: 'badge-primary', text: 'Client Admin', icon: UserCog },
      PARTNER_ADMIN: { class: 'badge-secondary', text: 'Partner Admin', icon: UserCog }
    }
    
    const config = roleConfig[role] || roleConfig.CLIENT_ADMIN
    const Icon = config.icon
    
    return (
      <span className={`badge badge-sm ${config.class} gap-1`}>
        <Icon size={12} />
        {config.text}
      </span>
    )
  }

  const columns = [
    {
      key: 'full_name',
      title: 'Nama Lengkap',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      render: (value) => (
        <div className="text-sm text-base-content/70">{value}</div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (value) => getRoleBadge(value)
    },
    {
      key: 'created_at',
      title: 'Tanggal Dibuat',
      render: (value) => (
        <div className="text-sm">{formatDate(value)}</div>
      )
    }
  ]

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manajemen Akun Admin</h1>
            <p className="text-base-content/70">
              Kelola akun administrator sistem
            </p>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Tambah Admin
            </Button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <UserCog size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Profil Saya</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-base-content/70">Nama Lengkap</p>
                <p className="font-medium">{profileData?.data?.admin?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Email</p>
                <p className="font-medium">{profileData?.data?.admin?.email}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Role</p>
                <div className="mt-1">
                  {getRoleBadge(profileData?.data?.admin?.role)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Admin List (SUPER_ADMIN only) */}
      {isSuperAdmin && (
        <Card>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Daftar Admin</h2>
          </div>
          <Table
            columns={columns}
            data={adminsData?.data?.admins || []}
            loading={isLoadingAdmins}
            emptyMessage="Belum ada admin yang terdaftar"
          />
        </Card>
      )}

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
}

export default AkunAdmin