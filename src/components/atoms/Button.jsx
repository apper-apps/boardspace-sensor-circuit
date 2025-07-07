import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-primary text-white hover:brightness-110 shadow-md',
    secondary: 'bg-secondary text-white hover:brightness-110 shadow-md',
    accent: 'bg-accent text-white hover:brightness-110 shadow-md',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-error text-white hover:brightness-110 shadow-md',
    success: 'bg-success text-white hover:brightness-110 shadow-md',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button