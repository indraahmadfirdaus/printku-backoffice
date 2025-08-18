import { useState } from 'react'
import Modal from './UI/atoms/Modal'
import Button from './UI/atoms/Button'
import Card from './UI/atoms/Card'
import { useTransactions } from '../hooks/useTransactions'
import { 
  FileText, 
  Image, 
  User, 
  Printer, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ExternalLink,
  Download,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react'

const TransactionDetailModal = ({ isOpen, onClose, transactionId }) => {
  const { useTransactionDetail } = useTransactions()
  const { data: transaction, isLoading, error } = useTransactionDetail(transactionId)
  const [copiedField, setCopiedField] = useState(null)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PAID: { class: 'badge-success', text: 'Dibayar', icon: CheckCircle },
      PENDING_PAYMENT: { class: 'badge-warning', text: 'Menunggu Pembayaran', icon: Clock },
      PRINTED: { class: 'badge-info', text: 'Sudah Dicetak', icon: Printer },
      EXPIRED: { class: 'badge-error', text: 'Kedaluwarsa', icon: XCircle },
      FAILED: { class: 'badge-error', text: 'Gagal', icon: AlertCircle }
    }
    
    const config = statusConfig[status] || { class: 'badge-neutral', text: status, icon: AlertCircle }
    const Icon = config.icon
    
    return (
      <span className={`badge badge-lg ${config.class} gap-2`}>
        <Icon size={16} />
        {config.text}
      </span>
    )
  }

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      PAID: { class: 'badge-success', text: 'Lunas', icon: CheckCircle },
      PENDING: { class: 'badge-warning', text: 'Pending', icon: Clock },
      EXPIRED: { class: 'badge-error', text: 'Kedaluwarsa', icon: XCircle },
      FAILED: { class: 'badge-error', text: 'Gagal', icon: AlertCircle }
    }
    
    const config = statusConfig[status] || { class: 'badge-neutral', text: status, icon: AlertCircle }
    const Icon = config.icon
    
    return (
      <span className={`badge badge-lg ${config.class} gap-2`}>
        <Icon size={16} />
        {config.text}
      </span>
    )
  }

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadFile = () => {
    if (transaction?.file_url) {
      window.open(transaction.file_url, '_blank')
    }
  }

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Detail Transaksi" size="xl">
        <div className="flex justify-center items-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </Modal>
    )
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Detail Transaksi" size="xl">
        <div className="text-center py-12">
          <XCircle size={48} className="mx-auto text-error mb-4" />
          <h3 className="text-lg font-semibold mb-2">Transaksi Tidak Ditemukan</h3>
          <p className="text-base-content/70">Transaksi yang Anda cari tidak dapat ditemukan atau telah dihapus.</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Transaksi" size="xl">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">{transaction?.print_code}</h3>
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(transaction?.status)}
              {getPaymentStatusBadge(transaction?.payment?.status)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-base-content/70">Total Pembayaran</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(transaction?.total_price)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Information */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              {transaction?.print_type === 'DOCS' ? (
                <FileText size={24} className="text-primary" />
              ) : (
                <Image size={24} className="text-primary" />
              )}
              <h4 className="text-lg font-semibold">Informasi File</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-base-content/70">Nama File</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction?.file_name}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transaction?.file_name, 'filename')}
                    className="p-1"
                  >
                    {copiedField === 'filename' ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-base-content/70">Jenis Cetak</p>
                <p className="font-medium">
                  {transaction?.print_type === 'DOCS' ? 'Dokumen' : 'Foto'}
                  {transaction?.print_type === 'DOCS' && transaction?.docs_color_type && (
                    <span className="ml-2 text-sm text-base-content/70">
                      ({transaction?.docs_color_type === 'COLOR' ? 'Berwarna' : 'Hitam Putih'})
                    </span>
                  )}
                </p>
              </div>
              
              {transaction?.print_type === 'DOCS' && (
                <div>
                  <p className="text-sm text-base-content/70">Jumlah Halaman</p>
                  <p className="font-medium">{transaction?.page_count} halaman</p>
                </div>
              )}
              
              {transaction?.print_type === 'PHOTO' && (
                <>
                  <div>
                    <p className="text-sm text-base-content/70">Ukuran Foto</p>
                    <p className="font-medium">{transaction?.photo_size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Jumlah</p>
                    <p className="font-medium">{transaction?.photo_quantity} lembar</p>
                  </div>
                </>
              )}
              
              {transaction?.file_url && (
                <Button
                  variant="outline"
                  onClick={downloadFile}
                  className="w-full flex items-center gap-2"
                >
                  <Download size={16} />
                  Download File
                </Button>
              )}
            </div>
          </Card>

          {/* Customer Information */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <User size={24} className="text-primary" />
              <h4 className="text-lg font-semibold">Informasi Customer</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-base-content/70">Nomor HP</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction?.customer?.phone_number}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transaction?.customer?.phone_number, 'phone')}
                    className="p-1"
                  >
                    {copiedField === 'phone' ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-base-content/70">Total Jobs</p>
                <p className="font-medium">{transaction?.customer?.total_jobs} transaksi</p>
              </div>
              
              <div>
                <p className="text-sm text-base-content/70">Member Sejak</p>
                <p className="font-medium">{formatDate(transaction?.customer?.member_since)}</p>
              </div>
            </div>
          </Card>

          {/* Printer & Kiosk Information */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Printer size={24} className="text-primary" />
              <h4 className="text-lg font-semibold">Informasi Printer</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-base-content/70">Nama Printer</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction?.printer?.name}</p>
                  <span className={`badge badge-sm ${
                    transaction?.printer?.is_online ? 'badge-success' : 'badge-error'
                  }`}>
                    {transaction?.printer?.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-base-content/70">Kategori</p>
                <p className="font-medium">{transaction?.printer?.category}</p>
              </div>
              
              <div>
                <p className="text-sm text-base-content/70">Kertas Tersisa</p>
                <p className="font-medium">
                  {transaction?.printer?.paper_count} / {transaction?.printer?.paper_capacity} lembar
                </p>
                <div className="w-full bg-base-300 rounded-full h-2 mt-1">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ 
                      width: `${(transaction?.printer?.paper_count / transaction?.printer?.paper_capacity) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-base-content/70" />
                  <p className="text-sm text-base-content/70">Lokasi Kiosk</p>
                </div>
                <p className="font-medium">{transaction?.printer?.kiosk?.name}</p>
                <p className="text-sm text-base-content/70">{transaction?.printer?.kiosk?.location}</p>
                <p className="text-sm font-mono">{transaction?.printer?.kiosk?.kiosk_code}</p>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={24} className="text-primary" />
              <h4 className="text-lg font-semibold">Informasi Pembayaran</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-base-content/70">External ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">{transaction?.payment?.external_id}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transaction?.payment?.external_id, 'external_id')}
                    className="p-1"
                  >
                    {copiedField === 'external_id' ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-base-content/70">Jumlah</p>
                <p className="font-semibold text-lg">{formatCurrency(transaction?.payment?.amount)}</p>
              </div>
              
              {transaction?.payment?.paid_at && (
                <div>
                  <p className="text-sm text-base-content/70">Dibayar Pada</p>
                  <p className="font-medium">{formatDate(transaction?.payment?.paid_at)}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-base-content/70">Kedaluwarsa</p>
                <p className="font-medium">{formatDate(transaction?.payment?.expires_at)}</p>
              </div>
              
              {/* Webhook Information */}
              {transaction?.payment?.webhooks && transaction?.payment?.webhooks.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-base-content/70 mb-2">Webhook Events</p>
                  <div className="space-y-1">
                    {transaction?.payment?.webhooks.map((webhook, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{webhook.event_type}</span>
                        <div className="flex items-center gap-2">
                          <span className={`badge badge-xs ${
                            webhook.is_processed ? 'badge-success' : 'badge-warning'
                          }`}>
                            {webhook.is_processed ? 'Processed' : 'Pending'}
                          </span>
                          <span className="text-base-content/50">
                            {formatDate(webhook.received_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={24} className="text-primary" />
            <h4 className="text-lg font-semibold">Timeline</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div>
                <p className="font-medium">Transaksi Dibuat</p>
                <p className="text-sm text-base-content/70">{formatDate(transaction?.created_at)}</p>
              </div>
            </div>
            
            {transaction?.payment?.created_at && (
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <div>
                  <p className="font-medium">Pembayaran Dibuat</p>
                  <p className="text-sm text-base-content/70">{formatDate(transaction?.payment?.created_at)}</p>
                </div>
              </div>
            )}
            
            {transaction?.payment?.paid_at && (
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <div>
                  <p className="font-medium">Pembayaran Berhasil</p>
                  <p className="text-sm text-base-content/70">{formatDate(transaction?.payment?.paid_at)}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-info rounded-full"></div>
              <div>
                <p className="font-medium">Terakhir Diperbarui</p>
                <p className="text-sm text-base-content/70">{formatDate(transaction?.updated_at)}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  )
}

export default TransactionDetailModal