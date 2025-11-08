import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  required = false,
  fullWidth = true,
  size = 'md',
  variant = 'bordered',
  className = '',
  suffix,
  ...props
}, ref) => {
  const baseClasses = 'input'
  
  const variantClasses = {
    bordered: 'input-bordered',
    ghost: 'input-ghost',
    primary: 'input-primary',
    secondary: 'input-secondary',
    accent: 'input-accent',
    info: 'input-info',
    success: 'input-success',
    warning: 'input-warning',
    error: 'input-error'
  }
  
  const sizeClasses = {
    xs: 'input-xs',
    sm: 'input-sm',
    md: '',
    lg: 'input-lg'
  }
  
  const inputClasses = cn(
    baseClasses,
    variantClasses[error ? 'error' : variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
    suffix && 'pr-10'
  )

  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {suffix}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <label className="label">
          <span className={cn(
            'label-text-alt',
            error ? 'text-error' : 'text-base-content/60'
          )}>
            {error || helperText}
          </span>
        </label>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input