import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import DashboardGrid from '@/components/organisms/DashboardGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { dashboardService } from '@/services/api/dashboardService'

const DashboardList = () => {
  const navigate = useNavigate()
  const [dashboards, setDashboards] = useState([])
  const [filteredDashboards, setFilteredDashboards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboards = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getAll()
      setDashboards(data)
      setFilteredDashboards(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboards()
  }, [])

const handleSearch = (searchTerm) => {
    const filtered = dashboards.filter(dashboard =>
      dashboard.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDashboards(filtered)
  }

  const handleCreateDashboard = async () => {
    try {
const newDashboard = await dashboardService.create({
        title: 'Untitled Dashboard',
        isPublic: false
      })
      navigate(`/dashboard/${newDashboard.Id}`)
    } catch (error) {
      toast.error('Failed to create dashboard')
    }
  }

  const handleDuplicate = async (dashboard) => {
    try {
const duplicatedDashboard = await dashboardService.create({
        title: `${dashboard.title} (Copy)`,
        isPublic: false
      })
      await loadDashboards()
      return duplicatedDashboard
    } catch (error) {
      throw new Error('Failed to duplicate dashboard')
    }
  }

  const handleDelete = async (dashboardId) => {
    try {
      await dashboardService.delete(dashboardId)
      await loadDashboards()
    } catch (error) {
      throw new Error('Failed to delete dashboard')
    }
  }

  const handleUpdatePublic = async (dashboardId, isPublic) => {
    try {
      await dashboardService.update(dashboardId, { isPublic })
      await loadDashboards()
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
      <div className="p-6">
        <Loading type="dashboard-grid" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadDashboards} />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboards</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your custom dashboards
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateDashboard}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-5 w-5" />
          <span>New Dashboard</span>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar 
          placeholder="Search dashboards..."
          onSearch={handleSearch}
          className="max-w-md"
        />
      </div>

      {/* Dashboard Grid */}
      {filteredDashboards.length === 0 ? (
        <Empty
          title="No dashboards found"
          description="Create your first dashboard to get started with BoardSpace"
          actionLabel="Create Dashboard"
          onAction={handleCreateDashboard}
          icon="Layout"
        />
      ) : (
        <DashboardGrid
          dashboards={filteredDashboards}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onUpdatePublic={handleUpdatePublic}
          onInviteUser={handleInviteUser}
          onRemoveCollaborator={handleRemoveCollaborator}
        />
      )}
    </div>
  )
}

export default DashboardList