import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Canvas from '@/components/organisms/Canvas'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { dashboardService } from '@/services/api/dashboardService'
import { embedBlockService } from '@/services/api/embedBlockService'

const DashboardView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      
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

  useEffect(() => {
    loadDashboard()
  }, [id])

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
      {/* Simple header for view mode */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
                Back
              </Button>
              
<h1 className="text-xl font-semibold text-gray-900">
                {dashboard?.title || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                View Only
              </div>
              
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 pt-16">
        <Canvas
          blocks={blocks}
          onBlockMove={() => {}}
          onBlockResize={() => {}}
          onBlockDelete={() => {}}
          showGrid={false}
          isViewOnly={true}
        />
      </div>
    </div>
  )
}

export default DashboardView