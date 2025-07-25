import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import EditEmbedModal from "@/components/molecules/EditEmbedModal";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const EmbedBlock = ({ 
  block, 
  isSelected, 
  onSelect, 
  onMove, 
  onResize, 
  onDelete,
  onEdit,
  isViewOnly = false,
  className 
}) => {
const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
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

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleEditSave = async (editData) => {
    if (onEdit) {
      await onEdit(block.Id, editData)
    }
    setIsEditing(false)
  }

const handleEditClose = () => {
    setIsEditing(false)
  }

  const handleIframeLoad = () => {
    setIsIframeLoading(false)
    setIframeError(false)
  }

  const handleIframeError = () => {
    setIsIframeLoading(false)
    setIframeError(true)
  }

  const handleRetryEmbed = () => {
    setIsIframeLoading(true)
    setIframeError(false)
    // Force iframe reload by updating src
    const iframe = blockRef.current?.querySelector('iframe')
    if (iframe) {
      const currentSrc = iframe.src
      iframe.src = ''
      setTimeout(() => {
        iframe.src = currentSrc
      }, 100)
    }
  }

  // Reset iframe states when embed URL changes
  useEffect(() => {
    if (block.embedUrl) {
      setIsIframeLoading(true)
      setIframeError(false)
    }
  }, [block.embedUrl])
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

{/* Action Buttons */}
      {!isViewOnly && isSelected && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleEdit}
            className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
          >
            <ApperIcon name="Edit" className="h-3 w-3" />
          </button>
          <button
            onClick={handleDelete}
            className="w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-error/80 transition-colors"
          >
            <ApperIcon name="X" className="h-3 w-3" />
          </button>
        </div>
      )}
      {/* Content */}
      <div className="w-full h-full p-3">
        {block.title && (
          <h4 className="text-sm font-medium text-gray-900 mb-2 truncate">
            {block.title}
          </h4>
        )}
<div className="w-full h-full bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center relative">
          {block.embedUrl ? (
            <>
              {isIframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading embed...</p>
                  </div>
                </div>
              )}
              
{iframeError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name="AlertCircle" className="h-6 w-6 text-error" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Content cannot be embedded
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      This service blocks embedding for security. You can still access the content directly.
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => window.open(block.embedUrl, '_blank', 'noopener,noreferrer')}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                      >
                        <ApperIcon name="ExternalLink" className="h-3 w-3 mr-1" />
                        Open in New Tab
                      </button>
                      <button
                        onClick={handleRetryEmbed}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <ApperIcon name="RefreshCw" className="h-3 w-3 mr-1" />
                        Retry Embed
                      </button>
                    </div>
                  </div>
                </div>
) : (
                <iframe
                  src={block.embedUrl}
                  className="w-full h-full rounded"
                  frameBorder="0"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={block.title || 'Embedded content'}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  style={{ display: isIframeLoading ? 'none' : 'block' }}
                />
              )}
            </>
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

      {/* Edit Modal */}
      {isEditing && (
        <EditEmbedModal
          isOpen={isEditing}
          onClose={handleEditClose}
          onSave={handleEditSave}
          embedBlock={block}
        />
      )}
    </motion.div>
  )
}

export default EmbedBlock