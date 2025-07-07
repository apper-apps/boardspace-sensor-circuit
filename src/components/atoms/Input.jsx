import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(({ 
  type = 'text', 
  className,
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-error focus:ring-error',
        className
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input