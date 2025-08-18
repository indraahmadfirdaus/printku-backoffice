import { useState, useMemo } from 'react'
import Table from '../components/UI/atoms/Table'
import Button from '../components/UI/atoms/Button'
import Input from '../components/UI/atoms/Input'
import Card from '../components/UI/atoms/Card'
import AlertModal from '../components/UI/atoms/AlertModal'
import TransactionDetailModal from '../components/TransactionDetailModal'
import { useTransactions } from '../hooks/useTransactions'
import { Search, Filter, Receipt, Download, Eye, FileText, Image } from 'lucide-react'

const Transaksi = () => {
  const { useTransactionOverview, useTransactionsList, useExportTransactions } = useTransactions()
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payment_status: '',
    print_type: '',
    date_from: '',
    date_to: '',
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  const [selectedTransactionId, setSelectedTransactionId] = useState(null)
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' })

  // Queries
  const { data: overviewData, isLoading: isLoadingOverview } = useTransactionOverview()
  const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactionsList(filters)
  const exportMutation = useExportTransactions()

  const handleViewDetail = (transactionId) => {
    setSelectedTransactionId(transactionId)
  }

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const showAlert = (title, message, type = 'info') => {
    setAlertModal({ isOpen: true, title, message, type })
  }

  const handleExport = async () => {
    // Validasi: pastikan tanggal mulai dan tanggal berakhir sudah dipilih
    if (!filters.date_from || !filters.date_to) {
      showAlert(
        'Tanggal Diperlukan',
        'Silakan pilih tanggal mulai dan tanggal berakhir terlebih dahulu untuk membatasi data yang diekspor.',
        'warning'
      )
      return
    }

    // Validasi: pastikan tanggal mulai tidak lebih besar dari tanggal berakhir
    if (new Date(filters.date_from) > new Date(filters.date_to)) {
      showAlert(
        'Tanggal Tidak Valid',
        'Tanggal mulai tidak boleh lebih besar dari tanggal berakhir.',
        'error'
      )
      return
    }

    try {
      const blob = await exportMutation.mutateAsync(filters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PAID: { class: 'badge-success', text: 'Dibayar' },
      PENDING_PAYMENT: { class: 'badge-warning', text: 'Menunggu Pembayaran' },
      PRINTED: { class: 'badge-info', text: 'Sudah Dicetak' },
      EXPIRED: { class: 'badge-error', text: 'Kedaluwarsa' },
      FAILED: { class: 'badge-error', text: 'Gagal' }
    }
    
    const config = statusConfig[status] || { class: 'badge-neutral', text: status }
    return (
      <span className={`badge badge-sm ${config.class}`}>
        {config.text}
      </span>
    )
  }

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      PAID: { class: 'badge-success', text: 'Lunas' },
      PENDING: { class: 'badge-warning', text: 'Pending' },
      EXPIRED: { class: 'badge-error', text: 'Kedaluwarsa' },
      FAILED: { class: 'badge-error', text: 'Gagal' }
    }
    
    const config = statusConfig[status] || { class: 'badge-neutral', text: status }
    return (
      <span className={`badge badge-sm ${config.class}`}>
        {config.text}
      </span>
    )
  }

  const getPrintTypeIcon = (type) => {
    return type === 'DOCS' ? <FileText size={16} /> : <Image size={16} />
  }

  const columns = [
    {
      key: 'print_code',
      title: 'Kode Print',
      render: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value) => (
        <span className="font-medium">{value?.phone_number}</span>
      )
    },
    {
      key: 'printer',
      title: 'Kiosk',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.kiosk?.name}</div>
          <div className="text-xs text-base-content/70">{value?.name}</div>
        </div>
      )
    },
    {
      key: 'print_type',
      title: 'Jenis',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {getPrintTypeIcon(value)}
          <div>
            <div className="font-medium">{value === 'DOCS' ? 'Dokumen' : 'Foto'}</div>
            {value === 'DOCS' && (
              <div className="text-xs text-base-content/70">
                {row.docs_color_type === 'COLOR' ? 'Berwarna' : 'Hitam Putih'} • {row.page_count} hal
              </div>
            )}
            {value === 'PHOTO' && (
              <div className="text-xs text-base-content/70">
                {row.photo_size} • {row.photo_quantity} pcs
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'total_price',
      title: 'Total',
      render: (value) => (
        <span className="font-semibold text-primary">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'status',
      title: 'Status Job',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'payment',
      title: 'Status Bayar',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (value) => getPaymentStatusBadge(value?.status)
    },
    {
      key: 'created_at',
      title: 'Tanggal',
      render: (value) => formatDate(value)
    },
    {
      key: 'actions',
      title: 'Aksi',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs px-2 py-1 text-info hover:bg-info/10"
            onClick={() => handleViewDetail(row.id)}
          >
            <Eye size={12} />
            Detail
          </Button>
        </div>
      )
    }
  ]

  // Stats dari overview
  const stats = useMemo(() => {
    if (!overviewData) return []
    
    const statusStats = overviewData.status_stats || []
    const paidCount = statusStats.find(s => s.status === 'PAID')?.count || 0
    const pendingCount = statusStats.find(s => s.status === 'PENDING_PAYMENT')?.count || 0
    const failedCount = statusStats.find(s => s.status === 'FAILED')?.count || 0
    
    return [
      {
        title: 'Total Transaksi',
        value: overviewData.total_transactions || 0,
        icon: Receipt,
        color: 'success'
      },
      {
        title: 'Total Pendapatan',
        value: formatCurrency(overviewData.total_revenue || 0),
        icon: Receipt,
        color: 'primary'
      },
      {
        title: 'Hari Ini',
        value: `${overviewData.today_transactions || 0} transaksi`,
        subtitle: formatCurrency(overviewData.today_revenue || 0),
        icon: Receipt,
        color: 'info'
      },
      {
        title: 'Pending',
        value: pendingCount,
        icon: Receipt,
        color: 'warning'
      }
    ]
  }, [overviewData])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Transaksi</h1>
        <p className="text-base-content/70">
          Kelola dan pantau semua transaksi kiosk
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-${stat.color}/10 rounded-lg`}>
                  <Icon size={20} className={`text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-base-content/50">{stat.subtitle}</p>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan nomor HP atau kode print..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full"
                leftIcon={<Search size={16} />}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="select select-bordered"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Semua Status Job</option>
                <option value="PAID">Dibayar</option>
                <option value="PENDING_PAYMENT">Menunggu Pembayaran</option>
                <option value="PRINTED">Sudah Dicetak</option>
                <option value="EXPIRED">Kedaluwarsa</option>
                <option value="FAILED">Gagal</option>
              </select>
              <select 
                className="select select-bordered"
                value={filters.payment_status}
                onChange={(e) => handleFilterChange('payment_status', e.target.value)}
              >
                <option value="">Semua Status Bayar</option>
                <option value="PAID">Lunas</option>
                <option value="PENDING">Pending</option>
                <option value="EXPIRED">Kedaluwarsa</option>
                <option value="FAILED">Gagal</option>
              </select>
              <select 
                className="select select-bordered"
                value={filters.print_type}
                onChange={(e) => handleFilterChange('print_type', e.target.value)}
              >
                <option value="">Semua Jenis</option>
                <option value="DOCS">Dokumen</option>
                <option value="PHOTO">Foto</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Tanggal Mulai"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
              />
              <Input
                type="date"
                placeholder="Tanggal Akhir"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setFilters({
                  search: '',
                  status: '',
                  payment_status: '',
                  print_type: '',
                  date_from: '',
                  date_to: '',
                  page: 1,
                  limit: 10,
                  sort_by: 'created_at',
                  sort_order: 'desc'
                })}
              >
                <Filter size={16} />
                Reset Filter
              </Button>
              <div className="relative group">
                <Button
                  onClick={handleExport}
                  disabled={exportMutation.isPending || !filters.date_from || !filters.date_to}
                  className="flex items-center gap-2"
                  variant="primary"
                >
                  {exportMutation.isPending ? (
                    <div className="loading loading-spinner loading-sm"></div>
                  ) : (
                    <Download size={16} />
                  )}
                  Export Data
                </Button>
                {(!filters.date_from || !filters.date_to) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                    Silakan pilih tanggal mulai dan berakhir sebelum export
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
        <div className="flex-1 text-xs ml-24 mt-2 text-base-content/50">
        {(!filters.date_from || !filters.date_to) && "(Pilih filter tanggal terlebih dahulu untuk mengekspor data)"}
            </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Daftar Transaksi</h2>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            data={transactionsData?.transactions || []}
            loading={isLoadingTransactions}
            pagination={{
              page: filters.page,
              limit: filters.limit,
              total: transactionsData?.pagination?.total_count || 0,
              totalPages: transactionsData?.pagination?.total_pages || 0,
              has_next: transactionsData?.pagination?.has_next || false,
              has_prev: transactionsData?.pagination?.has_prev || false,
              onPageChange: handlePageChange,
              onLimitChange: (limit) => handleFilterChange('limit', limit)
            }}
          />
        </div>
      </Card>
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

      {/* Transaction Detail Modal */}
      {selectedTransactionId && (
        <TransactionDetailModal
          isOpen={!!selectedTransactionId}
          onClose={() => setSelectedTransactionId(null)}
          transactionId={selectedTransactionId}
        />
      )}
    </div>
  )
}

export default Transaksi