import { useState, useRef, useEffect } from 'react'
import EmbedBlock from '@/components/molecules/EmbedBlock'
import { cn } from '@/utils/cn'

const Canvas = ({ 
  blocks, 
  onBlockMove, 
  onBlockResize, 
  onBlockDelete,
  showGrid = false,
  isViewOnly = false,
  className 
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const canvasRef = useRef(null)

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedBlockId(null)
    }
  }

  const handleBlockSelect = (blockId) => {
    setSelectedBlockId(blockId)
  }

  const handleBlockMove = (blockId, x, y) => {
    onBlockMove(blockId, x, y)
  }

  const handleBlockResize = (blockId, width, height) => {
    onBlockResize(blockId, width, height)
  }

  const handleBlockDelete = (blockId) => {
    onBlockDelete(blockId)
    setSelectedBlockId(null)
  }

  // Clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (canvasRef.current && !canvasRef.current.contains(e.target)) {
        setSelectedBlockId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn(
      'w-full h-full overflow-auto canvas-container',
      className
    )}>
      <div 
        ref={canvasRef}
        className={cn(
          'relative min-w-full min-h-full canvas-content',
          showGrid && 'canvas-grid'
        )}
        onClick={handleCanvasClick}
        style={{ minWidth: '2000px', minHeight: '1500px' }}
      >
        {blocks.map((block) => (
          <EmbedBlock
            key={block.Id}
            block={block}
            isSelected={selectedBlockId === block.Id}
            onSelect={handleBlockSelect}
            onMove={handleBlockMove}
            onResize={handleBlockResize}
            onDelete={handleBlockDelete}
            isViewOnly={isViewOnly}
          />
        ))}
      </div>
    </div>
  )
}

export default Canvas