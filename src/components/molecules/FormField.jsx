import Label from '@/components/atoms/Label'
import Input from '@/components/atoms/Input'
import { cn } from '@/utils/cn'

const FormField = ({ 
  label, 
  error, 
  className,
  required,
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      <Input error={error} {...props} />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default FormField