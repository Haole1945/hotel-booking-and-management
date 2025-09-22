import { api } from './api'

export const hangPhongService = {
  // Get all hang phong
  async getAllHangPhong() {
    try {
      const response = await api.get('/api/hang-phong/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get hot hang phong this month
  async getHotHangPhongThisMonth() {
    try {
      const response = await api.get('/api/hang-phong/hot-this-month')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get all hang phong with current prices
  async getAllHangPhongWithPrices() {
    try {
      const response = await api.get('/api/hang-phong/all-with-prices')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get hang phong by ID
  async getHangPhongById(idHangPhong) {
    try {
      const response = await api.get(`/api/hang-phong/get-by-id/${idHangPhong}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get hang phong by kieu phong
  async getHangPhongByKieuPhong(idKp) {
    try {
      const response = await api.get(`/api/hang-phong/by-kieu-phong/${idKp}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get hang phong by loai phong
  async getHangPhongByLoaiPhong(idLp) {
    try {
      const response = await api.get(`/api/hang-phong/by-loai-phong/${idLp}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get hang phong by kieu and loai
  async getHangPhongByKieuAndLoai(idKp, idLp) {
    try {
      const response = await api.get('/api/hang-phong/by-kieu-and-loai', {
        params: { idKp, idLp }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get room price by kieu and loai
  async getRoomPriceByKieuAndLoai(idKp, idLp) {
    try {
      const response = await api.get('/api/hang-phong/room-price', {
        params: { idKp, idLp }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Create hang phong
  async createHangPhong(hangPhongData) {
    try {
      const response = await api.post('/api/hang-phong/create', hangPhongData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update hang phong
  async updateHangPhong(idHangPhong, hangPhongData) {
    try {
      const response = await api.put(`/api/hang-phong/update/${idHangPhong}`, hangPhongData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Delete hang phong
  async deleteHangPhong(idHangPhong) {
    try {
      const response = await api.delete(`/api/hang-phong/delete/${idHangPhong}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get available hang phong
  async getAvailableHangPhong() {
    try {
      const response = await api.get('/api/hang-phong/available')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get hang phong with available rooms
  async getHangPhongWithAvailableRooms() {
    try {
      const response = await api.get('/api/hang-phong/with-available-rooms')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get hang phong statistics
  async getHangPhongStatistics() {
    try {
      const response = await api.get('/api/hang-phong/statistics')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Search hang phong
  async searchHangPhong(keyword) {
    try {
      const response = await api.get('/api/hang-phong/search', {
        params: { keyword }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Filter hang phong
  async filterHangPhong(idKp, idLp) {
    try {
      const response = await api.get('/api/hang-phong/filter', {
        params: { idKp, idLp }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}
