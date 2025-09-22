import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Footer = () => {
  const { isAuthenticated, user } = useAuth()

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
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold">HOTEL BOOKING</span>
            </div>
            <p className="text-gray-300 mb-4">
              Hệ thống quản lý đặt phòng khách sạn hiện đại, mang đến trải nghiệm tuyệt vời cho khách hàng.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>booking@hotel.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              {isAuthenticated() ? (
                <li>
                  <Link to={getDashboardLink()} className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                      Đăng nhập
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                      Đăng ký
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-1" />
                <span>97 Man Thiện, Hiệp Phú, Thủ Đức, Hồ Chí Minh</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>booking@hotel.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Hotel Booking Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
