import { clsx } from 'clsx'

export const cn = (...inputs) => {
  return clsx(inputs)
}

export const formatDate = (date, format = 'dd/MM/yyyy') => {
  if (!date) return ''
  
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  switch (format) {
    case 'dd/MM/yyyy':
      return `${day}/${month}/${year}`
    case 'yyyy-MM-dd':
      return `${year}-${month}-${day}`
    case 'dd MMM yyyy':
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${day} ${months[d.getMonth()]} ${year}`
    default:
      return d.toLocaleDateString()
  }
}

export const formatCurrency = (amount, currency = 'IDR') => {
  if (!amount) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}