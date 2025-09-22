import { api } from './api'

// Room Status Service
export const roomStatusService = {
  // Get all room statuses
  getAllRoomStatuses: async () => {
    try {
      const response = await api.get('/api/trang-thai-phong/all')
      return response.data
    } catch (error) {
      console.error('Error fetching room statuses:', error)
      throw error
    }
  },

  // Get room status by ID
  getRoomStatusById: async (id) => {
    try {
      const response = await api.get(`/api/trang-thai-phong/get-by-id/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching room status by ID:', error)
      throw error
    }
  },

  // Create new room status
  createRoomStatus: async (statusData) => {
    try {
      const response = await api.post('/api/trang-thai-phong/create', statusData)
      return response.data
    } catch (error) {
      console.error('Error creating room status:', error)
      throw error
    }
  },

  // Update room status
  updateRoomStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/api/trang-thai-phong/update/${id}`, statusData)
      return response.data
    } catch (error) {
      console.error('Error updating room status:', error)
      throw error
    }
  },

  // Delete room status
  deleteRoomStatus: async (id) => {
    try {
      const response = await api.delete(`/api/trang-thai-phong/delete/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting room status:', error)
      throw error
    }
  }
}

// Room Type Service
export const roomTypeService = {
  // Get all room types (hang phong)
  getAllRoomTypes: async () => {
    try {
      const response = await api.get('/api/hang-phong/all')
      return response.data
    } catch (error) {
      console.error('Error fetching room types:', error)
      throw error
    }
  },

  // Get room type by ID
  getRoomTypeById: async (id) => {
    try {
      const response = await api.get(`/api/hang-phong/get-by-id/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching room type by ID:', error)
      throw error
    }
  }
}
