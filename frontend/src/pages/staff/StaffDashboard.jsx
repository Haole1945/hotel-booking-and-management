import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { dashboardService } from '../../services/dashboardService'
import { getUserDisplayName } from '../../utils/userUtils'
import StaffStatsCards from '../../components/staff/StaffStatsCards'
import {
  Calendar,
  UserCheck,
  UserX,
  UserPlus,
  Building,
  Settings,
  Users,
  RefreshCw,
  FileText
} from 'lucide-react'

const StaffDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalReservations: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    pendingReservations: 0
  })
  const [todayActivities, setTodayActivities] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // Fetch stats API (priority - this one works)
    let statsResponse = null
    try {
      statsResponse = await dashboardService.getStaffStats()
    } catch (error) {
      console.error('❌ Stats API failed:', error)
    }

    // Fetch check-ins API (optional - may fail)
    let checkInsResponse = { phieuDatList: [] }
    try {
      checkInsResponse = await dashboardService.getTodayCheckIns()
    } catch (error) {
      console.error('⚠️ Check-ins API failed (using empty data):', error.message)
    }

    // Fetch check-outs API (optional - may fail)
    let checkOutsResponse = { phieuThueList: [] }
    try {
      checkOutsResponse = await dashboardService.getTodayCheckOuts()
    } catch (error) {
      console.error('⚠️ Check-outs API failed (using empty data):', error.message)
    }

    // Process stats data if available
    if (statsResponse) {
      const apiStats = statsResponse.stats || statsResponse

      const newStats = {
        totalReservations: apiStats.confirmedBookings || 0, // Đặt phòng đã xác nhận chưa check-in
        checkInsToday: apiStats.todayCheckIns || 0, // Từ API stats
        checkOutsToday: apiStats.todayCheckOuts || 0, // Từ API stats
        occupiedRooms: apiStats.occupiedRooms || 0, // Phòng đang có khách (từ API)
        availableRooms: apiStats.availableRooms || 0, // Phòng trống (từ API)
        cleaningRooms: apiStats.cleaningRooms || 0, // Phòng đang dọn dẹp (từ API)
        maintenanceRooms: apiStats.maintenanceRooms || 0, // Phòng đang bảo trì (từ API)
        todayBookings: apiStats.todayBookings || 0, // Phiếu đặt mới hôm nay (từ API)
        pendingReservations: apiStats.pendingBookings || 0, // Đặt phòng chờ xác nhận
        totalRooms: apiStats.totalRooms || 0, // Tổng số phòng
        occupancyRate: apiStats.occupancyRate || 0 // Tỷ lệ lấp đầy
      }

      setStats(newStats)
    } else {
      // Fallback if stats API fails
      setStats({
        totalReservations: 0,
        checkInsToday: 0,
        checkOutsToday: 0,
        occupiedRooms: 0,
        availableRooms: 0,
        cleaningRooms: 0,
        maintenanceRooms: 0,
        todayBookings: 0,
        pendingReservations: 0,
        totalRooms: 0,
        occupancyRate: 0
      })
    }

    // Set list data (even if empty)
    setTodayActivities(checkInsResponse.activities || [])
    setUpcomingTasks(checkOutsResponse.activities || [])
  }



  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Chào mừng, {getUserDisplayName(user)}!
        </h1>
        <p className="text-blue-100">
          Dashboard lễ tân - Quản lý đặt phòng và dịch vụ khách hàng
        </p>
      </div>

      {/* Stats Cards */}
      <StaffStatsCards stats={stats} />

      {/* Quick Actions */}
      <div className="space-y-6">
        {/* First row - 4 main actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/staff/reservations" className="card hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý đặt phòng</h3>
            <p className="text-gray-600">Xem và quản lý tất cả đặt phòng</p>
          </div>
        </Link>

          <Link to="/staff/checkin" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-in</h3>
              <p className="text-gray-600">Thực hiện check-in cho khách hàng</p>
            </div>
          </Link>

          <Link to="/staff/checkout" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserX className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-out</h3>
              <p className="text-gray-600">Thực hiện check-out cho khách hàng</p>
            </div>
          </Link>

          <Link to="/staff/walkin" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="p-4 bg-teal-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Walk-in Check-in</h3>
              <p className="text-gray-600">Check-in khách không đặt trước</p>
            </div>
          </Link>
        </div>

        {/* Second row - 6 management actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

          <Link to="/staff/rooms" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="p-4 bg-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý phòng</h3>
              <p className="text-gray-600">Quản lý thông tin phòng khách sạn</p>
            </div>
          </Link>

          <Link to="/staff/services" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dịch vụ & Phụ thu</h3>
              <p className="text-gray-600">Quản lý dịch vụ và phụ thu khách sạn</p>
            </div>
          </Link>

          <Link to="/staff/rentals" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý thuê phòng</h3>
              <p className="text-gray-600">Quản lý chi tiết phiếu thuê và khách ở</p>
            </div>
          </Link>

          <Link to="/staff/room-changes" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="p-4 bg-cyan-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý đổi phòng</h3>
              <p className="text-gray-600">Theo dõi và xử lý yêu cầu đổi phòng</p>
            </div>
          </Link>

          <Link to="/staff/invoices" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý hóa đơn</h3>
              <p className="text-gray-600">Xem và quản lý hóa đơn thanh toán</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Check-ins */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Khách hàng sẽ tới hôm nay</h2>
            <Link to="/staff/checkin" className="text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-4">
            {todayActivities.length > 0 ? (
              todayActivities.map((activity, index) => (
                <div key={activity.id || activity.idPd || index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {activity.customerName || activity.hoTenKhachHang || 'Khách hàng'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.roomNumber ? `Phòng ${activity.roomNumber}` : 'Chờ phân phòng'} • {activity.checkInTime || activity.ngayBdThue || 'Chưa xác định'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">
                    Check-in
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Không có khách check-in hôm nay</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Check-outs */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Khách hàng trả phòng hôm nay</h2>
            <Link to="/staff/checkout" className="text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, index) => (
                <div key={task.id || task.idPt || index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <UserX className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {task.customerName || task.hoTenKhachHang || 'Khách hàng'}
                      </div>
                      <div className="text-sm text-gray-500">
                        CCCD: {task.cccd} • Ngày đi: {task.ngayDi} • {task.soNgayThue} ngày
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full text-orange-600 bg-orange-100">
                    Check-out
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserX className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Không có khách check-out hôm nay</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard
