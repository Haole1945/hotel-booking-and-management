import { api } from './api'

export const roomService = {
  // Get all rooms
  async getAllRooms() {
    try {
      const response = await api.get('/api/phong/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get available rooms
  async getAvailableRooms() {
    try {
      const response = await api.get('/api/phong/available')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get occupied rooms (rooms with guests)
  async getOccupiedRooms() {
    try {
      const response = await api.get('/api/phong/occupied')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get maintenance rooms
  async getMaintenanceRooms() {
    try {
      const response = await api.get('/api/phong/maintenance')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get cleaning rooms
  async getCleaningRooms() {
    try {
      const response = await api.get('/api/phong/cleaning')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get available rooms by date range
  async getAvailableRoomsByDateRange(checkIn, checkOut) {
    try {
      const response = await api.get('/api/phong/available-by-date', {
        params: { checkIn, checkOut }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Search rooms by price range and date
  async searchRoomsByPriceRange(checkIn, checkOut, minPrice, maxPrice, idKp, idLp) {
    try {
      const params = { checkIn, checkOut }
      if (minPrice !== null && minPrice !== undefined) params.minPrice = minPrice
      if (maxPrice !== null && maxPrice !== undefined) params.maxPrice = maxPrice
      if (idKp && idKp !== '') params.idKp = idKp
      if (idLp && idLp !== '') params.idLp = idLp

      const response = await api.get('/api/phong/search-by-price', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get room by ID
  async getRoomById(roomId) {
    try {
      const response = await api.get(`/api/phong/get-by-id/${roomId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get room details with full information (including prices)
  async getRoomDetails(roomId) {
    try {
      const response = await api.get(`/api/phong/get-details/${roomId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update room status
  async updateRoomStatus(roomId, statusId) {
    try {
      const response = await api.put(`/api/phong/update-status/${roomId}`, null, {
        params: { idTrangThai: statusId }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get rooms by hang phong (room category)
  async getRoomsByHangPhong(hangPhongId) {
    try {
      const response = await api.get(`/api/phong/by-hang-phong/${hangPhongId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get rooms by floor
  async getRoomsByFloor(floor) {
    try {
      const response = await api.get(`/api/phong/by-tang/${floor}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get rooms by status
  async getRoomsByStatus(statusId) {
    try {
      const response = await api.get(`/api/phong/by-trang-thai/${statusId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },



  // Check room availability
  async checkRoomAvailability(roomId, checkIn, checkOut) {
    try {
      const response = await api.get(`/api/phong/check-availability/${roomId}`, {
        params: { checkIn, checkOut }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Search rooms
  async searchRooms(keyword) {
    try {
      const response = await api.get('/api/phong/search', {
        params: { keyword }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Filter rooms
  async filterRooms(filters) {
    try {
      const response = await api.get('/api/phong/filter', {
        params: filters
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Admin functions
  async createRoom(roomData) {
    try {
      const response = await api.post('/api/phong/create', roomData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async updateRoom(roomId, roomData) {
    try {
      const response = await api.put(`/api/phong/update/${roomId}`, roomData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async deleteRoom(roomId) {
    try {
      const response = await api.delete(`/api/phong/delete/${roomId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get all room types (KieuPhong)
  async getAllRoomTypes() {
    try {
      const response = await api.get('/api/kieu-phong/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get all room categories (LoaiPhong)
  async getAllRoomCategories() {
    try {
      const response = await api.get('/api/loai-phong/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update room type and category only
  async updateRoomTypeAndCategory(roomId, roomData) {
    try {
      const params = new URLSearchParams()
      if (roomData.idKieuPhong) params.append('idKieuPhong', roomData.idKieuPhong)
      if (roomData.idLoaiPhong) params.append('idLoaiPhong', roomData.idLoaiPhong)

      const response = await api.put(`/api/phong/update-type-category/${roomId}?${params.toString()}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get available rooms for staff (returns room count by category)
  async getAvailableRoomsForStaff(checkIn, checkOut) {
    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut
      })

      const response = await api.get(`/api/phong/get-available-room-for-staff?${params.toString()}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}
