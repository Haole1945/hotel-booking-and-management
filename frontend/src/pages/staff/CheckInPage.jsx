import React, { useState, useEffect } from 'react'
import { Search, UserCheck, Calendar, Clock, AlertCircle, CheckCircle, MapPin, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { bookingService } from '../../services/bookingService'
import { rentalService } from '../../services/rentalService'
import { roomService } from '../../services/roomService'
import Pagination from '../../components/common/Pagination'
import RoomMap from '../../components/staff/RoomMap'
import {
  getBookingStatusColor,
  getBookingStatusText
} from '../../constants/hotelInfo'

const CheckInPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [filterType, setFilterType] = useState('all') // 'all' or 'today'

  // Room selection
  const [selectedRooms, setSelectedRooms] = useState([]) // Thay đổi từ selectedRoom thành selectedRooms array
  const [showRoomMap, setShowRoomMap] = useState(false)
  const [availableRooms, setAvailableRooms] = useState([])
  const [roomDetails, setRoomDetails] = useState(null)


  // Room filters
  const [roomFilters, setRoomFilters] = useState({
    idKp: '',
    idLp: ''
  })

  // Room types data
  const [roomTypes, setRoomTypes] = useState([])
  const [roomCategories, setRoomCategories] = useState([])

  const [checkInData, setCheckInData] = useState({
    actualCheckIn: ''
  })

  useEffect(() => {
    fetchConfirmedReservations()
    fetchRoomTypes()
    fetchRoomCategories()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reservations, searchTerm, filterType])

  const fetchConfirmedReservations = async () => {
    try {
      setLoading(true)
      // Lấy danh sách phiếu đặt đã xác nhận nhưng chưa check-in (chưa có phiếu thuê)
      const response = await bookingService.getConfirmedBookings()
      const reservationData = response.phieuDatList || []

      // Backend đã filter: chỉ lấy phiếu đặt "Xác nhận" và chưa có phiếu thuê tương ứng
      const confirmedReservations = reservationData

      // Transform data to match frontend format
      const transformedData = confirmedReservations.map(booking => ({
        id: booking.idPd,
        maPhieuThue: `PD${booking.idPd}`,
        customerName: booking.hoTenKhachHang || 'N/A',
        customerPhone: booking.sdtKhachHang || 'N/A',
        customerEmail: booking.emailKhachHang || 'N/A',
        cccd: booking.cccd,
        checkIn: booking.ngayBdThue,
        checkOut: booking.ngayDi,
        status: 'confirmed',
        roomNumber: 'TBD', // Will be assigned during check-in
        roomType: 'Standard', // Default value
        kieuPhong: booking.tenKp || 'Chưa xác định',
        loaiPhong: booking.tenLp || 'Chưa xác định',
        soLuongPhongO: booking.soLuongPhongO || 0,
        idKp: booking.idKp,
        idLp: booking.idLp,
        idHangPhong: booking.idHangPhong, // Add this missing field!
        total: booking.soTienCoc || 0,
        employeeId: booking.idNv,
        employeeName: booking.hoTenNhanVien
      }))

      setReservations(transformedData)
      setFilteredReservations(transformedData)
    } catch (error) {
      console.error('Error fetching today reservations:', error)
      setReservations([])
      setFilteredReservations([])
    } finally {
      setLoading(false)
    }
  }

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

  const handleRoomFilterChange = (field, value) => {
    setRoomFilters(prev => ({
      ...prev,
      [field]: value
    }))
    // Fetch rooms with new filters
    if (selectedReservation) {
      fetchAvailableRoomsWithFilters(selectedReservation, {
        ...roomFilters,
        [field]: value
      })
    }
  }



  const fetchAvailableRoomsWithFilters = async (reservation, filters) => {
    try {
      const response = await roomService.getAvailableRoomsByDateRange(
        reservation.checkIn,
        reservation.checkOut,
        filters.idKp || '',
        filters.idLp || ''
      )
      setAvailableRooms(response.phongList || [])
    } catch (error) {
      console.error('Error fetching filtered rooms:', error)
      setAvailableRooms([])
    }
  }

  const handleRoomSelect = (room) => {
    const maxRooms = selectedReservation?.soLuongPhongO || 1

    // Check if room is already selected
    const isSelected = selectedRooms.find(r => r.soPhong === room.soPhong)

    if (isSelected) {
      // Remove room if already selected
      setSelectedRooms(prev => prev.filter(r => r.soPhong !== room.soPhong))
    } else {
      // Add room
      if (selectedRooms.length < maxRooms) {
        setSelectedRooms(prev => [...prev, room])
      } else {
        // Replace oldest room if at max capacity
        setSelectedRooms(prev => [...prev.slice(1), room])
      }
    }
  }

  const handleRemoveRoom = (roomToRemove) => {
    setSelectedRooms(prev => prev.filter(r => r.soPhong !== roomToRemove.soPhong))
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = reservations

    // Apply date filter
    if (filterType === 'today') {
      const today = new Date().toISOString().split('T')[0]
      // Filter reservations that should check in today or are overdue
      filtered = filtered.filter(reservation => {
        if (!reservation.checkIn) return false
        return reservation.checkIn <= today
      })
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.maPhieuThue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.customerPhone.includes(searchTerm)
      )
    }

    setFilteredReservations(filtered)
    setCurrentPage(1)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (type) => {
    setFilterType(type)
  }

  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation)
    setSelectedRooms([]) // Reset room selection
    // Set filters theo kiểu phòng và loại phòng của phiếu đặt
    setRoomFilters({
      idKp: reservation.idKp || '',
      idLp: reservation.idLp || ''
    })

    setCheckInData({
      actualCheckIn: new Date().toISOString().slice(0, 16)
    })
    // Fetch available rooms for this reservation
    fetchAvailableRooms(reservation)
  }

  const fetchAvailableRooms = async (reservation) => {
    try {
      const response = await roomService.getAvailableRoomsByDateRange(
        reservation.checkIn,
        reservation.checkOut,
        reservation.idKp || '', // Use reservation's room type
        reservation.idLp || ''  // Use reservation's room category
      )

      if (response.statusCode === 200) {
        setAvailableRooms(response.phongList || [])
      } else {
        toast.error('Không thể tải danh sách phòng trống')
        setAvailableRooms([])
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách phòng')
      setAvailableRooms([])
    }
  }

  const handleRoomSelectFromMap = (room) => {
    handleRoomSelect(room)
    setRoomDetails(room)
    // Don't close map automatically to allow multiple selections
  }

  const handleCheckInDataChange = (field, value) => {
    setCheckInData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckIn = async () => {
    if (!selectedReservation) {
      toast.error('Vui lòng chọn phiếu đặt')
      return
    }

    if (!selectedReservation.id) {
      toast.error('ID phiếu đặt không hợp lệ')
      return
    }

    if (selectedRooms.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phòng')
      return
    }

    if (selectedRooms.length !== (selectedReservation.soLuongPhongO || 1)) {
      toast.error(`Vui lòng chọn đúng ${selectedReservation.soLuongPhongO || 1} phòng`)
      return
    }

    // Validate room numbers
    const invalidRooms = selectedRooms.filter(room => !room.soPhong)
    if (invalidRooms.length > 0) {
      toast.error('Một số phòng được chọn không có số phòng hợp lệ')
      return
    }

    try {
      setLoading(true)

      // Create check-in payload for multiple rooms
      const ngayDen = checkInData.actualCheckIn ?
        checkInData.actualCheckIn.split('T')[0] :
        new Date().toISOString().split('T')[0]

      const checkInPayload = {
        idPhieuDat: parseInt(selectedReservation.id),
        ngayDen: ngayDen,
        danhSachSoPhong: selectedRooms.map(room => room.soPhong).filter(soPhong => soPhong)
      }



      const response = await rentalService.checkInFromBookingWithMultipleRooms(checkInPayload)

      if (response.statusCode === 200) {
        const roomNumbers = selectedRooms.map(r => r.soPhong).join(', ')
        toast.success(`Check-in thành công cho ${selectedReservation.customerName} vào phòng ${roomNumbers}!`)

        // Update reservation status
        setReservations(prev =>
          prev.map(reservation =>
            reservation.id === selectedReservation.id
              ? { ...reservation, status: 'checkedin', roomNumber: roomNumbers }
              : reservation
          )
        )

        setSelectedReservation(null)
        setSelectedRooms([])
        setCheckInData({
          actualCheckIn: ''
        })

        // Refresh the list
        fetchConfirmedReservations()
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi check-in')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi check-in')
      console.error('Check-in error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Note: Sử dụng functions từ constants/hotelInfo.js
  // Chỉ còn 3 trạng thái: Chờ xác nhận, Xác nhận, Đã hủy

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-in khách hàng</h1>
        <p className="text-gray-600 mt-2">Thực hiện check-in cho khách hàng có đặt phòng đã được xác nhận và chưa check-in</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search and Reservations List */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Danh sách đặt phòng đã xác nhận</h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => handleFilterChange('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'today'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hôm nay
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm theo tên, mã đặt phòng, SĐT..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input"
            />
          </div>

          {/* Reservations List */}
          <div className="space-y-3">
            {(() => {
              const startIndex = (currentPage - 1) * itemsPerPage
              const endIndex = startIndex + itemsPerPage
              const currentReservations = filteredReservations.slice(startIndex, endIndex)

              return currentReservations.length > 0 ? (
                currentReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReservation?.id === reservation.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectReservation(reservation)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{reservation.customerName}</h3>
                        <p className="text-sm text-gray-600">{reservation.maPhieuThue}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBookingStatusColor(reservation.status)}`}>
                        {getBookingStatusText(reservation.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">SĐT:</span> {reservation.customerPhone}
                      </div>
                      <div>
                        <span className="font-medium">Check-in:</span> {reservation.checkIn}
                      </div>
                      <div>
                        <span className="font-medium">Check-out:</span> {reservation.checkOut}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Không tìm thấy đặt phòng nào</p>
                </div>
              )
            })()}
          </div>

          {/* Pagination */}
          {filteredReservations.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>

              {Array.from({ length: Math.ceil(filteredReservations.length / itemsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredReservations.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(filteredReservations.length / itemsPerPage)}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>

        {/* Check-in Form */}
        <div className="card">
          <div className="flex items-center mb-4">
            <UserCheck className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Thông tin check-in</h2>
          </div>

          {selectedReservation ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Tên:</span> {selectedReservation.customerName}</div>
                  <div><span className="font-medium">SĐT:</span> {selectedReservation.customerPhone}</div>
                  <div><span className="font-medium">Email:</span> {selectedReservation.customerEmail}</div>
                  <div><span className="font-medium">Số lượng phòng:</span> {selectedReservation.soLuongPhongO || 1}</div>
                  <div><span className="font-medium">Kiểu phòng:</span> {selectedReservation.kieuPhong || 'Chưa xác định'}</div>
                  <div><span className="font-medium">Loại phòng:</span> {selectedReservation.loaiPhong || 'Chưa xác định'}</div>
                  <div><span className="font-medium">Hạng phòng:</span> {selectedReservation.idHangPhong || 'N/A'}</div>
                  <div className="col-span-2"><span className="font-medium">Số tiền cọc:</span> {selectedReservation.total.toLocaleString('vi-VN')} VNĐ</div>
                </div>
              </div>

              {/* Room Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn phòng ({selectedRooms.length}/{selectedReservation.soLuongPhongO || 1})
                  </label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        // Reset filters to reservation defaults when opening room map
                        setRoomFilters({
                          idKp: selectedReservation.idKp || '',
                          idLp: selectedReservation.idLp || ''
                        })

                        setShowRoomMap(true)
                      }}
                      className="btn-outline flex-1"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedRooms.length > 0 ? `${selectedRooms.length} phòng đã chọn` : 'Chọn phòng'}
                    </button>
                    {selectedRooms.length > 0 && (
                      <button
                        onClick={() => setSelectedRooms([])}
                        className="btn-outline px-3"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Selected Rooms Display */}
                  {selectedRooms.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {selectedRooms.map((room, index) => (
                        <div key={room.soPhong} className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="text-sm">
                              <div><span className="font-medium">Phòng:</span> {room.soPhong}</div>
                              <div><span className="font-medium">Tầng:</span> {room.tang}</div>
                              <div><span className="font-medium">Kiểu phòng:</span> {room.tenKp}</div>
                              <div><span className="font-medium">Loại phòng:</span> {room.tenLp}</div>
                              <div><span className="font-medium">Giá:</span> {room.gia?.toLocaleString('vi-VN')} VNĐ/đêm</div>
                            </div>
                            <button
                              onClick={() => setSelectedRooms(prev => prev.filter(r => r.soPhong !== room.soPhong))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian check-in thực tế
                  </label>
                  <input
                    type="datetime-local"
                    value={checkInData.actualCheckIn}
                    onChange={(e) => handleCheckInDataChange('actualCheckIn', e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedReservation(null)
                    setSelectedRooms([])
                  }}
                  className="btn-outline flex-1"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCheckIn}
                  disabled={loading || !checkInData.actualCheckIn || selectedRooms.length === 0}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Xác nhận check-in
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn đặt phòng để check-in
              </h3>
              <p className="text-gray-500">
                Tìm kiếm và chọn đặt phòng từ danh sách bên trái
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Room Map Modal */}
      {showRoomMap && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Chọn phòng cho check-in</h2>
              <button
                onClick={() => setShowRoomMap(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Room Filters */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lọc phòng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kiểu phòng
                  </label>
                  <select
                    value={roomFilters.idKp}
                    onChange={(e) => handleRoomFilterChange('idKp', e.target.value)}
                    className="input"
                  >
                    <option value="">Tất cả kiểu phòng</option>
                    {roomTypes.map(type => (
                      <option key={type.idKp} value={type.idKp}>
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
                    value={roomFilters.idLp}
                    onChange={(e) => handleRoomFilterChange('idLp', e.target.value)}
                    className="input"
                  >
                    <option value="">Tất cả loại phòng</option>
                    {roomCategories.map(category => (
                      <option key={category.idLp} value={category.idLp}>
                        {category.tenLp} 
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => setRoomFilters({ idKp: '', idLp: '' })}
                  className="btn-secondary"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>

            {/* Room Map */}
            <div className="border rounded-lg p-4">
              <RoomMap
                onRoomSelect={handleRoomSelectFromMap}
                selectedRooms={selectedRooms}
                checkInDate={selectedReservation.checkIn}
                checkOutDate={selectedReservation.checkOut}
                filters={roomFilters}
                maxRooms={selectedReservation.soLuongPhongO || 1}
                multiSelect={true}
              />
            </div>

            {/* Selected Rooms Summary */}
            {selectedRooms.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Phòng đã chọn ({selectedRooms.length}/{selectedReservation.soLuongPhongO || 1})
                </h4>
                <div className="space-y-2 text-sm">
                  {selectedRooms.map(room => (
                    <div key={room.soPhong} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span>Phòng {room.soPhong} - {room.tenKp} - {room.tenLp} - Hạng phòng {room.idHangPhong}</span>
                      <div className="flex items-center space-x-2">
                        <span>{room.gia?.toLocaleString('vi-VN')} VNĐ</span>
                        <button
                          onClick={() => handleRemoveRoom(room)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Xóa phòng"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="flex justify-between font-medium">
                    <span>Tổng tiền phòng:</span>
                    <span>{selectedRooms.reduce((sum, room) => sum + (room.gia || 0), 0).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRoomMap(false)}
                className="btn-primary"
              >
                Xác nhận chọn phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckInPage
