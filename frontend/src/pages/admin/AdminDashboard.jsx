import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Coffee
} from 'lucide-react'
import { api } from '../../services/api'
import { dashboardService } from '../../services/dashboardService'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalStaff: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    totalServices: 0,
    totalAmenities: 0,
    pendingReservations: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
    occupancyRate: 0
  })


  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Gọi API thực tế để lấy thống kê dashboard
      const response = await dashboardService.getAdminStats()
      const statsData = response.stats || {}

      setStats(statsData)


    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }



  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Chào mừng, {user?.hoTen ||
                      user?.tenNhanVien ||
                      `${user?.ho || ''} ${user?.ten || ''}`.trim() ||
                      user?.email?.split('@')[0] ||
                      'Quản lý'}!
        </h1>
        <p className="text-purple-100">
          Dashboard quản lý - Tổng quan hoạt động khách sạn
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tỷ lệ phòng đang được thuê</p>
              <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
              <p className="text-xs text-gray-500">
                {(stats.occupiedRooms || 0) + (stats.reservedRooms || 0)}/{stats.totalRooms} phòng
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Bao gồm phòng có khách + đã đặt
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu tháng</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.monthlyRevenue / 1000000).toFixed(0)}M
              </p>
              <p className="text-xs text-gray-500">VNĐ</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className="text-xs text-gray-500">+12% tháng này</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.todayRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">VNĐ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
            <p className="text-xl font-bold text-gray-900">{stats.pendingReservations}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Check-in hôm nay</p>
            <p className="text-xl font-bold text-gray-900">{stats.checkInsToday}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Check-out hôm nay</p>
            <p className="text-xl font-bold text-gray-900">{stats.checkOutsToday}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Nhân viên</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalStaff}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-yellow-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Coffee className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Dịch vụ</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalServices}</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="p-3 bg-emerald-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Star className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Tiện nghi</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalAmenities}</p>
          </div>
        </div>
      </div>

      {/* Room Status Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết trạng thái phòng</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.availableRooms || 0}</div>
            <div className="text-sm text-green-700">Trống</div>
            <div className="text-xs text-green-600 mt-1">
              {stats.totalRooms > 0 ? ((stats.availableRooms || 0) / stats.totalRooms * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.occupiedRooms || 0}</div>
            <div className="text-sm text-blue-700">Đã có khách</div>
            <div className="text-xs text-blue-600 mt-1">
              {stats.totalRooms > 0 ? ((stats.occupiedRooms || 0) / stats.totalRooms * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.cleaningRooms || 0}</div>
            <div className="text-sm text-yellow-700">Đang dọn dẹp</div>
            <div className="text-xs text-yellow-600 mt-1">
              {stats.totalRooms > 0 ? ((stats.cleaningRooms || 0) / stats.totalRooms * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.maintenanceRooms || 0}</div>
            <div className="text-sm text-red-700">Đang bảo trì</div>
            <div className="text-xs text-red-600 mt-1">
              {stats.totalRooms > 0 ? ((stats.maintenanceRooms || 0) / stats.totalRooms * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.reservedRooms || 0}</div>
            <div className="text-sm text-purple-700">Đã đặt</div>
            <div className="text-xs text-purple-600 mt-1">
              {stats.totalRooms > 0 ? ((stats.reservedRooms || 0) / stats.totalRooms * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Link to="/admin/rooms" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý phòng</h3>
            <p className="text-gray-600 text-sm">Thêm, sửa, xóa phòng</p>
          </div>
        </Link>

        <Link to="/admin/staff" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý nhân viên</h3>
            <p className="text-gray-600 text-sm">Thông tin nhân viên</p>
          </div>
        </Link>

        <Link to="/admin/services" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Coffee className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý dịch vụ</h3>
            <p className="text-gray-600 text-sm">Dịch vụ khách sạn</p>
          </div>
        </Link>

        <Link to="/admin/amenities" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý tiện nghi</h3>
            <p className="text-gray-600 text-sm">Tiện nghi phòng</p>
          </div>
        </Link>

        <Link to="/admin/reports" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Báo cáo</h3>
            <p className="text-gray-600 text-sm">Thống kê & phân tích</p>
          </div>
        </Link>

        <Link to="/admin/surcharges" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý phụ thu</h3>
            <p className="text-gray-600 text-sm">Phụ thu dịch vụ</p>
          </div>
        </Link>
      </div>


    </div>
  )
}

export default AdminDashboard
