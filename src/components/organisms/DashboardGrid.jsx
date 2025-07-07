import { useState } from 'react'
import DashboardCard from '@/components/molecules/DashboardCard'
import ShareModal from '@/components/molecules/ShareModal'
import { toast } from 'react-toastify'
import { cn } from '@/utils/cn'

const DashboardGrid = ({ 
  dashboards, 
  onShare, 
  onDuplicate, 
  onDelete,
  onUpdatePublic,
  onInviteUser,
  onRemoveCollaborator,
  className 
}) => {
  const [shareModalDashboard, setShareModalDashboard] = useState(null)

  const handleShare = (dashboard) => {
    setShareModalDashboard(dashboard)
  }

  const handleDuplicate = async (dashboard) => {
    try {
      await onDuplicate(dashboard)
      toast.success('Dashboard duplicated successfully')
    } catch (error) {
      toast.error('Failed to duplicate dashboard')
    }
  }

  const handleDelete = async (dashboard) => {
    if (window.confirm('Are you sure you want to delete this dashboard?')) {
      try {
        await onDelete(dashboard.Id)
        toast.success('Dashboard deleted successfully')
      } catch (error) {
        toast.error('Failed to delete dashboard')
      }
    }
  }

  return (
    <>
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}>
        {dashboards.map((dashboard) => (
          <DashboardCard
            key={dashboard.Id}
            dashboard={dashboard}
            onShare={handleShare}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={!!shareModalDashboard}
        onClose={() => setShareModalDashboard(null)}
        dashboard={shareModalDashboard}
        onUpdatePublic={onUpdatePublic}
        onInviteUser={onInviteUser}
        onRemoveCollaborator={onRemoveCollaborator}
      />
    </>
  )
}

export default DashboardGrid