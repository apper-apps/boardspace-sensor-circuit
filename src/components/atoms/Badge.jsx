import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Badge = forwardRef(({ 
  variant = 'default',
  className,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-gray-900',
    error: 'bg-error text-white',
    owner: 'bg-primary text-white',
    editor: 'bg-accent text-white',
    viewer: 'bg-gray-500 text-white',
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = 'Badge'

export default Badge