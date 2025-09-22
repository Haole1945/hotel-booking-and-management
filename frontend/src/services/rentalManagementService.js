import { api } from './api'

export const rentalManagementService = {
  // Lấy danh sách tất cả phiếu thuê
  getAllRentals: async () => {
    try {
      const response = await api.get('/api/phieu-thue/all')
      return response.data
    } catch (error) {
      console.error('Error fetching all rentals:', error)
      throw error
    }
  },

  // Lấy danh sách phiếu thuê chưa xuất hóa đơn (chưa check out)
  getActiveRentalsWithoutInvoice: async () => {
    try {
      const response = await api.get('/api/phieu-thue/active-without-invoice')
      return response.data
    } catch (error) {
      console.error('Error fetching active rentals without invoice:', error)
      throw error
    }
  },

  // Lấy danh sách phiếu thuê chỉ với phòng đang có khách (TT002)
  getActiveRentalsWithOccupiedRoomsOnly: async () => {
    try {
      const response = await api.get('/api/phieu-thue/active-with-occupied-rooms-only')
      return response.data
    } catch (error) {
      console.error('Error fetching active rentals with occupied rooms only:', error)
      throw error
    }
  },

  // Lấy chi tiết phiếu thuê với danh sách phòng
  getRentalDetails: async (idPhieuThue) => {
    try {
      const response = await api.get(`/api/phieu-thue/get-by-id/${idPhieuThue}`)
      return response.data
    } catch (error) {
      console.error('Error fetching rental details:', error)
      throw error
    }
  },

  // Lấy danh sách khách ở trong chi tiết phiếu thuê (từ bảng ctkhacho)
  getRoomGuests: async (idCtPt) => {
    try {
      const response = await api.get(`/api/ct-khach-o/${idCtPt}`)
      return response.data
    } catch (error) {
      console.error('Error fetching room guests:', error)
      // Return empty list if not found
      return { statusCode: 200, guestList: [] }
    }
  },

  // Thêm khách vào chi tiết phiếu thuê
  addGuestToRoom: async (idCtPt, cccd) => {
    try {
      const response = await api.post('/api/ct-khach-o/add', {
        idCtPt,
        cccd
      })
      return response.data
    } catch (error) {
      console.error('Error adding guest to room:', error)
      // Nếu có response từ server, trả về response đó để frontend có thể hiển thị message
      if (error.response && error.response.data) {
        return error.response.data
      }
      throw error
    }
  },

  // Xóa khách khỏi chi tiết phiếu thuê
  removeGuestFromRoom: async (idCtPt, cccd) => {
    try {
      const response = await api.delete(`/api/ct-khach-o/remove/${idCtPt}/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error removing guest from room:', error)
      throw error
    }
  },

  // Tìm kiếm phiếu thuê
  searchRentals: async (keyword) => {
    try {
      const response = await api.get(`/api/phieu-thue/search?keyword=${encodeURIComponent(keyword)}`)
      return response.data
    } catch (error) {
      console.error('Error searching rentals:', error)
      throw error
    }
  },

  // Lọc phiếu thuê theo trạng thái
  filterRentalsByStatus: async (status) => {
    try {
      const response = await api.get(`/api/phieu-thue/filter?status=${status}`)
      return response.data
    } catch (error) {
      console.error('Error filtering rentals by status:', error)
      throw error
    }
  }
}
