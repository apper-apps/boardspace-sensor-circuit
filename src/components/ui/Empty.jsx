import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel = 'Get Started',
  onAction,
  icon = 'Plus'
}) => {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 mb-6">
          {description}
        </p>
        {onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Empty