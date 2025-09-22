import { api } from './api'

export const promotionService = {
  // Lấy danh sách khuyến mãi theo phiếu thuê
  getPromotionsByRental: async (rentalId) => {
    try {
      const response = await api.get(`/api/promotions/by-rental/${rentalId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching promotions by rental:', error)
      throw error
    }
  },

  // Lấy tất cả khuyến mãi đang active
  getActivePromotions: async () => {
    try {
      const response = await api.get('/api/promotions/active')
      return response.data
    } catch (error) {
      console.error('Error fetching active promotions:', error)
      throw error
    }
  },

  // Đăng ký nhận thông tin ưu đãi
  subscribeToPromotions: async (email) => {
    try {
      const response = await api.post('/api/promotions/subscribe', null, {
        params: { email }
      })
      return response.data
    } catch (error) {
      console.error('Error subscribing to promotions:', error)
      throw error
    }
  }
}
