import { api } from './api'

/**
 * Service để xử lý các API liên quan đến tiện nghi (amenities)
 */
export const amenityService = {
  /**
   * Lấy danh sách tất cả tiện nghi
   */
  getAllAmenities: async () => {
    try {
      const response = await api.get('/api/amenities')
      return response.data
    } catch (error) {
      console.error('Error fetching amenities:', error)
      throw error
    }
  },

  /**
   * Lấy tiện nghi theo ID
   */
  getAmenityById: async (id) => {
    try {
      const response = await api.get(`/api/amenities/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching amenity:', error)
      throw error
    }
  },

  /**
   * Lấy tiện nghi theo hạng phòng
   */
  getAmenitiesByRoomType: async (roomTypeId) => {
    try {
      const response = await api.get(`/api/amenities/room-type/${roomTypeId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching amenities by room type:', error)
      throw error
    }
  },

  /**
   * Tạo tiện nghi mới
   */
  createAmenity: async (amenityData) => {
    try {
      const response = await api.post('/api/amenities', amenityData)
      return response.data
    } catch (error) {
      console.error('Error creating amenity:', error)
      throw error
    }
  },

  /**
   * Cập nhật tiện nghi
   */
  updateAmenity: async (id, amenityData) => {
    try {
      const response = await api.put(`/api/amenities/${id}`, amenityData)
      return response.data
    } catch (error) {
      console.error('Error updating amenity:', error)
      throw error
    }
  },

  /**
   * Xóa tiện nghi
   */
  deleteAmenity: async (id) => {
    try {
      const response = await api.delete(`/api/amenities/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting amenity:', error)
      throw error
    }
  },

  /**
   * Lấy icon LONGBLOB của tiện nghi
   */
  getAmenityIcon: async (id) => {
    try {
      const response = await api.get(`/api/amenities/${id}/icon`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error fetching amenity icon:', error)
      throw error
    }
  },

  /**
   * Upload icon cho tiện nghi (LONGBLOB)
   */
  uploadAmenityIcon: async (id, iconFile) => {
    try {
      const formData = new FormData()
      formData.append('icon', iconFile)
      
      const response = await api.post(`/api/amenities/${id}/icon`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error uploading amenity icon:', error)
      throw error
    }
  },

  /**
   * Cập nhật icon từ base64 string (cho LONGBLOB)
   */
  updateAmenityIconFromBase64: async (id, base64String) => {
    try {
      const response = await api.put(`/api/amenities/${id}/icon`, {
        iconData: base64String
      })
      return response.data
    } catch (error) {
      console.error('Error updating amenity icon from base64:', error)
      throw error
    }
  },

  /**
   * Lấy danh sách tiện nghi với icon LONGBLOB
   */
  getAmenitiesWithIcons: async () => {
    try {
      const response = await api.get('/api/amenities/with-icons')
      return response.data
    } catch (error) {
      console.error('Error fetching amenities with icons:', error)
      throw error
    }
  }
}

export default amenityService
