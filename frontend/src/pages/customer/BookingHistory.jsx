import React, { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, Eye, Phone, X } from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import {
  mapBackendStatusToFrontend,
  getBookingStatusColor,
  getBookingStatusText
} from '../../constants/hotelInfo'

const BookingHistory = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    if (user) {
      fetchBookingHistory()
    }
  }, [user])

  const fetchBookingHistory = async () => {
    try {
      setLoading(true)

      console.log('Current user data:', user)

      // Kiểm tra user và lấy CCCD với nhiều fallback
      if (!user) {
        console.error('User not found')
        setLoading(false)
        return
      }

      // Thử nhiều field có thể chứa CCCD
      const userCCCD = user.cccd || user.id || user.maKhachHang || user.userId

      if (!userCCCD) {
        console.error('CCCD not found in user data:', user)
        setLoading(false)
        return
      }

      console.log('Fetching booking history for CCCD:', userCCCD)

      // Gọi API với CCCD của user
      const response = await api.get(`/api/phieu-dat/khach-hang/${userCCCD}`)
      console.log('API response:', response.data)

      const bookingData = response.data.phieuDatList || []
      console.log('Booking data:', bookingData)
      console.log('First booking sample:', bookingData[0])

      // Debug: Log all field names in first booking
      if (bookingData[0]) {
        console.log('Available fields in booking:', Object.keys(bookingData[0]))
        console.log('Status value:', bookingData[0].trangThai)
        console.log('Room info:', {
          tenKp: bookingData[0].tenKp,
          tenLp: bookingData[0].tenLp,
          idHangPhong: bookingData[0].idHangPhong
        })
        console.log('Date info:', {
          ngayDat: bookingData[0].ngayDat,
          ngayBdThue: bookingData[0].ngayBdThue,
          ngayDi: bookingData[0].ngayDi
        })
        console.log('Money info:', {
          soTienCoc: bookingData[0].soTienCoc
        })
      }

      setBookings(bookingData)
      setFilteredBookings(bookingData)
    } catch (error) {
      console.error('Error fetching booking history:', error)
      console.error('Error details:', error.response?.data || error.message)

      // Nếu lỗi 403, có thể do authentication
      if (error.response?.status === 403) {
        console.error('Access denied - check authentication')
      }
    } finally {
      setLoading(false)
    }
  }

  // Note: Sử dụng functions từ constants/hotelInfo.js
  // Chỉ còn 3 trạng thái: Chờ xác nhận, Xác nhận, Đã hủy

  const getStatusIcon = (status) => {
    // Map status to frontend format first
    const frontendStatus = mapBackendStatusToFrontend(status)
    switch (frontendStatus) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    applyFilters(status, dateFilter)
  }

  const handleDateFilter = (date) => {
    setDateFilter(date)
    applyFilters(statusFilter, date)
  }

  const applyFilters = (status, date) => {
    let filtered = [...bookings]

    if (status) {
      filtered = filtered.filter(booking => booking.status === status)
    }

    if (date) {
      const filterDate = new Date(date)
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate >= filterDate
      })
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setStatusFilter('')
    setDateFilter('')
    setFilteredBookings(bookings)
    setCurrentPage(1)
  }

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle view booking detail
  const handleViewDetail = (booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedBooking(null)
  }

  // Handle cancel booking
  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
  }

  const handleCloseCancelModal = () => {
    setShowCancelModal(false)
    setSelectedBooking(null)
  }

  // Hotel contact info
  const hotelContact = {
    name: "Khách sạn ABC",
    phone: "0123-456-789",
    email: "contact@hotel-abc.com",
    address: "123 Đường ABC, Quận 1, TP.HCM"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Kiểm tra user data
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Vui lòng đăng nhập để xem lịch sử đặt phòng</p>
      </div>
    )
  }

  const userCCCD = user.cccd || user.id || user.maKhachHang || user.userId
  if (!userCCCD) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không tìm thấy thông tin khách hàng</p>
        <p className="text-sm text-gray-500 mt-2">Vui lòng liên hệ hỗ trợ</p>
        <div className="mt-4">
          <p className="text-xs text-gray-400">Debug: User data</p>
          <pre className="text-xs text-gray-400 mt-2">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lịch sử đặt phòng</h1>
        <p className="text-gray-600 mt-2">Xem tất cả đặt phòng đã thực hiện</p>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="btn-outline w-full"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Kết quả ({filteredBookings.length} đặt phòng)
          </h2>
        </div>

        {filteredBookings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đặt phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBookings.map((booking) => (
                    <tr key={booking.idPd || booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.idPd || booking.maPhieuThue || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.ngayDat || booking.createdAt || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.tenLp || booking.roomNumber || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.tenKp || booking.roomType || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.ngayBdThue || booking.checkIn || 'N/A'} - {booking.ngayDi || booking.checkOut || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getBookingStatusColor(mapBackendStatusToFrontend(booking.trangThai))}`}>
                          {getStatusIcon(booking.trangThai)}
                          <span className="ml-1">{getBookingStatusText(mapBackendStatusToFrontend(booking.trangThai))}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(booking.soTienCoc || booking.total || 0).toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetail(booking)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking)}
                            className="text-red-600 hover:text-red-900"
                            title="Hủy phiếu đặt"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              itemsPerPage={bookingsPerPage}
              totalItems={filteredBookings.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đặt phòng nào
            </h3>
            <p className="text-gray-500">
              Bạn chưa có đặt phòng nào hoặc thử thay đổi bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Chi Tiết Phiếu Đặt
              </h2>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Thông tin cơ bản</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Mã phiếu đặt:</strong> {selectedBooking.idPd || selectedBooking.maPhieuThue}</p>
                    <p><strong>Ngày đặt:</strong> {new Date(selectedBooking.ngayDat || selectedBooking.ngayTao).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Trạng thái:</strong>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(selectedBooking.trangThai || selectedBooking.status)}`}>
                        {getBookingStatusText(selectedBooking.trangThai || selectedBooking.status)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Thông tin khách hàng</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Họ tên:</strong> {selectedBooking.hoTen || selectedBooking.tenKhachHang || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedBooking.email || 'N/A'}</p>
                    <p><strong>Số điện thoại:</strong> {selectedBooking.soDienThoai || selectedBooking.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Check-in/Check-out */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Thời gian lưu trú</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Ngày nhận phòng</p>
                    <p className="font-medium">{new Date(selectedBooking.ngayDen || selectedBooking.checkIn).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ngày trả phòng</p>
                    <p className="font-medium">{new Date(selectedBooking.ngayDi || selectedBooking.checkOut).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Số đêm</p>
                    <p className="font-medium">
                      {Math.ceil((new Date(selectedBooking.ngayDi || selectedBooking.checkOut) - new Date(selectedBooking.ngayDen || selectedBooking.checkIn)) / (1000 * 60 * 60 * 24))} đêm
                    </p>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              {selectedBooking.danhSachPhong && selectedBooking.danhSachPhong.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Chi tiết phòng</h3>
                  <div className="space-y-3">
                    {selectedBooking.danhSachPhong.map((room, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p><strong>Hạng phòng:</strong> {room.tenHangPhong || 'N/A'}</p>
                          <p><strong>Số lượng:</strong> {room.soLuong || 1} phòng</p>
                          <p><strong>Giá:</strong> {(room.gia || 0).toLocaleString('vi-VN')} VND/đêm</p>
                          <p><strong>Thành tiền:</strong> {(room.thanhTien || 0).toLocaleString('vi-VN')} VND</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Thông tin thanh toán</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Tổng tiền:</strong> {(selectedBooking.tongTien || 0).toLocaleString('vi-VN')} VND</p>
                    <p><strong>Phương thức:</strong> {selectedBooking.phuongThucThanhToan || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <p><strong>Trạng thái thanh toán:</strong> {selectedBooking.trangThaiThanhToan || 'Chưa thanh toán'}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.ghiChu && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Ghi chú</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.ghiChu}</p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseDetailModal}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Hủy Phiếu Đặt
              </h2>
              <button
                onClick={handleCloseCancelModal}
                className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Thông tin phiếu đặt:</h3>
              <p className="text-sm text-gray-600">
                <strong>Mã phiếu:</strong> {selectedBooking.idPd || selectedBooking.maPhieuThue}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Ngày đặt:</strong> {new Date(selectedBooking.ngayDat || selectedBooking.ngayTao).toLocaleDateString('vi-VN')}
              </p>
            </div>

            {/* Contact Info */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Để hủy phiếu đặt, vui lòng liên hệ:
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">{hotelContact.name}</p>
                    <p className="text-sm text-gray-600">{hotelContact.phone}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Email:</strong> {hotelContact.email}</p>
                  <p><strong>Địa chỉ:</strong> {hotelContact.address}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href={`tel:${hotelContact.phone}`}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Gọi ngay
              </a>
              <button
                onClick={handleCloseCancelModal}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Đóng
              </button>
            </div>

            {/* Note */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Lưu ý:</strong> Việc hủy phiếu đặt có thể áp dụng phí hủy theo chính sách của khách sạn.
                Vui lòng liên hệ trực tiếp để được tư vấn chi tiết.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingHistory
