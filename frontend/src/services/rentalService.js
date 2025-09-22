import { api } from './api'

// Rental Service (PhieuThue)
export const rentalService = {
  // Get all rentals
  getAllRentals: async () => {
    try {
      const response = await api.get('/api/phieu-thue/all')
      return response.data
    } catch (error) {
      console.error('Error fetching all rentals:', error)
      throw error
    }
  },

  // Get rental by ID
  getRentalById: async (id) => {
    try {
      const response = await api.get(`/api/phieu-thue/get-by-id/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching rental by ID:', error)
      throw error
    }
  },

  // Create new rental
  createRental: async (rentalData) => {
    try {
      const response = await api.post('/api/phieu-thue/create', rentalData)
      return response.data
    } catch (error) {
      console.error('Error creating rental:', error)
      throw error
    }
  },

  // Update rental
  updateRental: async (id, rentalData) => {
    try {
      const response = await api.put(`/api/phieu-thue/update/${id}`, rentalData)
      return response.data
    } catch (error) {
      console.error('Error updating rental:', error)
      throw error
    }
  },

  // Delete rental
  deleteRental: async (id) => {
    try {
      const response = await api.delete(`/api/phieu-thue/delete/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting rental:', error)
      throw error
    }
  },

  // Get rentals by customer CCCD
  getRentalsByCustomer: async (cccd) => {
    try {
      const response = await api.get(`/api/phieu-thue/khach-hang/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error fetching rentals by customer:', error)
      throw error
    }
  },

  // Get rentals by employee
  getRentalsByEmployee: async (employeeId) => {
    try {
      const response = await api.get(`/api/phieu-thue/nhan-vien/${employeeId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching rentals by employee:', error)
      throw error
    }
  },

  // Get rentals by booking ID
  getRentalsByBooking: async (bookingId) => {
    try {
      const response = await api.get(`/api/phieu-thue/phieu-dat/${bookingId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching rentals by booking:', error)
      throw error
    }
  },

  // Get current stays
  getCurrentStays: async () => {
    try {
      const response = await api.get('/api/phieu-thue/current-stays')
      return response.data
    } catch (error) {
      console.error('Error fetching current stays:', error)
      throw error
    }
  },

  // Check-in from booking
  checkInFromBooking: async (bookingId) => {
    try {
      const response = await api.post(`/api/phieu-thue/checkin-booking/${bookingId}`)
      return response.data
    } catch (error) {
      console.error('Error checking in from booking:', error)
      throw error
    }
  },

  // Check-in from booking with specific room
  checkInFromBookingWithRoom: async (checkInData) => {
    try {
      const response = await api.post('/api/phieu-thue/checkin-from-booking-with-room', checkInData)
      return response.data
    } catch (error) {
      console.error('Error check-in from booking with room:', error)
      throw error
    }
  },

  // Check-in from booking with multiple rooms
  checkInFromBookingWithMultipleRooms: async (checkInData) => {
    try {
      const response = await api.post('/api/phieu-thue/checkin-from-booking-multiple-rooms', checkInData)
      return response.data
    } catch (error) {
      console.error('Error checking in from booking with multiple rooms:', error)
      throw error
    }
  },

  // Walk-in check-in
  checkInWalkIn: async (rentalData) => {
    try {
      const response = await api.post('/api/phieu-thue/checkin-walkin', rentalData)
      return response.data
    } catch (error) {
      console.error('Error walk-in check-in:', error)
      throw error
    }
  },

  // Check-out
  checkOut: async (rentalId) => {
    try {
      const response = await api.put(`/api/phieu-thue/checkout/${rentalId}`)
      return response.data
    } catch (error) {
      console.error('Error checking out:', error)
      throw error
    }
  },

  // checkOutWithDate đã được xóa - sử dụng invoiceService.createInvoiceFromCheckoutWithDate thay thế

  // Extend stay
  extendStay: async (rentalId, newCheckOut) => {
    try {
      const response = await api.put(`/api/phieu-thue/extend-stay/${rentalId}?newCheckOut=${newCheckOut}`)
      return response.data
    } catch (error) {
      console.error('Error extending stay:', error)
      throw error
    }
  },

  // Search rentals
  searchRentals: async (keyword) => {
    try {
      const response = await api.get(`/api/phieu-thue/search?keyword=${encodeURIComponent(keyword)}`)
      return response.data
    } catch (error) {
      console.error('Error searching rentals:', error)
      throw error
    }
  },

  // Get rentals by date range
  getRentalsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/api/phieu-thue/date-range?startDate=${startDate}&endDate=${endDate}`)
      return response.data
    } catch (error) {
      console.error('Error fetching rentals by date range:', error)
      throw error
    }
  },

  // Get today's check-ins
  getTodayCheckIns: async () => {
    try {
      const response = await api.get('/api/phieu-thue/today-checkins')
      return response.data
    } catch (error) {
      console.error('Error fetching today check-ins:', error)
      throw error
    }
  },

  // Get today's check-outs
  getTodayCheckOuts: async () => {
    try {
      const response = await api.get('/api/phieu-thue/today-checkouts')
      return response.data
    } catch (error) {
      console.error('Error fetching today check-outs:', error)
      throw error
    }
  },

  // Get occupancy report
  getOccupancyReport: async (date) => {
    try {
      const response = await api.get(`/api/phieu-thue/occupancy-report?date=${date}`)
      return response.data
    } catch (error) {
      console.error('Error fetching occupancy report:', error)
      throw error
    }
  },

  // Get revenue report
  getRevenueReport: async (startDate, endDate) => {
    try {
      const response = await api.get(`/api/phieu-thue/revenue-report?startDate=${startDate}&endDate=${endDate}`)
      return response.data
    } catch (error) {
      console.error('Error fetching revenue report:', error)
      throw error
    }
  },

  // Get rental details with services and surcharges
  getRentalDetails: async (rentalId) => {
    try {
      const response = await api.get(`/api/phieu-thue/details/${rentalId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching rental details:', error)
      throw error
    }
  },

  // Update payment status
  updatePaymentStatus: async (rentalId, paymentStatus) => {
    try {
      const response = await api.put(`/api/phieu-thue/update-payment-status/${rentalId}?trangThaiThanhToan=${paymentStatus}`)
      return response.data
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  }
}
