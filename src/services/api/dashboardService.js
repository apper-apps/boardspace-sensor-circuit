import mockDashboards from '@/services/mockData/dashboards.json'

class DashboardService {
  constructor() {
    this.dashboards = [...mockDashboards]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.dashboards]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const dashboard = this.dashboards.find(d => d.Id === id)
    if (!dashboard) {
      throw new Error('Dashboard not found')
    }
    return { ...dashboard }
  }

  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newDashboard = {
      Id: Math.max(...this.dashboards.map(d => d.Id), 0) + 1,
      ownerId: 'current-user-id',
      title: data.title,
      isPublic: data.isPublic || false,
      thumbnailUrl: data.thumbnailUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.dashboards.push(newDashboard)
    return { ...newDashboard }
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.dashboards.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Dashboard not found')
    }
    this.dashboards[index] = {
      ...this.dashboards[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { ...this.dashboards[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.dashboards.findIndex(d => d.Id === id)
    if (index === -1) {
      throw new Error('Dashboard not found')
    }
    this.dashboards.splice(index, 1)
    return true
  }
}

export const dashboardService = new DashboardService()