import { useEffect } from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { useAppStore } from '../../../stores/appStore'

const Notification = () => {
  const { notifications, removeNotification } = useAppStore()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'error':
        return <XCircle className="w-5 h-5 text-error" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-info" />
    }
  }

  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return 'alert-success'
      case 'error':
        return 'alert-error'
      case 'warning':
        return 'alert-warning'
      case 'info':
      default:
        return 'alert-info'
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="toast toast-top toast-end z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`alert ${getAlertClass(notification.type)} shadow-lg`}
        >
          {getIcon(notification.type)}
          <div>
            {notification.title && (
              <div className="font-bold">{notification.title}</div>
            )}
            <div className="text-sm">{notification.message}</div>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="btn btn-sm btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Notification