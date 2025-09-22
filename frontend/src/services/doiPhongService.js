import { api } from './api'

const doiPhongService = {
  // Lấy tất cả lịch sử đổi phòng
  getAllDoiPhong: async () => {
    try {
      const response = await api.get('/api/doi-phong/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lấy thông tin đổi phòng theo ID
  getDoiPhongById: async (idCtPt, soPhongMoi) => {
    try {
      const response = await api.get(`/api/doi-phong/${idCtPt}/${soPhongMoi}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Yêu cầu đổi phòng (chỉ kiểm tra)
  requestRoomChange: async (requestData) => {
    try {
      const response = await api.post('/api/doi-phong/request', requestData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Thực hiện đổi phòng
  changeRoom: async (requestData) => {
    try {
      const response = await api.post('/api/doi-phong/change', requestData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Kiểm tra điều kiện đổi phòng
  checkRoomChangeEligibility: async (idCtPt) => {
    try {
      const response = await api.get(`/api/doi-phong/check-eligibility/${idCtPt}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lấy danh sách phòng có thể đổi
  getAvailableRoomsForChange: async (idCtPt) => {
    try {
      const response = await api.get(`/api/doi-phong/available-rooms/${idCtPt}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Tính phí đổi phòng
  calculateRoomChangeFee: async (idCtPt, soPhongMoi) => {
    try {
      const response = await api.get(`/api/doi-phong/calculate-fee/${idCtPt}/${soPhongMoi}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lấy lịch sử đổi phòng theo chi tiết phiếu thuê
  getRoomChangeHistory: async (idCtPt) => {
    try {
      const response = await api.get(`/api/doi-phong/history/${idCtPt}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lấy lịch sử đổi phòng theo phòng mới
  getDoiPhongByPhongMoi: async (soPhongMoi) => {
    try {
      const response = await api.get(`/api/doi-phong/by-room/${soPhongMoi}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lấy lịch sử đổi phòng theo khách hàng
  getDoiPhongByKhachHang: async (cccd) => {
    try {
      const response = await api.get(`/api/doi-phong/by-customer/${cccd}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lấy lịch sử đổi phòng theo khoảng thời gian
  getDoiPhongByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/api/doi-phong/by-date-range?startDate=${startDate}&endDate=${endDate}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lấy danh sách đổi phòng hiện tại
  getCurrentRoomChanges: async () => {
    try {
      const response = await api.get('/api/doi-phong/current')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Phê duyệt đổi phòng
  approveRoomChange: async (idCtPt, soPhongMoi) => {
    try {
      const response = await api.put(`/api/doi-phong/approve/${idCtPt}/${soPhongMoi}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Hủy đổi phòng
  cancelRoomChange: async (idCtPt, soPhongMoi, reason) => {
    try {
      const response = await api.put(`/api/doi-phong/cancel/${idCtPt}/${soPhongMoi}?reason=${encodeURIComponent(reason)}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Hoàn thành đổi phòng
  completeRoomChange: async (idCtPt, soPhongMoi) => {
    try {
      const response = await api.put(`/api/doi-phong/complete/${idCtPt}/${soPhongMoi}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Cập nhật thông tin đổi phòng
  updateDoiPhong: async (idCtPt, soPhongMoi, requestData) => {
    try {
      const response = await api.put(`/api/doi-phong/update/${idCtPt}/${soPhongMoi}`, requestData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Xóa thông tin đổi phòng
  deleteDoiPhong: async (idCtPt, soPhongMoi) => {
    try {
      const response = await api.delete(`/api/doi-phong/delete/${idCtPt}/${soPhongMoi}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Kiểm tra tính hợp lệ của yêu cầu đổi phòng
  validateRoomChange: async (requestData) => {
    try {
      const response = await api.post('/api/doi-phong/validate', requestData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lấy thống kê đổi phòng
  getRoomChangeStatistics: async (startDate, endDate) => {
    try {
      const response = await api.get(`/api/doi-phong/statistics?startDate=${startDate}&endDate=${endDate}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Tìm kiếm đổi phòng
  searchDoiPhong: async (keyword) => {
    try {
      const response = await api.get(`/api/doi-phong/search?keyword=${encodeURIComponent(keyword)}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Lọc đổi phòng
  filterDoiPhong: async (filters) => {
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.cccd) params.append('cccd', filters.cccd)

      const response = await api.get(`/api/doi-phong/filter?${params.toString()}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default doiPhongService
