import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import AddElementModal from '@/components/molecules/AddElementModal'
import ShareModal from '@/components/molecules/ShareModal'
import { cn } from '@/utils/cn'
const CanvasToolbar = ({ 
  dashboard, 
  onAddElement, 
  onUpdatePublic, 
  onInviteUser, 
  onRemoveCollaborator,
  onSave,
  isSaving,
  isViewOnly = false,
  className 
}) => {
  const navigate = useNavigate()
  const [showAddElement, setShowAddElement] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showGrid, setShowGrid] = useState(false)

  const handleAddElement = async (elementData) => {
    await onAddElement(elementData)
    setShowAddElement(false)
  }

  return (
    <>
      <div className={cn(
        'fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 backdrop-blur-md',
        className
      )}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  {dashboard?.title || 'Untitled Dashboard'}
                </h1>
                {isSaving && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Saving...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {!isViewOnly && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <ApperIcon name="Grid3X3" className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  
<Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddElement(true)}
                  >
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add Element
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(true)}
              >
                <ApperIcon name="Share" className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
<AddElementModal
        isOpen={showAddElement}
        onClose={() => setShowAddElement(false)}
        onAdd={handleAddElement}
      />
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        dashboard={dashboard}
        onUpdatePublic={onUpdatePublic}
        onInviteUser={onInviteUser}
        onRemoveCollaborator={onRemoveCollaborator}
      />
    </>
  )
}

export default CanvasToolbar