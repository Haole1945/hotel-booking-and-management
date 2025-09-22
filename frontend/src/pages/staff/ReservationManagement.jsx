import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import { bookingService } from '../../services/bookingService'
import { roomService } from '../../services/roomService'
import {
  mapBackendStatusToFrontend,
  mapFrontendStatusToBackend,
  getBookingStatusColor,
  getBookingStatusText
} from '../../constants/hotelInfo'

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [reservationsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  })

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      // Gọi API thực tế thay vì mock data
      const response = await bookingService.getAllBookings()
      const reservationData = response.phieuDatList || []

      // Transform data to match frontend format
      const transformedData = reservationData.map(booking => ({
        id: booking.idPd,
        maPhieuThue: `PD${booking.idPd}`,
        customerName: booking.hoTenKhachHang || 'N/A',
        customerPhone: booking.sdtKhachHang || 'N/A',
        customerEmail: booking.emailKhachHang || booking.email || 'N/A',
        roomNumber: booking.soPhong || 'Chưa chọn',
        roomType: 'Standard', // Default value
        kieuPhong: booking.tenKp || 'Chưa xác định',
        loaiPhong: booking.tenLp || 'Chưa xác định',
        soLuongPhongO: booking.soLuongPhongO || 0,
        idKp: booking.idKp,
        idLp: booking.idLp,
        checkIn: booking.ngayBdThue,
        checkOut: booking.ngayDi,
        status: mapBackendStatusToFrontend(booking.trangThai),
        total: booking.soTienCoc || 0,
        createdAt: booking.ngayDat,
        cccd: booking.cccd,
        employeeId: booking.idNv,
        employeeName: booking.hoTenNhanVien
      }))

      setReservations(transformedData)
      setFilteredReservations(transformedData)
    } catch (error) {
      console.error('Error fetching reservations:', error)
      setReservations([])
      setFilteredReservations([])
    } finally {
      setLoading(false)
    }
  }

  // Note: Sử dụng functions từ constants/hotelInfo.js
  // Chỉ còn 3 trạng thái: Chờ xác nhận, Xác nhận, Đã hủy

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (currentFilters) => {
    let filtered = [...reservations]

    // Filter by status
    if (currentFilters.status) {
      filtered = filtered.filter(reservation => reservation.status === currentFilters.status)
    }

    // Filter by date range
    if (currentFilters.dateFrom) {
      filtered = filtered.filter(reservation =>
        new Date(reservation.checkIn) >= new Date(currentFilters.dateFrom)
      )
    }

    if (currentFilters.dateTo) {
      filtered = filtered.filter(reservation =>
        new Date(reservation.checkOut) <= new Date(currentFilters.dateTo)
      )
    }

    // Filter by search term
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(searchLower) ||
        reservation.maPhieuThue.toLowerCase().includes(searchLower) ||
        reservation.roomNumber.includes(searchLower)
      )
    }

    setFilteredReservations(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      searchTerm: ''
    })
    setFilteredReservations(reservations)
    setCurrentPage(1)
  }

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      const backendStatus = mapFrontendStatusToBackend(newStatus)

      if (newStatus === 'confirmed') {
        await bookingService.confirmBooking(reservationId)
      } else if (newStatus === 'cancelled') {
        await bookingService.cancelBooking(reservationId, 'Hủy bởi lễ tân')
      } else {
        await bookingService.updateBookingStatus(reservationId, backendStatus)
      }

      // Update local state
      setReservations(prev =>
        prev.map(reservation =>
          reservation.id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation
        )
      )

      // Reapply filters
      applyFilters(filters)
    } catch (error) {
      console.error('Error updating reservation status:', error)
      alert('Có lỗi xảy ra khi cập nhật trạng thái đặt phòng')
    }
  }

  const handleViewReservation = (reservation) => {
    setSelectedReservation(reservation)
    setShowViewModal(true)
  }

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation)
    setShowEditModal(true)
  }

  const handleDeleteReservation = async (reservationId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu đặt này không?')) {
      try {
        await bookingService.deleteBooking(reservationId)

        // Reload data from server to ensure consistency
        await fetchReservations()

        alert('Xóa phiếu đặt thành công!')
      } catch (error) {
        console.error('Error deleting reservation:', error)
        alert('Có lỗi xảy ra khi xóa phiếu đặt')
      }
    }
  }

  const handleUpdateReservation = async (updatedData) => {
    try {


      // Use new simple update API
      const updateRequest = {
        customerName: updatedData.customerName,
        customerPhone: updatedData.customerPhone,
        customerEmail: updatedData.customerEmail,
        checkIn: updatedData.checkIn,
        checkOut: updatedData.checkOut,
        status: mapFrontendStatusToBackend(updatedData.status),
        soTienCoc: updatedData.soTienCoc,
        kieuPhong: updatedData.kieuPhong,
        loaiPhong: updatedData.loaiPhong,
        soLuongPhongO: updatedData.soLuongPhongO
      }

      const response = await bookingService.updateBookingSimple(selectedReservation.id, updateRequest)

      if (response.statusCode === 200) {
        // Update local state
        setReservations(prev =>
          prev.map(reservation =>
            reservation.id === selectedReservation.id
              ? {
                  ...reservation,
                  customerName: updatedData.customerName,
                  customerPhone: updatedData.customerPhone,
                  customerEmail: updatedData.customerEmail,
                  checkIn: updatedData.checkIn,
                  checkOut: updatedData.checkOut,
                  kieuPhong: updatedData.kieuPhong,
                  loaiPhong: updatedData.loaiPhong,
                  soLuongPhongO: updatedData.soLuongPhongO,
                  total: updatedData.soTienCoc,
                  status: updatedData.status
                }
              : reservation
          )
        )
        setShowEditModal(false)
        setSelectedReservation(null)
        alert('Cập nhật đặt phòng thành công!')
        // Refresh data
        fetchReservations()
      } else {
        throw new Error(response.message || 'Lỗi cập nhật đặt phòng')
      }

    } catch (error) {
      console.error('Error updating reservation:', error)
      alert('Có lỗi xảy ra khi cập nhật đặt phòng: ' + (error.response?.data?.message || error.message))
    }
  }

  // Get current reservations for pagination
  const indexOfLastReservation = currentPage * reservationsPerPage
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đặt phòng</h1>
        <p className="text-gray-600 mt-2">Xem và quản lý tất cả đặt phòng của khách sạn</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm và lọc</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên khách, mã đặt phòng, số phòng..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="input"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="input"
            />
          </div>

          {/* Clear Filters */}
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
            Kết quả ({filteredReservations.length} đặt phòng)
          </h2>
        </div>

        {filteredReservations.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đặt phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kiểu & Loại phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền cọc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.maPhieuThue}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.createdAt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.customerName}
                          </div>
                          <div className="text-sm text-gray-500">{reservation.customerPhone}</div>
                          <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.kieuPhong}
                          </div>
                          <div className="text-sm text-gray-500">{reservation.loaiPhong}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reservation.checkIn} - {reservation.checkOut}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getBookingStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="ml-1">{getBookingStatusText(reservation.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.total.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewReservation(reservation)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditReservation(reservation)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReservation(reservation.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa phiếu đặt"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                                title="Xác nhận đặt phòng"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                                title="Hủy đặt phòng"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              itemsPerPage={reservationsPerPage}
              totalItems={filteredReservations.length}
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
              Không tìm thấy đặt phòng nào phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* View Reservation Modal */}
      {showViewModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Chi tiết đặt phòng</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Tên khách hàng</label>
                    <p className="text-sm text-gray-900">{selectedReservation.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
                    <p className="text-sm text-gray-900">{selectedReservation.customerPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900">{selectedReservation.customerEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">CCCD</label>
                    <p className="text-sm text-gray-900">{selectedReservation.cccd || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin đặt phòng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Mã đặt phòng</label>
                    <p className="text-sm text-gray-900">{selectedReservation.maPhieuThue}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Ngày check-in</label>
                    <p className="text-sm text-gray-900">{new Date(selectedReservation.checkIn).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Ngày check-out</label>
                    <p className="text-sm text-gray-900">{new Date(selectedReservation.checkOut).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Kiểu phòng</label>
                    <p className="text-sm text-gray-900">{selectedReservation.kieuPhong}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Loại phòng</label>
                    <p className="text-sm text-gray-900">{selectedReservation.loaiPhong}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Số lượng phòng ở</label>
                    <p className="text-sm text-gray-900">{selectedReservation.soLuongPhongO || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Số tiền cọc</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedReservation.total.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getBookingStatusColor(selectedReservation.status)}`}>
                      {getStatusIcon(selectedReservation.status)}
                      <span className="ml-1">{getBookingStatusText(selectedReservation.status)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Employee Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin nhân viên</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nhân viên tạo</label>
                    <p className="text-sm text-gray-900">{selectedReservation.employeeName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Mã nhân viên</label>
                    <p className="text-sm text-gray-900">{selectedReservation.employeeId || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="btn-outline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reservation Modal */}
      {showEditModal && selectedReservation && (
        <EditReservationModal
          reservation={selectedReservation}
          onClose={() => {
            setShowEditModal(false)
            setSelectedReservation(null)
          }}
          onUpdate={handleUpdateReservation}
        />
      )}
    </div>
  )
}

// Edit Reservation Modal Component
const EditReservationModal = ({ reservation, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    customerName: reservation.customerName || '',
    customerPhone: reservation.customerPhone || '',
    customerEmail: reservation.customerEmail || '',
    checkIn: reservation.checkIn || '',
    checkOut: reservation.checkOut || '',
    kieuPhong: reservation.kieuPhong || '',
    loaiPhong: reservation.loaiPhong || '',
    soLuongPhongO: reservation.soLuongPhongO || 0,
    soTienCoc: reservation.total || 0,
    status: reservation.status || ''
  })

  const [roomTypes, setRoomTypes] = useState([])
  const [roomCategories, setRoomCategories] = useState([])

  useEffect(() => {
    fetchRoomTypes()
    fetchRoomCategories()
  }, [])

  const fetchRoomTypes = async () => {
    try {
      const response = await roomService.getAllRoomTypes()
      setRoomTypes(response.kieuPhongList || [])
    } catch (error) {
      console.error('Error fetching room types:', error)
    }
  }

  const fetchRoomCategories = async () => {
    try {
      const response = await roomService.getAllRoomCategories()
      setRoomCategories(response.loaiPhongList || [])
    } catch (error) {
      console.error('Error fetching room categories:', error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Chỉnh sửa đặt phòng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin khách hàng */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleChange('customerPhone', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Thông tin đặt phòng */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin đặt phòng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày check-in <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => handleChange('checkIn', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày check-out <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => handleChange('checkOut', e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kiểu phòng
                </label>
                <select
                  value={formData.kieuPhong}
                  onChange={(e) => handleChange('kieuPhong', e.target.value)}
                  className="input"
                >
                  <option value="">Chọn kiểu phòng</option>
                  {roomTypes.map(type => (
                    <option key={type.idKp} value={type.tenKp}>
                      {type.tenKp}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại phòng
                </label>
                <select
                  value={formData.loaiPhong}
                  onChange={(e) => handleChange('loaiPhong', e.target.value)}
                  className="input"
                >
                  <option value="">Chọn loại phòng</option>
                  {roomCategories.map(category => (
                    <option key={category.idLp} value={category.tenLp}>
                      {category.tenLp}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng phòng ở
                </label>
                <input
                  type="number"
                  value={formData.soLuongPhongO}
                  onChange={(e) => handleChange('soLuongPhongO', parseInt(e.target.value) || 0)}
                  className="input"
                  placeholder="VD: 1, 2, 3..."
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền cọc (VNĐ)
                </label>
                <input
                  type="text"
                  value={formData.soTienCoc ? formData.soTienCoc.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    handleChange('soTienCoc', parseInt(value) || 0);
                  }}
                  className="input"
                  placeholder="VD: 500,000"
                  style={{ appearance: 'textfield' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="input"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Xác nhận</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReservationManagement
