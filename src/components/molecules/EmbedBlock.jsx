import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const EmbedBlock = ({ 
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

  const handleResizeStart = (e, direction) => {
    if (isViewOnly) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: block.width,
      height: block.height,
      direction
    })
  }

  const handleMouseMove = (e) => {
    if (isViewOnly) return
    
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragStart.x)
      const newY = Math.max(0, e.clientY - dragStart.y)
      onMove(block.Id, newX, newY)
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      
      if (resizeStart.direction.includes('e')) {
        newWidth = Math.max(200, resizeStart.width + deltaX)
      }
      if (resizeStart.direction.includes('w')) {
        newWidth = Math.max(200, resizeStart.width - deltaX)
      }
      if (resizeStart.direction.includes('s')) {
        newHeight = Math.max(150, resizeStart.height + deltaY)
      }
      if (resizeStart.direction.includes('n')) {
        newHeight = Math.max(150, resizeStart.height - deltaY)
      }
      
      onResize(block.Id, newWidth, newHeight)
    }
  }

  const handleMouseUp = () => {
    if (isViewOnly) return
    
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart])

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(block.Id)
  }

  return (
    <motion.div
      ref={blockRef}
      className={cn(
        'absolute bg-white rounded-lg shadow-embed border border-gray-200 overflow-hidden group embed-block',
        isSelected && 'embed-block-selected',
        isDragging && 'z-50',
        !isViewOnly && 'hover:shadow-embed-hover',
        className
      )}
      style={{
        left: block.posX,
        top: block.posY,
        width: block.width,
        height: block.height,
        zIndex: block.zIndex
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (!isViewOnly) onSelect(block.Id)
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Drag Handle */}
      {!isViewOnly && (
        <div 
          className="drag-handle"
          onMouseDown={handleMouseDown}
        >
          <div className="w-4 h-1 bg-primary rounded-full opacity-60"></div>
        </div>
      )}

      {/* Delete Button */}
      {!isViewOnly && isSelected && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ApperIcon name="X" className="h-3 w-3" />
        </button>
      )}

      {/* Content */}
      <div className="w-full h-full p-3">
        {block.title && (
          <h4 className="text-sm font-medium text-gray-900 mb-2 truncate">
            {block.title}
          </h4>
        )}
        
        <div className="w-full h-full bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center">
          {block.embedUrl ? (
            <iframe
              src={block.embedUrl}
              className="w-full h-full rounded"
              frameBorder="0"
              allowFullScreen
              title={block.title || 'Embedded content'}
            />
          ) : (
            <div className="text-center">
              <ApperIcon name="Globe" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No embed URL</p>
            </div>
          )}
        </div>
      </div>

      {/* Resize Handles */}
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
  )
}

export default EmbedBlock