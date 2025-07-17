import { toast } from 'react-toastify'

class EmbedBlockService {
  constructor() {
    this.apperClient = null
    this.tableName = 'embed_block'
  }

  getApperClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
    return this.apperClient
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
    try {
      const client = this.getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "dashboard_id" } },
          { field: { Name: "embed_url" } },
          { field: { Name: "title" } },
          { field: { Name: "pos_x" } },
          { field: { Name: "pos_y" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "z_index" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      }
      
      const response = await client.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching embed blocks:", error)
      toast.error("Failed to fetch embed blocks")
      return []
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "dashboard_id" } },
          { field: { Name: "embed_url" } },
          { field: { Name: "title" } },
          { field: { Name: "pos_x" } },
          { field: { Name: "pos_y" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "z_index" } },
          { field: { Name: "created_at" } }
        ]
      }
      
      const response = await client.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching embed block with ID ${id}:`, error)
      toast.error("Failed to fetch embed block")
      return null
    }
  }

  async getByDashboardId(dashboardId) {
    try {
      const client = this.getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "dashboard_id" } },
          { field: { Name: "embed_url" } },
          { field: { Name: "title" } },
          { field: { Name: "pos_x" } },
          { field: { Name: "pos_y" } },
          { field: { Name: "width" } },
          { field: { Name: "height" } },
          { field: { Name: "z_index" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "dashboard_id",
            Operator: "EqualTo",
            Values: [dashboardId]
          }
        ],
        orderBy: [
          {
            fieldName: "z_index",
            sorttype: "ASC"
          }
        ]
      }
      
      const response = await client.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching embed blocks by dashboard ID:", error)
      toast.error("Failed to fetch embed blocks")
      return []
    }
  }

async create(data) {
    try {
      // Validate embed URL if provided and element type requires URL validation
      if (data.embedUrl && ['embed', 'iframe'].includes(data.elementType)) {
        const validation = await this.validateEmbedUrl(data.embedUrl)
        if (!validation.isValid) {
          toast.error(validation.error || 'Invalid embed URL')
          throw new Error(validation.error || 'Invalid embed URL')
        }
      }
      
      const client = this.getApperClient()
      const params = {
        records: [
          {
            // Only include Updateable fields
            dashboard_id: data.dashboardId,
            embed_url: data.embedUrl,
            title: data.title,
            pos_x: data.posX || 0,
            pos_y: data.posY || 0,
            width: data.width || 400,
            height: data.height || 300,
            z_index: data.zIndex || 1
          }
        ]
      }
      const response = await client.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
if (successfulRecords.length > 0) {
          const elementType = data.elementType || 'embed'
          toast.success(`${elementType.charAt(0).toUpperCase() + elementType.slice(1)} element created successfully`)
          return successfulRecords[0].data
        }
      }
      
      return null
} catch (error) {
      console.error("Error creating element block:", error)
      toast.error("Failed to create element")
      return null
    }
  }

  async update(id, data) {
    try {
      // Validate embed URL if being updated
      if (data.embedUrl) {
        const validation = await this.validateEmbedUrl(data.embedUrl)
        if (!validation.isValid) {
          toast.error(validation.error || 'Invalid embed URL')
          throw new Error(validation.error || 'Invalid embed URL')
        }
      }
      
      const client = this.getApperClient()
      const updateData = {
        Id: id
      }
      
      // Only include Updateable fields that are being updated
      if (data.dashboardId !== undefined) updateData.dashboard_id = data.dashboardId
      if (data.embedUrl !== undefined) updateData.embed_url = data.embedUrl
      if (data.title !== undefined) updateData.title = data.title
      if (data.posX !== undefined) updateData.pos_x = data.posX
      if (data.posY !== undefined) updateData.pos_y = data.posY
      if (data.width !== undefined) updateData.width = data.width
      if (data.height !== undefined) updateData.height = data.height
      if (data.zIndex !== undefined) updateData.z_index = data.zIndex
      
      const params = {
        records: [updateData]
      }
      
      const response = await client.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating embed block:", error)
      toast.error("Failed to update embed block")
      return null
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient()
      const params = {
        RecordIds: [id]
      }
      
      const response = await client.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulDeletions.length > 0) {
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting embed block:", error)
      toast.error("Failed to delete embed block")
      return false
    }
  }
}

export const embedBlockService = new EmbedBlockService()