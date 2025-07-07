import mockEmbedBlocks from '@/services/mockData/embedBlocks.json'

class EmbedBlockService {
  constructor() {
    this.embedBlocks = [...mockEmbedBlocks]
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...this.embedBlocks]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const block = this.embedBlocks.find(b => b.Id === id)
    if (!block) {
      throw new Error('Embed block not found')
    }
    return { ...block }
  }

  async getByDashboardId(dashboardId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.embedBlocks.filter(block => block.dashboardId === dashboardId)
  }

  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newBlock = {
      Id: Math.max(...this.embedBlocks.map(b => b.Id), 0) + 1,
      dashboardId: data.dashboardId,
      embedUrl: data.embedUrl,
      title: data.title,
      posX: data.posX || 0,
      posY: data.posY || 0,
      width: data.width || 400,
      height: data.height || 300,
      zIndex: data.zIndex || 1,
      createdAt: new Date().toISOString()
    }
    this.embedBlocks.push(newBlock)
    return { ...newBlock }
  }

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.embedBlocks.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Embed block not found')
    }
    this.embedBlocks[index] = {
      ...this.embedBlocks[index],
      ...data
    }
    return { ...this.embedBlocks[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = this.embedBlocks.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error('Embed block not found')
    }
    this.embedBlocks.splice(index, 1)
    return true
  }
}

export const embedBlockService = new EmbedBlockService()