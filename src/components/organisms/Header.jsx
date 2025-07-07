import { useLocation, useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuToggle, showMenuButton }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const isDashboardView = location.pathname.includes('/dashboard/') && location.pathname.includes('/view')
  const isCanvasEditor = location.pathname.includes('/dashboard/') && !location.pathname.includes('/view')

  if (isDashboardView || isCanvasEditor) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {showMenuButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="lg:hidden"
              >
                <ApperIcon name="Menu" className="h-5 w-5" />
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Layout" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">BoardSpace</h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ApperIcon name="Home" className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header