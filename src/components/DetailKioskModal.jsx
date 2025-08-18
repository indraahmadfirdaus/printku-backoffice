import { useState } from 'react'
import Modal from './UI/atoms/Modal'
import Button from './UI/atoms/Button'
import { 
  Monitor, 
  MapPin, 
  Calendar, 
  Printer, 
  Wifi, 
  WifiOff, 
  FileText, 
  Image,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'

const DetailKioskModal = ({ isOpen, onClose, kioskData, isLoading = false }) => {
  if (!kioskData && !isLoading) {
    return null
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

  const getPrinterIcon = (category) => {
    return category === 'PHOTO' ? <Image size={16} /> : <FileText size={16} />
  }

  const getPaperStatus = (current, capacity) => {
    const percentage = (current / capacity) * 100
    if (percentage <= 20) return { color: 'text-error', bg: 'bg-error/10', status: 'Rendah' }
    if (percentage <= 50) return { color: 'text-warning', bg: 'bg-warning/10', status: 'Sedang' }
    return { color: 'text-success', bg: 'bg-success/10', status: 'Baik' }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Kiosk" size="full">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Kiosk Information */}
          <div className="bg-base-100 rounded-lg border p-6 space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <Monitor size={24} className="text-primary" />
              Informasi Kiosk
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-base-content/70">Kode Kiosk</label>
                  <div className="font-mono font-semibold text-xl mt-1">{kioskData.kiosk_code}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-base-content/70">Nama Kiosk</label>
                  <div className="font-medium text-lg mt-1">{kioskData.name}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-base-content/70 flex items-center gap-1">
                    <MapPin size={14} />
                    Lokasi
                  </label>
                  <div className="mt-1">{kioskData.location}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-base-content/70">Status Kiosk</label>
                  <div className="flex items-center gap-3 mt-2">
                    {kioskData.is_online ? (
                      <>
                        <div className="w-4 h-4 bg-success rounded-full"></div>
                        <span className="text-success font-semibold text-lg">Online</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 bg-error rounded-full"></div>
                        <span className="text-error font-semibold text-lg">Offline</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-base-content/70">Total Printer</label>
                  <div className="font-semibold text-2xl mt-1">{kioskData._count?.printers || 0}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-base-content/70 flex items-center gap-1">
                    <Calendar size={14} />
                    Dibuat
                  </label>
                  <div className="text-sm mt-1">{formatDate(kioskData.created_at)}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-base-content/70">Terakhir Update</label>
                  <div className="text-sm mt-1">{formatDate(kioskData.updated_at)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Printers Information */}
          <div className="bg-base-100 rounded-lg border p-6 space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <Printer size={24} className="text-primary" />
              Daftar Printer ({kioskData.printers?.length || 0})
            </h3>
            
            {!kioskData.printers || kioskData.printers.length === 0 ? (
              <div className="text-center py-12 text-base-content/60">
                <Printer size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Tidak ada printer yang terdaftar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {kioskData.printers.map((printer, index) => {
                  const paperStatus = getPaperStatus(printer.paper_count, printer.paper_capacity)
                  const paperPercentage = (printer.paper_count / printer.paper_capacity) * 100
                  
                  return (
                    <div key={printer.id} className="border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getPrinterIcon(printer.category)}
                            <span className="font-semibold text-lg">{printer.name}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            printer.category === 'PHOTO' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {printer.category === 'PHOTO' ? 'Foto' : 'Dokumen'}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {printer.is_online ? (
                            <div className="flex items-center gap-2 text-success">
                              <CheckCircle size={20} />
                              <span className="font-semibold">Online</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-error">
                              <X size={20} />
                              <span className="font-semibold">Offline</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-base-content/70">Status Kertas</label>
                          <div className={`flex items-center gap-3 mt-2 px-3 py-2 rounded-lg ${paperStatus.bg}`}>
                            <div className={`w-3 h-3 rounded-full ${paperStatus.color.replace('text-', 'bg-')}`}></div>
                            <span className={`font-semibold ${paperStatus.color}`}>
                              {paperStatus.status}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-base-content/70">Jumlah Kertas</label>
                          <div className="font-bold text-lg mt-1">
                            {printer.paper_count.toLocaleString()} / {printer.paper_capacity.toLocaleString()}
                          </div>
                          <div className="text-sm text-base-content/60">
                            ({paperPercentage.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-base-content/70">Terakhir Update</label>
                        <div className="text-sm mt-1">{formatDate(printer.updated_at)}</div>
                      </div>
                      
                      {/* Paper Level Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Level Kertas</span>
                          <span>{paperPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              paperPercentage <= 20 ? 'bg-error' :
                              paperPercentage <= 50 ? 'bg-warning' : 'bg-success'
                            }`}
                            style={{ width: `${Math.max(paperPercentage, 3)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              size="lg"
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default DetailKioskModal