import { api } from './api'

// Customer Service (KhachHang)
export const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      const response = await api.get('/api/khach-hang/all')
      return response.data
    } catch (error) {
      console.error('Error fetching all customers:', error)
      throw error
    }
  },

  // Get customer by CCCD
  getCustomerById: async (cccd) => {
    try {
      const response = await api.get(`/api/khach-hang/get-by-id/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer by CCCD:', error)
      throw error
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/api/khach-hang/create', customerData)
      return response.data
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    }
  },

  // Update customer
  updateCustomer: async (cccd, customerData) => {
    try {
      const response = await api.put(`/api/khach-hang/update/${cccd}`, customerData)
      return response.data
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  },

  // Delete customer
  deleteCustomer: async (cccd) => {
    try {
      const response = await api.delete(`/api/khach-hang/delete/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  },

  // Search customers
  searchCustomers: async (keyword) => {
    try {
      const response = await api.get(`/api/khach-hang/search?keyword=${encodeURIComponent(keyword)}`)
      return response.data
    } catch (error) {
      console.error('Error searching customers:', error)
      throw error
    }
  },

  // Get customer by email
  getCustomerByEmail: async (email) => {
    try {
      const response = await api.get(`/api/khach-hang/email/${email}`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer by email:', error)
      throw error
    }
  },

  // Get customer by phone
  getCustomerByPhone: async (phone) => {
    try {
      const response = await api.get(`/api/khach-hang/phone/${phone}`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer by phone:', error)
      throw error
    }
  },

  // Get customer booking history
  getCustomerBookingHistory: async (cccd) => {
    try {
      const response = await api.get(`/api/khach-hang/booking-history/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer booking history:', error)
      throw error
    }
  },

  // Get customer rental history
  getCustomerRentalHistory: async (cccd) => {
    try {
      const response = await api.get(`/api/khach-hang/rental-history/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer rental history:', error)
      throw error
    }
  },

  // Get customer statistics
  getCustomerStats: async (cccd) => {
    try {
      const response = await api.get(`/api/khach-hang/stats/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error fetching customer statistics:', error)
      throw error
    }
  },

  // Validate customer data
  validateCustomer: async (customerData) => {
    try {
      const response = await api.post('/api/khach-hang/validate', customerData)
      return response.data
    } catch (error) {
      console.error('Error validating customer:', error)
      throw error
    }
  },

  // Check if customer exists
  checkCustomerExists: async (cccd) => {
    try {
      const response = await api.get(`/api/khach-hang/exists/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error checking customer existence:', error)
      throw error
    }
  },

  // Get current customer profile (for logged in customer)
  getProfile: async () => {
    try {
      const response = await api.get('/api/khach-hang/profile')
      return response.data
    } catch (error) {
      console.error('Error fetching customer profile:', error)
      throw error
    }
  },

  // Update current customer profile
  updateProfile: async (cccd, profileData) => {
    try {
      const response = await api.put(`/api/khach-hang/update-profile/${cccd}`, profileData)
      return response.data
    } catch (error) {
      console.error('Error updating customer profile:', error)
      throw error
    }
  },

  // Change password for current customer
  changePassword: async (cccd, passwordData) => {
    try {
      const response = await api.put(`/api/khach-hang/change-password/${cccd}`, null, {
        params: {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      })
      return response.data
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  },

  // Upload avatar for current customer
  uploadAvatar: async (formData) => {
    try {
      const response = await api.post('/api/khach-hang/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }
}
