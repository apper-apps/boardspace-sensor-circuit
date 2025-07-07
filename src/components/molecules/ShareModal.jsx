import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const ShareModal = ({ 
  isOpen, 
  onClose, 
  dashboard, 
  onUpdatePublic, 
  onInviteUser, 
  onRemoveCollaborator,
  className 
}) => {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')
  const [isInviting, setIsInviting] = useState(false)

  const publicUrl = dashboard?.isPublic 
    ? `${window.location.origin}/dashboard/${dashboard.Id}/view`
    : null

  const handleTogglePublic = async () => {
    try {
      await onUpdatePublic(dashboard.Id, !dashboard.isPublic)
      toast.success(dashboard.isPublic ? 'Dashboard made private' : 'Dashboard made public')
    } catch (error) {
      toast.error('Failed to update dashboard visibility')
    }
  }

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl)
      toast.success('Link copied to clipboard')
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setIsInviting(true)
    try {
      await onInviteUser(dashboard.Id, inviteEmail, inviteRole)
      toast.success('Invitation sent successfully')
      setInviteEmail('')
    } catch (error) {
      toast.error('Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveCollaborator = async (invitationId) => {
    try {
      await onRemoveCollaborator(invitationId)
      toast.success('Collaborator removed')
    } catch (error) {
      toast.error('Failed to remove collaborator')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Share Dashboard
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Public Link Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Public Access</Label>
                <Button
                  variant={dashboard?.isPublic ? 'success' : 'outline'}
                  size="sm"
                  onClick={handleTogglePublic}
                >
                  {dashboard?.isPublic ? 'Public' : 'Private'}
                </Button>
              </div>
              
              {dashboard?.isPublic && (
                <div className="flex items-center space-x-2">
                  <Input
                    value={publicUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                  >
                    <ApperIcon name="Copy" className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                {dashboard?.isPublic 
                  ? 'Anyone with the link can view this dashboard'
                  : 'Only invited collaborators can access this dashboard'
                }
              </p>
            </div>

            {/* Invite Section */}
            <div className="space-y-3">
              <Label>Invite Collaborators</Label>
              <form onSubmit={handleInvite} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  disabled={!inviteEmail.trim() || isInviting}
                  size="sm"
                  className="w-full"
                >
                  {isInviting ? 'Sending...' : 'Send Invitation'}
                </Button>
              </form>
            </div>

            {/* Collaborators List */}
            <div className="space-y-3">
              <Label>Collaborators</Label>
              <div className="space-y-2">
                {/* Owner */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">You</p>
                      <p className="text-xs text-gray-500">owner@example.com</p>
                    </div>
                  </div>
                  <Badge variant="owner">Owner</Badge>
                </div>

                {/* Mock Collaborators */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Editor User</p>
                      <p className="text-xs text-gray-500">editor@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="editor">Editor</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCollaborator('mock-id')}
                    >
                      <ApperIcon name="X" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ShareModal