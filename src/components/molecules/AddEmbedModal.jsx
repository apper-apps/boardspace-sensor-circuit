import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const AddEmbedModal = ({ 
  isOpen, 
  onClose, 
  onAdd,
  className 
}) => {
  const [embedUrl, setEmbedUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!embedUrl.trim()) return

    setIsAdding(true)
    try {
      await onAdd({
        embedUrl: embedUrl.trim(),
        title: title.trim() || 'Untitled Embed'
      })
      toast.success('Embed added successfully')
      setEmbedUrl('')
      setTitle('')
      onClose()
    } catch (error) {
      toast.error('Failed to add embed')
    } finally {
      setIsAdding(false)
    }
  }

  const handleClose = () => {
    setEmbedUrl('')
    setTitle('')
    onClose()
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
            'bg-white rounded-lg shadow-xl max-w-md w-full',
            className
          )}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Embed
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                Enter any embeddable URL (Google Sheets, YouTube, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                type="text"
                placeholder="Enter a title for this embed"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!embedUrl.trim() || isAdding}
              >
                {isAdding ? 'Adding...' : 'Add Embed'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AddEmbedModal