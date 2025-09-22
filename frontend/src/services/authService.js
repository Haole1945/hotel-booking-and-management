import { api } from './api'

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)

      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }

      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Đăng nhập thất bại' }
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Đăng ký thất bại' }
    }
  },

  async logout() {
    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken() {
    return localStorage.getItem('token')
  },

  // Helper methods from old ApiService
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role === 'ADMIN'
  },

  isEmployee() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role === 'EMPLOYEE'
  },

  isUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role === 'CUSTOMER'
  }
}

// Export default for compatibility
export default authService
