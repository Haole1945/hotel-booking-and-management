import { api } from './api'

// Booking Service (PhieuDat)
export const bookingService = {
  // Get all bookings
  getAllBookings: async () => {
    try {
      const response = await api.get('/api/phieu-dat/all')
      return response.data
    } catch (error) {
      console.error('Error fetching all bookings:', error)
      throw error
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/api/phieu-dat/get-by-id/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching booking by ID:', error)
      throw error
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/api/phieu-dat/create', bookingData)
      return response.data
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  },

  // Create booking at reception
  createBookingAtReception: async (bookingData) => {
    try {
      const response = await api.post('/api/phieu-dat/create-at-reception', bookingData)
      return response.data
    } catch (error) {
      console.error('Error creating booking at reception:', error)
      throw error
    }
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    try {
      const response = await api.put(`/api/phieu-dat/update/${id}`, bookingData)
      return response.data
    } catch (error) {
      console.error('Error updating booking:', error)
      throw error
    }
  },

  // Delete booking
  deleteBooking: async (id) => {
    try {
      const response = await api.delete(`/api/phieu-dat/delete/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  },

  // Get bookings by customer CCCD
  getBookingsByCustomer: async (cccd) => {
    try {
      const response = await api.get(`/api/phieu-dat/khach-hang/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error fetching bookings by customer:', error)
      throw error
    }
  },

  // Get bookings by employee
  getBookingsByEmployee: async (employeeId) => {
    try {
      const response = await api.get(`/api/phieu-dat/nhan-vien/${employeeId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching bookings by employee:', error)
      throw error
    }
  },

  // Get bookings by status
  getBookingsByStatus: async (status) => {
    try {
      const response = await api.get(`/api/phieu-dat/trang-thai/${status}`)
      return response.data
    } catch (error) {
      console.error('Error fetching bookings by status:', error)
      throw error
    }
  },

  // Get bookings by date range
  getBookingsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/api/phieu-dat/date-range?startDate=${startDate}&endDate=${endDate}`)
      return response.data
    } catch (error) {
      console.error('Error fetching bookings by date range:', error)
      throw error
    }
  },

  // Confirm booking
  confirmBooking: async (id) => {
    try {
      const response = await api.put(`/api/phieu-dat/confirm/${id}`)
      return response.data
    } catch (error) {
      console.error('Error confirming booking:', error)
      throw error
    }
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    try {
      const response = await api.put(`/api/phieu-dat/cancel/${id}?reason=${encodeURIComponent(reason)}`)
      return response.data
    } catch (error) {
      console.error('Error canceling booking:', error)
      throw error
    }
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`/api/phieu-dat/update-status/${id}?trangThai=${encodeURIComponent(status)}`)
      return response.data
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  },

  // Update booking with simple data
  updateBookingSimple: async (id, bookingData) => {
    try {
      const response = await api.put(`/api/phieu-dat/update-simple/${id}`, bookingData)
      return response.data
    } catch (error) {
      console.error('Error updating booking simple:', error)
      throw error
    }
  },

  // Delete booking
  deleteBooking: async (id) => {
    try {
      const response = await api.delete(`/api/phieu-dat/delete/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  },

  // Get pending bookings
  getPendingBookings: async () => {
    try {
      const response = await api.get('/api/phieu-dat/pending')
      return response.data
    } catch (error) {
      console.error('Error fetching pending bookings:', error)
      throw error
    }
  },

  // Get today's bookings
  getTodayBookings: async () => {
    try {
      const response = await api.get('/api/phieu-dat/today')
      return response.data
    } catch (error) {
      console.error('Error fetching today bookings:', error)
      throw error
    }
  },

  // Get confirmed bookings
  getConfirmedBookings: async () => {
    try {
      const response = await api.get('/api/phieu-dat/confirmed')
      return response.data
    } catch (error) {
      console.error('Error fetching confirmed bookings:', error)
      throw error
    }
  },

  // Validate booking dates
  validateBookingDates: async (checkIn, checkOut) => {
    try {
      const response = await api.get(`/api/phieu-dat/validate-dates?checkIn=${checkIn}&checkOut=${checkOut}`)
      return response.data
    } catch (error) {
      console.error('Error validating booking dates:', error)
      throw error
    }
  }
}
