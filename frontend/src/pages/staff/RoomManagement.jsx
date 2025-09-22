import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Building,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Wrench
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'
import { roomService } from '../../services/roomService'

const RoomManagement = () => {
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage] = useState(12)
  const [filters, setFilters] = useState({
    kieuPhong: '',
    loaiPhong: '',
    status: '',
    floor: ''
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomForm, setRoomForm] = useState({
    soPhong: '',
    tang: '',
    hangPhong: { idHp: '' },
    trangThai: { idTt: '' }
  })
  const [roomTypes, setRoomTypes] = useState([])
  const [kieuPhongList, setKieuPhongList] = useState([])
  const [loaiPhongList, setLoaiPhongList] = useState([])
  const [roomStatuses] = useState([
    { id: 'TT001', name: 'Trống' },
    { id: 'TT002', name: 'Đã có khách' },
    { id: 'TT003', name: 'Đang dọn dẹp' },
    { id: 'TT004', name: 'Đang bảo trì' },
    { id: 'TT005', name: 'Đã đặt' },
  ])

  useEffect(() => {
    fetchRooms()
    fetchRoomTypes()
    fetchKieuPhong()
    fetchLoaiPhong()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [rooms, filters])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getAllRooms()
      if (response.statusCode === 200) {
        setRooms(response.phongList || [])
      } else {
        toast.error('Không thể tải danh sách phòng')
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách phòng')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoomTypes = async () => {
    try {
      // Extract unique room types from rooms data
      const response = await roomService.getAllRooms()
      if (response.statusCode === 200) {
        const uniqueTypes = []
        const seenTypes = new Set()

        response.phongList?.forEach(room => {
          if (room.idHangPhong && !seenTypes.has(room.idHangPhong)) {
            seenTypes.add(room.idHangPhong)
            uniqueTypes.push({
              idHp: room.idHangPhong,
              tenHp: `#${room.idHangPhong}`
            })
          }
        })

        setRoomTypes(uniqueTypes)
      }
    } catch (error) {
      console.error('Error fetching room types:', error)
    }
  }

  const fetchKieuPhong = async () => {
    try {
      const response = await roomService.getAllRoomTypes()
      if (response.statusCode === 200) {
        setKieuPhongList(response.kieuPhongList || [])
      }
    } catch (error) {
      console.error('Error fetching kieu phong:', error)
    }
  }

  const fetchLoaiPhong = async () => {
    try {
      const response = await roomService.getAllRoomCategories()
      if (response.statusCode === 200) {
        setLoaiPhongList(response.loaiPhongList || [])
      }
    } catch (error) {
      console.error('Error fetching loai phong:', error)
    }
  }

  const applyFilters = () => {
    let filtered = rooms

    // Lọc theo kiểu phòng
    if (filters.kieuPhong) {
      filtered = filtered.filter(room => room.tenKp === filters.kieuPhong)
    }

    // Lọc theo loại phòng
    if (filters.loaiPhong) {
      filtered = filtered.filter(room => room.tenLp === filters.loaiPhong)
    }

    // Lọc theo trạng thái
    if (filters.status) {
      filtered = filtered.filter(room => room.idTt === filters.status)
    }

    // Lọc theo tầng
    if (filters.floor) {
      filtered = filtered.filter(room => room.tang.toString() === filters.floor)
    }

    setFilteredRooms(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleEditRoom = async (e) => {
    e.preventDefault()
    try {
      // Update room type and category
      const roomData = {
        soPhong: selectedRoom.soPhong,
        tang: selectedRoom.tang,
        idKieuPhong: selectedRoom.idKieuPhong,
        idLoaiPhong: selectedRoom.idLoaiPhong
      }

      const response = await roomService.updateRoomTypeAndCategory(selectedRoom.soPhong, roomData)
      if (response.statusCode === 200) {
        // Update room status if changed
        if (roomForm.trangThai.idTt && roomForm.trangThai.idTt !== selectedRoom.idTt) {
          await roomService.updateRoomStatus(selectedRoom.soPhong, roomForm.trangThai.idTt)
        }

        toast.success('Cập nhật phòng thành công!')
        setShowEditModal(false)
        setSelectedRoom(null)
        fetchRooms()
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi cập nhật phòng')
      }
    } catch (error) {
      console.error('Error updating room:', error)
      toast.error('Có lỗi xảy ra khi cập nhật phòng')
    }
  }

  const openEditModal = (room) => {
    // Set selectedRoom with current values for the form
    setSelectedRoom({
      ...room,
      idKieuPhong: room.idKp || '',
      idLoaiPhong: room.idLp || '',
      idTrangThai: room.idTt || ''
    })
    setRoomForm({
      soPhong: room.soPhong,
      tang: room.tang,
      hangPhong: { idHp: room.idHangPhong },
      trangThai: { idTt: room.idTt }
    })
    setShowEditModal(true)
  }

  const openViewModal = (room) => {
    setSelectedRoom(room)
    setShowViewModal(true)
  }

  const resetForm = () => {
    setRoomForm({
      soPhong: '',
      tang: '',
      hangPhong: { idHp: '' },
      trangThai: { idTt: '' }
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Trống':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'Đã có khách':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'Đang bảo trì':
        return <Wrench className="w-4 h-4 text-orange-500" />
      case 'Đang dọn dẹp':
        return <Clock className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Trống':
        return 'bg-green-100 text-green-800'
      case 'Đã có khách':
        return 'bg-red-100 text-red-800'
      case 'Đang bảo trì':
        return 'bg-orange-100 text-orange-800'
      case 'Đang dọn dẹp':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Pagination
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom)
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage)

  // Get unique floors for filter
  const floors = [...new Set(rooms.map(room => room.tang))].sort((a, b) => a - b)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý phòng</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin phòng khách sạn</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kiểu phòng
            </label>
            <select
              value={filters.kieuPhong}
              onChange={(e) => handleFilterChange('kieuPhong', e.target.value)}
              className="input"
            >
              <option value="">Tất cả kiểu phòng</option>
              {kieuPhongList.map(kieu => (
                <option key={kieu.idKp} value={kieu.tenKp}>
                  {kieu.tenKp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại phòng
            </label>
            <select
              value={filters.loaiPhong}
              onChange={(e) => handleFilterChange('loaiPhong', e.target.value)}
              className="input"
            >
              <option value="">Tất cả loại phòng</option>
              {loaiPhongList.map(loai => (
                <option key={loai.idLp} value={loai.tenLp}>
                  {loai.tenLp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">Tất cả trạng thái</option>
              {roomStatuses.map(status => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tầng
            </label>
            <select
              value={filters.floor}
              onChange={(e) => handleFilterChange('floor', e.target.value)}
              className="input"
            >
              <option value="">Tất cả tầng</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>
                  Tầng {floor}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setFilters({
              kieuPhong: '',
              loaiPhong: '',
              status: '',
              floor: ''
            })}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentRooms.map((room) => (
          <div key={room.soPhong} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Building className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Phòng {room.soPhong}
                </h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openViewModal(room)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(room)}
                  className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tầng:</span>
                <span className="text-sm font-medium">Tầng {room.tang}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Kiểu phòng:</span>
                <span className="text-sm font-medium">{room.tenKp || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loại phòng:</span>
                <span className="text-sm font-medium">{room.tenLp || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <div className="flex items-center">
                  {getStatusIcon(room.tenTrangThai)}
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.tenTrangThai)}`}>
                    {room.tenTrangThai || 'N/A'}
                  </span>
                </div>
              </div>
              {room.giaPhong && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Giá:</span>
                  <span className="text-sm font-medium text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.giaPhong)}
                  </span>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy phòng nào</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          itemsPerPage={roomsPerPage}
          totalItems={filteredRooms.length}
          currentPage={currentPage}
          paginate={setCurrentPage}
        />
      )}


      {/* Edit Room Modal */}
      {showEditModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chỉnh sửa phòng</h2>

            <form onSubmit={handleEditRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số phòng
                </label>
                <input
                  type="text"
                  value={roomForm.soPhong}
                  className="input bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tầng
                </label>
                <input
                  type="number"
                  value={roomForm.tang}
                  className="input bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kiểu phòng <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedRoom?.idKieuPhong || ''}
                  onChange={(e) => setSelectedRoom({...selectedRoom, idKieuPhong: e.target.value})}
                  className="input"
                  required
                >
                  <option value="">Chọn kiểu phòng</option>
                  {kieuPhongList.map(kieu => (
                    <option key={kieu.idKp} value={kieu.idKp}>
                      {kieu.tenKp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại phòng <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedRoom?.idLoaiPhong || ''}
                  onChange={(e) => setSelectedRoom({...selectedRoom, idLoaiPhong: e.target.value})}
                  className="input"
                  required
                >
                  <option value="">Chọn loại phòng</option>
                  {loaiPhongList.map(loai => (
                    <option key={loai.idLp} value={loai.idLp}>
                      {loai.tenLp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  value={roomForm.trangThai.idTt}
                  onChange={(e) => setRoomForm({...roomForm, trangThai: { idTt: e.target.value }})}
                  className="input"
                  required
                >
                  <option value="">Chọn trạng thái</option>
                  {roomStatuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedRoom(null)
                    resetForm()
                  }}
                  className="btn-outline"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Room Modal */}
      {showViewModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chi tiết phòng</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Số phòng:</span>
                <span className="text-sm text-gray-900">{selectedRoom.soPhong}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Tầng:</span>
                <span className="text-sm text-gray-900">Tầng {selectedRoom.tang}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Hạng phòng:</span>
                <span className="text-sm text-gray-900">{selectedRoom.idHangPhong ? `#${selectedRoom.idHangPhong}` : 'N/A'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Kiểu phòng:</span>
                <span className="text-sm text-gray-900">{selectedRoom.tenKp || 'N/A'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Loại phòng:</span>
                <span className="text-sm text-gray-900">{selectedRoom.tenLp || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                <div className="flex items-center">
                  {getStatusIcon(selectedRoom.tenTrangThai)}
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRoom.tenTrangThai)}`}>
                    {selectedRoom.tenTrangThai || 'N/A'}
                  </span>
                </div>
              </div>

              {selectedRoom.giaPhong && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Giá phòng:</span>
                  <span className="text-sm text-green-600 font-medium">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedRoom.giaPhong)}
                  </span>
                </div>
              )}

              {selectedRoom.soLuongKhachO && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Sức chứa:</span>
                  <span className="text-sm text-gray-900">{selectedRoom.soLuongKhachO} người</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setSelectedRoom(null)
                }}
                className="btn-outline"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomManagement
