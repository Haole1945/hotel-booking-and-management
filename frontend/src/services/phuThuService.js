import { api } from './api'

export const phuThuService = {
  // Get all surcharges
  async getAllPhuThu() {
    try {
      const response = await api.get('/api/phu-thu/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get surcharge by ID
  async getPhuThuById(idPhuThu) {
    try {
      const response = await api.get(`/api/phu-thu/${idPhuThu}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Create new surcharge
  async createPhuThu(phuThuData) {
    try {
      const response = await api.post('/api/phu-thu/create', phuThuData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update surcharge
  async updatePhuThu(idPhuThu, phuThuData) {
    try {
      const response = await api.put(`/api/phu-thu/update/${idPhuThu}`, phuThuData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Delete surcharge
  async deletePhuThu(idPhuThu) {
    try {
      const response = await api.delete(`/api/phu-thu/delete/${idPhuThu}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Add price for surcharge
  async addPhuThuPrice(priceData) {
    try {
      const response = await api.post('/api/phu-thu/add-price', priceData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get price history for surcharge
  async getPhuThuPrices(idPhuThu) {
    try {
      const response = await api.get(`/api/phu-thu/${idPhuThu}/prices`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get current price for surcharge
  async getCurrentPrice(idPhuThu) {
    try {
      const response = await api.get(`/api/phu-thu/${idPhuThu}/current-price`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default phuThuService
