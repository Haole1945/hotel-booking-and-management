import { api } from './api'

// Dashboard Service for Staff
export const dashboardService = {
  // Get staff dashboard statistics
  getStaffStats: async () => {
    try {
      const response = await api.get('/api/dashboard/staff/stats')

      return response.data
    } catch (error) {
      console.error('Error fetching staff stats:', error)
      throw error
    }
  },

  // Get today's check-ins (from dashboard service)
  getTodayCheckIns: async () => {
    try {
      const response = await api.get('/api/dashboard/staff/today-checkins')
      return response.data
    } catch (error) {
      console.error('Error fetching today check-ins:', error)
      throw error
    }
  },

  // Get today's check-outs (from dashboard service)
  getTodayCheckOuts: async () => {
    try {
      const response = await api.get('/api/dashboard/staff/today-checkouts')
      return response.data
    } catch (error) {
      console.error('Error fetching today check-outs:', error)
      throw error
    }
  },

  // Get admin dashboard stats
  getAdminStats: async () => {
    try {
      // Lấy dữ liệu từ các API có sẵn
      const [roomsResponse, staffResponse, customersResponse, servicesResponse, amenitiesResponse] = await Promise.all([
        api.get('/api/phong/all'),
        api.get('/api/nhanvien/all'),
        api.get('/api/khach-hang/all'),
        api.get('/api/services/dich-vu'),
        api.get('/api/tien-nghi/all')
      ])

      const rooms = roomsResponse.data.phongList || []
      const staff = staffResponse.data.nhanVienList || []
      const customers = customersResponse.data.khachHangList || []
      const services = servicesResponse.data.dichVuList || []
      const amenities = amenitiesResponse.data.tienNghiList || []

      // Tính toán thống kê với 5 trạng thái - sử dụng tên trạng thái thay vì ID
      const availableRooms = rooms.filter(room =>
        room.tenTrangThai === 'Trống' || room.trangThai?.tenTrangThai === 'Trống'
      ).length

      const occupiedRooms = rooms.filter(room =>
        room.tenTrangThai === 'Đã có khách' || room.trangThai?.tenTrangThai === 'Đã có khách'
      ).length

      const cleaningRooms = rooms.filter(room =>
        room.tenTrangThai === 'Đang dọn dẹp' || room.trangThai?.tenTrangThai === 'Đang dọn dẹp'
      ).length

      const maintenanceRooms = rooms.filter(room =>
        room.tenTrangThai === 'Đang bảo trì' || room.trangThai?.tenTrangThai === 'Đang bảo trì'
      ).length

      const reservedRooms = rooms.filter(room =>
        room.tenTrangThai === 'Đã đặt' || room.trangThai?.tenTrangThai === 'Đã đặt'
      ).length

      return {
        statusCode: 200,
        stats: {
          totalRooms: rooms.length,
          availableRooms: availableRooms,
          occupiedRooms: occupiedRooms,
          cleaningRooms: cleaningRooms,
          maintenanceRooms: maintenanceRooms,
          reservedRooms: reservedRooms,
          totalStaff: staff.length,
          totalCustomers: customers.length,
          monthlyRevenue: 0, // Sẽ được tính từ API thực tế
          todayRevenue: 0, // Sẽ được tính từ API thực tế
          totalServices: services.length,
          totalAmenities: amenities.length,
          pendingReservations: 0, // Sẽ được lấy từ API đặt phòng
          checkInsToday: 0, // Sẽ được lấy từ API check-in
          checkOutsToday: 0, // Sẽ được lấy từ API check-out
          occupancyRate: rooms.length > 0 ? ((occupiedRooms + reservedRooms) / rooms.length * 100).toFixed(1) : 0
        }
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      throw error
    }
  },

  // Get current guests (checked-in but not checked-out) for checkout page
  getCurrentGuests: async () => {
    try {
      const response = await api.get('/api/dashboard/staff/current-guests')
      return response.data
    } catch (error) {
      console.error('Error fetching current guests:', error)
      throw error
    }
  }
}
