import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const DashboardCard = ({ 
  dashboard, 
  onShare, 
  onDuplicate, 
  onDelete,
  className 
}) => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleCardClick = () => {
    navigate(`/dashboard/${dashboard.Id}`)
  }

  const handleMenuToggle = (e) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuAction = (action, e) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    action(dashboard)
  }

  return (
    <Card 
      className={cn(
        'p-6 cursor-pointer card-hover relative group',
        className
      )}
      onClick={handleCardClick}
    >
{/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
        {dashboard.thumbnail_url ? (
          <img 
            src={dashboard.thumbnail_url} 
            alt={dashboard.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <ApperIcon name="Layout" className="h-8 w-8 text-gray-400" />
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
          {dashboard.title}
        </h3>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMenuToggle}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
          </Button>
          
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border z-50">
              <div className="py-1">
                <button
                  onClick={(e) => handleMenuAction(onShare, e)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <ApperIcon name="Share" className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={(e) => handleMenuAction(onDuplicate, e)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <ApperIcon name="Copy" className="h-4 w-4 mr-2" />
                  Duplicate
                </button>
                <button
                  onClick={(e) => handleMenuAction(onDelete, e)}
                  className="w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-100 flex items-center"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
<div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={dashboard.is_public ? 'success' : 'default'}>
            {dashboard.is_public ? 'Public' : 'Private'}
          </Badge>
          <Badge variant="owner">Owner</Badge>
        </div>
        <span className="text-sm text-gray-500">
          {dashboard.updated_at ? format(new Date(dashboard.updated_at), 'MMM d, yyyy') : 'No date'}
        </span>
      </div>

      {/* Overlay for menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={(e) => {
            e.stopPropagation()
            setIsMenuOpen(false)
          }}
        />
      )}
    </Card>
  )
}

export default DashboardCard