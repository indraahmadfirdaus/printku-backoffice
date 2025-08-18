import Modal from './Modal'
import Button from './Button'
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'warning', 'error'
  confirmText = 'OK',
  onConfirm
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-success" />
      case 'error':
        return <XCircle className="w-6 h-6 text-error" />
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-warning" />
      case 'info':
      default:
        return <Info className="w-6 h-6 text-info" />
    }
  }

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'text-success'
      case 'error':
        return 'text-error'
      case 'warning':
        return 'text-warning'
      case 'info':
      default:
        return 'text-info'
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closable={false}
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {getIcon()}
        </div>
        
        {title && (
          <h3 className={`text-lg font-semibold ${getTypeClass()}`}>
            {title}
          </h3>
        )}
        
        <p className="text-base-content/80">
          {message}
        </p>
        
        <div className="flex justify-center pt-2">
          <Button
            onClick={handleConfirm}
            className="min-w-[100px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AlertModal