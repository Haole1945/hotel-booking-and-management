import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Bell, User, LogOut, Settings, Menu } from 'lucide-react'
import { getUserDisplayName, getRoleDisplayName } from '../../utils/userUtils'
import { employeeService } from '../../services/employeeService'

const DashboardHeader = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [employeeData, setEmployeeData] = useState(null)
  const { user, logout, setUser } = useAuth()
  const navigate = useNavigate()

  // Decode JWT token to get email
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding JWT:', error)
      return null
    }
  }

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user || employeeData) return

      let email = user?.email

      // Try to get email from JWT if not in user object
      if (!email) {
        const token = localStorage.getItem('token') || user?.token
        if (token) {
          const decoded = decodeJWT(token)
          email = decoded?.sub
        }
      }

      if (email && user?.role === 'EMPLOYEE') {
        try {
          const response = await employeeService.getEmployeeByEmail(email)

          if (response.statusCode === 200 && response.nhanVien) {
            const employee = response.nhanVien
            setEmployeeData(employee)

            // Update user context with employee data
            if (setUser && typeof user === 'object') {
              const updatedUser = {
                ...user,
                id: employee.idNv || employee.maNhanVien || employee.id,
                idNv: employee.idNv,
                maNhanVien: employee.maNhanVien,
                hoTen: employee.hoTen || employee.tenNhanVien || user.hoTen,
                soDienThoai: employee.soDienThoai || user.soDienThoai,
                diaChi: employee.diaChi || user.diaChi,
                employeeData: employee
              }
              setUser(updatedUser)
              localStorage.setItem('user', JSON.stringify(updatedUser))
            }
          }
        } catch (error) {
          console.error('Error fetching employee data for header:', error)
        }
      }
    }

    fetchEmployeeData()
  }, [user, employeeData, setUser])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Get display name with employee data priority
  const getDisplayName = () => {
    if (employeeData) {
      return employeeData.hoTen || employeeData.tenNhanVien || getUserDisplayName(user)
    }
    return getUserDisplayName(user)
  }



  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Hotel Booking</span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{getRoleDisplayName(user?.role)} Dashboard</span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">
                    {getDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRoleDisplayName(user?.role)}
                  </div>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {getDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                    {employeeData && (
                      <div className="text-xs text-gray-400">
                        ID: {employeeData.idNv || employeeData.maNhanVien}
                      </div>
                    )}
                  </div>
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Thông tin cá nhân
                  </Link>
                  
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Về trang chủ
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
