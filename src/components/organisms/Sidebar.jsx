import { useLocation, useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const navigationItems = [
    {
      name: 'All Dashboards',
      path: '/',
      icon: 'Layout',
      description: 'View all your dashboards'
    },
    {
      name: 'Recent',
      path: '/recent',
      icon: 'Clock',
      description: 'Recently viewed dashboards'
    },
    {
      name: 'Shared with me',
      path: '/shared',
      icon: 'Users',
      description: 'Dashboards shared by others'
    },
    {
      name: 'Templates',
      path: '/templates',
      icon: 'Bookmark',
      description: 'Pre-built dashboard templates'
    }
  ]

  const handleNavigation = (path) => {
    navigate(path)
    onClose?.()
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Layout" className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">BoardSpace</h2>
        </div>
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
              location.pathname === item.path
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <ApperIcon name={item.icon} className="h-5 w-5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className={cn(
                'text-xs truncate',
                location.pathname === item.path
                  ? 'text-white/70'
                  : 'text-gray-500'
              )}>
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </nav>

      {/* Create New Dashboard */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => handleNavigation('/dashboard/new')}
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Dashboard
        </Button>
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-left">
            <ApperIcon name="HelpCircle" className="h-5 w-5" />
            <span className="text-sm">Help & Support</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-left">
            <ApperIcon name="Settings" className="h-5 w-5" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar