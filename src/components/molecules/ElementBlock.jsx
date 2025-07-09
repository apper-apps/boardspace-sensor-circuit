import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const ElementBlock = ({
  block,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onDelete,
  isViewOnly = false,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const blockRef = useRef(null)

  const handleMouseDown = (e) => {
    if (isViewOnly) return
    
    e.preventDefault()
    e.stopPropagation()
    
    onSelect(block.Id)
    setIsDragging(true)
    setDragStart({
      x: e.clientX - block.posX,
      y: e.clientY - block.posY
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging || isViewOnly) return
    
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    onMove(block.Id, Math.max(0, newX), Math.max(0, newY))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  const handleResizeStart = (e, direction) => {
    if (isViewOnly) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: block.width,
      height: block.height
    })
  }

  const handleResizeMove = (e) => {
    if (!isResizing || isViewOnly) return
    
    const deltaX = e.clientX - resizeStart.x
    const deltaY = e.clientY - resizeStart.y
    
    const newWidth = Math.max(200, resizeStart.width + deltaX)
    const newHeight = Math.max(150, resizeStart.height + deltaY)
    
    onResize(block.Id, newWidth, newHeight)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(block.Id)
  }

  const renderContent = () => {
    const elementType = block.elementType || 'embed'
    
    switch (elementType) {
      case 'embed':
        return (
          <iframe
            src={block.embedUrl}
            className="w-full h-full border-0 rounded-lg"
            title={block.title}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )
      case 'iframe':
        return (
          <iframe
            src={block.embedUrl}
            className="w-full h-full border-0 rounded-lg"
            title={block.title}
          />
        )
      case 'text':
        return (
          <div className="w-full h-full p-4 bg-white rounded-lg overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{block.content}</p>
            </div>
          </div>
        )
      case 'link':
        return (
          <div className="w-full h-full p-4 bg-white rounded-lg flex items-center justify-center">
            <a
              href={block.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ApperIcon name="ExternalLink" className="h-5 w-5" />
              <span className="font-medium">{block.title}</span>
            </a>
          </div>
        )
      case 'image':
        return (
          <div className="w-full h-full bg-white rounded-lg overflow-hidden">
            <img
              src={block.imageUrl}
              alt={block.title}
              className="w-full h-full object-cover"
            />
          </div>
        )
      case 'file':
        return (
          <div className="w-full h-full p-4 bg-white rounded-lg flex items-center justify-center">
            <a
              href={block.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ApperIcon name="Download" className="h-5 w-5" />
              <span className="font-medium">{block.title}</span>
            </a>
          </div>
        )
      default:
        return (
          <div className="w-full h-full p-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Unknown element type</span>
          </div>
        )
    }
  }

  return (
    <>
      <motion.div
        ref={blockRef}
        className={cn(
          'absolute cursor-move shadow-embed hover:shadow-embed-hover transition-shadow duration-200 embed-block',
          isSelected && 'embed-block-selected',
          isDragging && 'z-50',
          className
        )}
        style={{
          left: block.posX,
          top: block.posY,
          width: block.width,
          height: block.height,
          zIndex: block.zIndex
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(block.Id)
        }}
        animate={{
          scale: isDragging ? 1.02 : 1
        }}
        transition={{ duration: 0.1 }}
      >
        {/* Drag handle */}
        {!isViewOnly && (
          <div className="drag-handle" />
        )}
        
        {/* Delete button */}
        {!isViewOnly && isSelected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full z-10"
          >
            <ApperIcon name="X" className="h-3 w-3" />
          </Button>
        )}
        
        {/* Content */}
        <div className="w-full h-full">
          {renderContent()}
        </div>
        
        {/* Resize handles */}
        {!isViewOnly && isSelected && (
          <>
            <div
              className="resize-handle nw"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="resize-handle ne"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="resize-handle sw"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="resize-handle se"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
          </>
        )}
      </motion.div>
      
      {/* Global mouse event handlers */}
      {(isDragging || isResizing) && (
        <div
          className="fixed inset-0 z-50 cursor-move"
          onMouseMove={isDragging ? handleMouseMove : handleResizeMove}
          onMouseUp={handleMouseUp}
          style={{ pointerEvents: 'all' }}
        />
      )}
    </>
  )
}

export default ElementBlock