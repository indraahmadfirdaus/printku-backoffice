const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  outline = false,
  className = ''
}) => {
  const baseClasses = 'badge'
  
  const variantClasses = {
    neutral: 'badge-neutral',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    ghost: 'badge-ghost',
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error'
  }
  
  const sizeClasses = {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg'
  }
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    outline ? 'badge-outline' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      {children}
    </span>
  )
}

export default Badge