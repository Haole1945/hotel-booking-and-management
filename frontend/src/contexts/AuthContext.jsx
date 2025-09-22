import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { normalizeUserData } from '../utils/userUtils'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      if (savedToken && savedUser) {
        try {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error parsing saved user:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)

      if (response.statusCode === 200 || response.success) {
        const { token, role, nhanVien, khachHang, user } = response

        // Xử lý dữ liệu user từ backend
        let userData = {}

        if (nhanVien) {
          // Nhân viên
          userData = normalizeUserData(nhanVien, role || 'EMPLOYEE')
        } else if (khachHang) {
          // Khách hàng
          userData = normalizeUserData(khachHang, 'CUSTOMER')
        } else if (user) {
          // Fallback cho cấu trúc user khác
          userData = normalizeUserData(user, role || user.role || 'CUSTOMER')
        } else {
          // Nếu không có dữ liệu user nào, tạo fallback từ response
          userData = normalizeUserData({
            ...response,
            email: response.email || credentials.email || ''
          }, role || response.role || 'CUSTOMER')
        }



        setToken(token)
        setUser(userData)

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))

        return { success: true, user: userData }
      } else {
        return { success: false, message: response.message || 'Đăng nhập thất bại' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Đăng nhập thất bại' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      
      if (response.statusCode === 200) {
        return { success: true, message: 'Đăng ký thành công' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, message: 'Đăng ký thất bại' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData }
    setUser(newUserData)
    localStorage.setItem('user', JSON.stringify(newUserData))
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const hasRole = (roles) => {
    if (!user) return false
    if (typeof roles === 'string') {
      return user.role === roles
    }
    return roles.includes(user.role)
  }

  const value = {
    user,
    setUser,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
