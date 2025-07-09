import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'
import { validateUrl, validateImageUrl, validateFileUrl } from '@/utils/validation'

const ELEMENT_TYPES = [
  { 
    id: 'embed', 
    name: 'Embed', 
    icon: 'Code2', 
    description: 'Embed content from websites' 
  },
  { 
    id: 'iframe', 
    name: 'IFrame', 
    icon: 'Monitor', 
    description: 'Display external websites' 
  },
  { 
    id: 'text', 
    name: 'Text', 
    icon: 'FileText', 
    description: 'Add text content' 
  },
  { 
    id: 'link', 
    name: 'Link', 
    icon: 'Link', 
    description: 'Add clickable links' 
  },
  { 
    id: 'image', 
    name: 'Image', 
    icon: 'Image', 
    description: 'Display images' 
  },
  { 
    id: 'file', 
    name: 'File', 
    icon: 'File', 
    description: 'Link to files' 
  }
]

const AddElementModal = ({ 
  isOpen, 
  onClose, 
  onAdd,
  className 
}) => {
  const [selectedType, setSelectedType] = useState('embed')
  const [formData, setFormData] = useState({
    title: '',
    embedUrl: '',
    content: '',
    linkUrl: '',
    imageUrl: '',
    fileUrl: ''
  })
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate based on element type
    let isValid = true
    let errorMessage = ''
    
    switch (selectedType) {
      case 'embed':
      case 'iframe':
        if (!formData.embedUrl.trim()) {
          isValid = false
          errorMessage = 'URL is required'
        } else if (!validateUrl(formData.embedUrl)) {
          isValid = false
          errorMessage = 'Invalid URL format'
        }
        break
      case 'text':
        if (!formData.content.trim()) {
          isValid = false
          errorMessage = 'Text content is required'
        }
        break
      case 'link':
        if (!formData.linkUrl.trim()) {
          isValid = false
          errorMessage = 'Link URL is required'
        } else if (!validateUrl(formData.linkUrl)) {
          isValid = false
          errorMessage = 'Invalid URL format'
        }
        break
      case 'image':
        if (!formData.imageUrl.trim()) {
          isValid = false
          errorMessage = 'Image URL is required'
        } else if (!validateImageUrl(formData.imageUrl)) {
          isValid = false
          errorMessage = 'Invalid image URL'
        }
        break
      case 'file':
        if (!formData.fileUrl.trim()) {
          isValid = false
          errorMessage = 'File URL is required'
        } else if (!validateFileUrl(formData.fileUrl)) {
          isValid = false
          errorMessage = 'Invalid file URL'
        }
        break
    }

    if (!isValid) {
      toast.error(errorMessage)
      return
    }

    setIsAdding(true)
    try {
      await onAdd({
        elementType: selectedType,
        ...formData,
        title: formData.title.trim() || `Untitled ${selectedType}`
      })
      toast.success('Element added successfully')
      handleClose()
    } catch (error) {
      toast.error('Failed to add element')
    } finally {
      setIsAdding(false)
    }
  }

  const handleClose = () => {
    setSelectedType('embed')
    setFormData({
      title: '',
      embedUrl: '',
      content: '',
      linkUrl: '',
      imageUrl: '',
      fileUrl: ''
    })
    onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderTypeSelector = () => (
    <div className="space-y-3">
      <Label>Element Type</Label>
      <div className="grid grid-cols-2 gap-3">
        {ELEMENT_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setSelectedType(type.id)}
            className={cn(
              'p-3 rounded-lg border-2 text-left transition-all',
              selectedType === type.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name={type.icon} className="h-4 w-4" />
              <span className="font-medium">{type.name}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (selectedType) {
      case 'embed':
      case 'iframe':
        return (
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={formData.embedUrl}
              onChange={(e) => handleInputChange('embedUrl', e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              {selectedType === 'embed' 
                ? 'Enter any embeddable URL (Google Sheets, YouTube, etc.)'
                : 'Enter the URL to display in an iframe'
              }
            </p>
          </div>
        )
      case 'text':
        return (
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Textarea
              placeholder="Enter your text content here..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={4}
              required
            />
          </div>
        )
      case 'link':
        return (
          <div className="space-y-2">
            <Label>Link URL</Label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={formData.linkUrl}
              onChange={(e) => handleInputChange('linkUrl', e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Enter the URL this link should navigate to
            </p>
          </div>
        )
      case 'image':
        return (
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Enter the URL of the image to display
            </p>
          </div>
        )
      case 'file':
        return (
          <div className="space-y-2">
            <Label>File URL</Label>
            <Input
              type="url"
              placeholder="https://example.com/document.pdf"
              value={formData.fileUrl}
              onChange={(e) => handleInputChange('fileUrl', e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Enter the URL of the file to link to
            </p>
          </div>
        )
      default:
        return null
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
            'bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Element
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
            {renderTypeSelector()}
            
            {renderContent()}

            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                type="text"
                placeholder="Enter a title for this element"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
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
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add Element'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AddElementModal