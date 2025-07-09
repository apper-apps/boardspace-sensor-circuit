import mockEmbedBlocks from '@/services/mockData/embedBlocks.json'

class EmbedBlockService {
  constructor() {
    this.embedBlocks = [...mockEmbedBlocks]
  }

  async validateEmbedUrl(url) {
    if (!url) return false
    
    try {
      // Basic URL validation
      new URL(url)
      
      // Check for common embed patterns
      const embedPatterns = [
        /youtube\.com\/embed\//,
        /youtu\.be\//,
        /vimeo\.com\/video\//,
        /loom\.com\/embed\//,
        /figma\.com\/embed/,
        /miro\.com\/app\/embed/,
        /typeform\.com\/to\//,
        /airtable\.com\/embed/,
        /docs\.google\.com\/presentation/,
        /codepen\.io\/.*\/embed/
      ]
      
      const isKnownEmbed = embedPatterns.some(pattern => pattern.test(url))
      
      return {
        isValid: true,
        isKnownEmbed,
        url
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid URL format'
      }
    }
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
    
    // Validate embed URL if provided
    if (data.embedUrl) {
      const validation = await this.validateEmbedUrl(data.embedUrl)
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid embed URL')
      }
    }
    
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
    
    // Validate embed URL if being updated
    if (data.embedUrl && data.embedUrl !== this.embedBlocks[index].embedUrl) {
      const validation = await this.validateEmbedUrl(data.embedUrl)
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid embed URL')
      }
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