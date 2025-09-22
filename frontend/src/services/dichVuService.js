import { api } from './api'

export const dichVuService = {
  // Get all services
  async getAllDichVu() {
    try {
      const response = await api.get('/api/services/dich-vu')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get service by ID
  async getDichVuById(idDv) {
    try {
      const response = await api.get(`/api/dich-vu/${idDv}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Create new service
  async createDichVu(dichVuData) {
    try {
      const response = await api.post('/api/dich-vu/create', dichVuData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update service
  async updateDichVu(idDv, dichVuData) {
    try {
      const response = await api.put(`/api/dich-vu/update/${idDv}`, dichVuData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Delete service
  async deleteDichVu(idDv) {
    try {
      const response = await api.delete(`/api/dich-vu/delete/${idDv}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Add price for service
  async addDichVuPrice(priceData) {
    try {
      const response = await api.post('/api/dich-vu/add-price', priceData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get price history for service
  async getDichVuPrices(idDv) {
    try {
      const response = await api.get(`/api/dich-vu/${idDv}/prices`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get current price for service
  async getCurrentPrice(idDv) {
    try {
      const response = await api.get(`/api/dich-vu/${idDv}/current-price`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default dichVuService
