const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = '',
  compact = false,
  bordered = true,
  shadow = true
}) => {
  const cardClasses = [
    'card',
    bordered ? 'border border-base-300' : '',
    shadow ? 'shadow-lg' : '',
    'bg-base-100',
    className
  ].filter(Boolean).join(' ')

  const bodyClasses = [
    'card-body',
    compact ? 'p-4' : '',
    bodyClassName
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClasses}>
      <div className={bodyClasses}>
        {(title || subtitle) && (
          <div className="card-title flex-col items-start">
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            {subtitle && <p className="text-base-content/60 text-sm font-normal">{subtitle}</p>}
          </div>
        )}
        
        <div className="flex-1">
          {children}
        </div>
        
        {actions && (
          <div className="card-actions justify-end mt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default Card