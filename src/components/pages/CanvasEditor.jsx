import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CanvasToolbar from '@/components/organisms/CanvasToolbar'
import Canvas from '@/components/organisms/Canvas'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { dashboardService } from '@/services/api/dashboardService'
import { embedBlockService } from '@/services/api/embedBlockService'

const CanvasEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveTimeout, setSaveTimeout] = useState(null)

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (id === 'new') {
        // Create new dashboard
        const newDashboard = await dashboardService.create({
          title: 'Untitled Dashboard',
          isPublic: false
        })
        navigate(`/dashboard/${newDashboard.Id}`, { replace: true })
        return
      }

      const [dashboardData, blocksData] = await Promise.all([
        dashboardService.getById(parseInt(id)),
        embedBlockService.getByDashboardId(parseInt(id))
      ])
      
      setDashboard(dashboardData)
      setBlocks(blocksData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const debouncedSave = useCallback((blockId, updates) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSaving(true)
        await embedBlockService.update(blockId, updates)
      } catch (error) {
        toast.error('Failed to save changes')
      } finally {
        setIsSaving(false)
      }
    }, 1000)

    setSaveTimeout(timeout)
  }, [saveTimeout])

  useEffect(() => {
    loadDashboard()
  }, [id])

  const handleAddEmbed = async (embedData) => {
    try {
      const newBlock = await embedBlockService.create({
        dashboardId: parseInt(id),
        embedUrl: embedData.embedUrl,
        title: embedData.title,
        posX: 100,
        posY: 100,
        width: 400,
        height: 300,
        zIndex: blocks.length + 1
      })
      setBlocks([...blocks, newBlock])
      toast.success('Embed added successfully')
    } catch (error) {
      toast.error('Failed to add embed')
    }
  }

  const handleBlockMove = (blockId, x, y) => {
    setBlocks(blocks.map(block => 
      block.Id === blockId ? { ...block, posX: x, posY: y } : block
    ))
    debouncedSave(blockId, { posX: x, posY: y })
  }

  const handleBlockResize = (blockId, width, height) => {
    setBlocks(blocks.map(block => 
      block.Id === blockId ? { ...block, width, height } : block
    ))
    debouncedSave(blockId, { width, height })
  }

  const handleBlockDelete = async (blockId) => {
    try {
      await embedBlockService.delete(blockId)
      setBlocks(blocks.filter(block => block.Id !== blockId))
      toast.success('Embed deleted successfully')
    } catch (error) {
      toast.error('Failed to delete embed')
    }
  }

  const handleUpdatePublic = async (dashboardId, isPublic) => {
    try {
      await dashboardService.update(dashboardId, { isPublic })
      setDashboard({ ...dashboard, isPublic })
    } catch (error) {
      throw new Error('Failed to update dashboard visibility')
    }
  }

  const handleInviteUser = async (dashboardId, email, role) => {
    // Mock invitation - in real app this would call an API
    console.log('Invite user:', { dashboardId, email, role })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleRemoveCollaborator = async (invitationId) => {
    // Mock removal - in real app this would call an API
    console.log('Remove collaborator:', invitationId)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading type="canvas" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Error message={error} onRetry={loadDashboard} />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <CanvasToolbar
        dashboard={dashboard}
        onAddEmbed={handleAddEmbed}
        onUpdatePublic={handleUpdatePublic}
        onInviteUser={handleInviteUser}
        onRemoveCollaborator={handleRemoveCollaborator}
        isSaving={isSaving}
      />
      
      <div className="flex-1 pt-16">
        <Canvas
          blocks={blocks}
          onBlockMove={handleBlockMove}
          onBlockResize={handleBlockResize}
          onBlockDelete={handleBlockDelete}
          showGrid={false}
          isViewOnly={false}
        />
      </div>
    </div>
  )
}

export default CanvasEditor