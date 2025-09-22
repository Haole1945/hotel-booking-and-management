import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleBookingClick = (e) => {
    // If user is authenticated and is a customer, go to customer booking page
    if (isAuthenticated() && user?.role === 'CUSTOMER') {
      navigate('/customer/booking')
    } else {
      // For non-authenticated users or non-customers, go to home page and scroll to search
      e.preventDefault()
      navigate('/')
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        window.location.hash = 'search'
        const searchSection = document.querySelector('[data-search-section]')
        if (searchSection) {
          searchSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 100)
    }
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin'
      case 'EMPLOYEE':
        return '/staff'
      case 'CUSTOMER':
        return '/customer'
      default:
        return '/login'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Hotel Booking</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Trang chủ
            </Link>
            <button
              onClick={handleBookingClick}
              className="text-gray-700 hover:text-primary-600 transition-colors bg-transparent border-none cursor-pointer"
            >
              Đặt phòng
            </button>
            {isAuthenticated() && user?.role === 'CUSTOMER' && (
              <Link to="/customer/history" className="text-gray-700 hover:text-primary-600 transition-colors">
                Lịch sử đặt phòng
              </Link>
            )}
            
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{
                    user?.hoTen ||
                    (user?.ho && user?.ten ? `${user.ho} ${user.ten}`.trim() : '') ||
                    user?.tenNhanVien ||
                    user?.tenKhachHang ||
                    user?.email?.split('@')[0] ||
                    'Người dùng'
                  }</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Dashboard
                    </Link>
                    {user?.role === 'CUSTOMER' && (
                      <Link
                        to="/customer/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        Thông tin cá nhân
                      </Link>
                    )}
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
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <button
                onClick={(e) => {
                  setIsMenuOpen(false)
                  handleBookingClick(e)
                }}
                className="text-left text-gray-700 hover:text-primary-600 transition-colors bg-transparent border-none cursor-pointer"
              >
                Đặt phòng
              </button>

              {isAuthenticated() && user?.role === 'CUSTOMER' && (
                <Link
                  to="/customer/history"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Lịch sử đặt phòng
                </Link>
              )}
              
              {isAuthenticated() ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default PublicHeader
