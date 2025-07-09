import { toast } from 'react-toastify'

class DashboardService {
  constructor() {
    this.apperClient = null
    this.tableName = 'dashboard'
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

  async getAll() {
    try {
      const client = this.getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "owner_id" } },
          { field: { Name: "title" } },
          { field: { Name: "is_public" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [
          {
            fieldName: "updated_at",
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
      console.error("Error fetching dashboards:", error)
      toast.error("Failed to fetch dashboards")
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
          { field: { Name: "owner_id" } },
          { field: { Name: "title" } },
          { field: { Name: "is_public" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
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
      console.error(`Error fetching dashboard with ID ${id}:`, error)
      toast.error("Failed to fetch dashboard")
      return null
    }
  }

  async create(data) {
    try {
      const client = this.getApperClient()
      const params = {
        records: [
          {
            // Only include Updateable fields
            title: data.title,
            is_public: data.isPublic || false,
            thumbnail_url: data.thumbnailUrl || null,
            owner_id: data.ownerId || null
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
          toast.success('Dashboard created successfully')
          return successfulRecords[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error creating dashboard:", error)
      toast.error("Failed to create dashboard")
      return null
    }
  }

  async update(id, data) {
    try {
      const client = this.getApperClient()
      const updateData = {
        Id: id
      }
      
      // Only include Updateable fields that are being updated
      if (data.title !== undefined) updateData.title = data.title
      if (data.isPublic !== undefined) updateData.is_public = data.isPublic
      if (data.thumbnailUrl !== undefined) updateData.thumbnail_url = data.thumbnailUrl
      if (data.ownerId !== undefined) updateData.owner_id = data.ownerId
      
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
          toast.success('Dashboard updated successfully')
          return successfulUpdates[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error("Error updating dashboard:", error)
      toast.error("Failed to update dashboard")
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
          toast.success('Dashboard deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error("Error deleting dashboard:", error)
      toast.error("Failed to delete dashboard")
      return false
    }
  }
}

export const dashboardService = new DashboardService()