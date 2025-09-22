import React, { useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Search,
  Users,
  Calendar,
  MapPin,
  User,
  Plus,
  Trash2,
  X,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { rentalManagementService } from '../../services/rentalManagementService'
import { formatDate, formatCurrency } from '../../utils/formatters'
import RoomChangeModal from '../../components/staff/RoomChangeModal'
import doiPhongService from '../../services/doiPhongService'

const RentalManagement = () => {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRentals, setExpandedRentals] = useState(new Set())
  const [roomGuests, setRoomGuests] = useState({}) // {ctId: [guests]}
  const [editingRoom, setEditingRoom] = useState(null) // {rentalId, ctId}
  const [newGuestCCCD, setNewGuestCCCD] = useState('')
  const [showRoomChangeModal, setShowRoomChangeModal] = useState(false)
  const [selectedCtPhieuThue, setSelectedCtPhieuThue] = useState(null)

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      // Chỉ lấy những phiếu thuê với phòng đang có khách (TT002)
      const response = await rentalManagementService.getActiveRentalsWithOccupiedRoomsOnly()

      if (response.statusCode === 200) {
        setRentals(response.phieuThueList || [])
      } else {
        toast.error('Không thể tải danh sách phiếu thuê')
      }
    } catch (error) {
      console.error('Error fetching rentals:', error)
      toast.error('Lỗi khi tải danh sách phiếu thuê')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRentals()
      return
    }

    try {
      setLoading(true)
      const response = await rentalManagementService.searchRentals(searchTerm)
      
      if (response.statusCode === 200) {
        setRentals(response.phieuThueList || [])
      } else {
        toast.error('Không tìm thấy phiếu thuê nào')
      }
    } catch (error) {
      console.error('Error searching rentals:', error)
      toast.error('Lỗi khi tìm kiếm')
    } finally {
      setLoading(false)
    }
  }

  const toggleRentalExpansion = async (rentalId) => {
    const newExpanded = new Set(expandedRentals)
    
    if (newExpanded.has(rentalId)) {
      newExpanded.delete(rentalId)
    } else {
      newExpanded.add(rentalId)
      // Load room details when expanding
      await loadRentalRooms(rentalId)
    }
    
    setExpandedRentals(newExpanded)
  }

  const loadRentalRooms = async (rentalId) => {
    try {
      const response = await rentalManagementService.getRentalDetails(rentalId)
      
      if (response.statusCode === 200 && response.phieuThue) {
        const rental = response.phieuThue
        
        // Load guests for each room (chi tiết phiếu thuê)
        if (rental.chiTietPhieuThue) {
          for (const ct of rental.chiTietPhieuThue) {
            await loadRoomGuests(ct.idCtPt)
          }
        }
      }
    } catch (error) {
      console.error('Error loading rental rooms:', error)
      toast.error('Lỗi khi tải thông tin phòng')
    }
  }

  const loadRoomGuests = async (idCtPt) => {
    try {
      const response = await rentalManagementService.getRoomGuests(idCtPt)
      
      if (response.statusCode === 200) {
        setRoomGuests(prev => ({
          ...prev,
          [idCtPt]: response.guestList || []
        }))
      }
    } catch (error) {
      console.error('Error loading room guests:', error)
      // Set empty array if no guests found
      setRoomGuests(prev => ({
        ...prev,
        [idCtPt]: []
      }))
    }
  }

  const startEditingRoom = (rentalId, ctId) => {
    setEditingRoom({ rentalId, ctId })
    setNewGuestCCCD('')
  }

  const cancelEditingRoom = () => {
    setEditingRoom(null)
    setNewGuestCCCD('')
  }

  const addGuestToRoom = async () => {
    if (!newGuestCCCD.trim()) {
      toast.error('Vui lòng nhập CCCD')
      return
    }

    if (!editingRoom) return

    try {
      const response = await rentalManagementService.addGuestToRoom(
        editingRoom.ctId,
        newGuestCCCD.trim()
      )

      if (response.statusCode === 200) {
        toast.success('Thêm khách thành công')
        await loadRoomGuests(editingRoom.ctId)
        setNewGuestCCCD('')
      } else {
        toast.error(response.message || 'Không thể thêm khách')
      }
    } catch (error) {
      console.error('Error adding guest:', error)
      // Hiển thị thông báo lỗi chi tiết hơn
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error('Lỗi khi thêm khách')
      }
    }
  }

  const removeGuestFromRoom = async (ctId, cccd) => {
    try {
      const response = await rentalManagementService.removeGuestFromRoom(ctId, cccd)

      if (response.statusCode === 200) {
        toast.success('Xóa khách thành công')
        await loadRoomGuests(ctId)
      } else {
        toast.error(response.message || 'Không thể xóa khách')
      }
    } catch (error) {
      console.error('Error removing guest:', error)
      toast.error('Lỗi khi xóa khách')
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'đang thuê':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
      case 'đã hủy':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRoomChange = async (ctPhieuThue) => {
    try {
      // Kiểm tra điều kiện đổi phòng ngay từ đầu để hiển thị cảnh báo
      const response = await doiPhongService.checkRoomChangeEligibility(ctPhieuThue.idCtPt)

      if (response.statusCode === 200 && response.roomChangeEligibility) {
        const eligibility = response.roomChangeEligibility

        if (!eligibility.eligible) {
          // Hiển thị cảnh báo nhưng vẫn cho phép mở modal để xem chi tiết
          const reasons = eligibility.hanChe || []
          const reasonText = reasons.length > 0 ? reasons.join(', ') : eligibility.reason || 'Không đủ điều kiện đổi phòng'
          toast.error(`Cảnh báo: ${reasonText}`)
        }

        // Mở modal trong mọi trường hợp để người dùng xem chi tiết
        setSelectedCtPhieuThue(ctPhieuThue)
        setShowRoomChangeModal(true)
      } else {
        toast.error(response.message || 'Lỗi khi kiểm tra điều kiện đổi phòng')
      }
    } catch (error) {
      console.error('Error checking room change eligibility:', error)
      toast.error('Lỗi khi kiểm tra điều kiện đổi phòng')
    }
  }

  const handleRoomChangeSuccess = () => {
    setShowRoomChangeModal(false)
    setSelectedCtPhieuThue(null)
    fetchRentals() // Reload data
    toast.success('Đổi phòng thành công!')
  }

  const filteredRentals = rentals.filter(rental => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      rental.idPt?.toString().includes(searchTerm) ||
      rental.hoTenKhachHang?.toLowerCase().includes(searchLower) ||
      rental.cccd?.includes(searchTerm)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2">Đang tải...</span>
        </div>
        
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
     
      
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thuê phòng</h1>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã phiếu thuê, tên khách hàng, CCCD..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Rentals List */}
        <div className="space-y-4">
          {filteredRentals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có phiếu thuê nào
            </div>
          ) : (
            filteredRentals.map((rental) => (
              <RentalCard
                key={rental.idPt}
                rental={rental}
                isExpanded={expandedRentals.has(rental.idPt)}
                onToggleExpansion={() => toggleRentalExpansion(rental.idPt)}
                roomGuests={roomGuests}
                editingRoom={editingRoom}
                newGuestCCCD={newGuestCCCD}
                setNewGuestCCCD={setNewGuestCCCD}
                onStartEditing={startEditingRoom}
                onCancelEditing={cancelEditingRoom}
                onAddGuest={addGuestToRoom}
                onRemoveGuest={removeGuestFromRoom}
                onRoomChange={handleRoomChange}
                getStatusColor={getStatusColor}
              />
            ))
          )}
        </div>
      </div>

      {/* Room Change Modal */}
      <RoomChangeModal
        isOpen={showRoomChangeModal}
        onClose={() => setShowRoomChangeModal(false)}
        ctPhieuThue={selectedCtPhieuThue}
        onSuccess={handleRoomChangeSuccess}
      />

    </div>
  )
}

// Component RentalCard
const RentalCard = ({
  rental,
  isExpanded,
  onToggleExpansion,
  roomGuests,
  editingRoom,
  newGuestCCCD,
  setNewGuestCCCD,
  onStartEditing,
  onCancelEditing,
  onAddGuest,
  onRemoveGuest,
  onRoomChange,
  getStatusColor
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Rental Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Phiếu thuê #{rental.idPt}
              </h3>
              <p className="text-sm text-gray-600">
                Khách hàng: {rental.hoTenKhachHang || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(rental.ngayDen)} - {formatDate(rental.ngayDi)}
              </div>
            </div>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.trangThai)}`}>
              {rental.trangThai || 'Đang thuê'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content - Room Details */}
      {isExpanded && (
        <div className="border-t bg-gray-50">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Danh sách phòng ({rental.chiTietPhieuThue?.length || 0} phòng đang có khách)
            </h4>

            <div className="space-y-3">
              {rental.chiTietPhieuThue?.map((ct) => (
                <RoomCard
                  key={ct.idCtPt}
                  ct={ct}
                  rental={rental}
                  guests={roomGuests[ct.idCtPt] || []}
                  isEditing={editingRoom?.rentalId === rental.idPt && editingRoom?.ctId === ct.idCtPt}
                  newGuestCCCD={newGuestCCCD}
                  setNewGuestCCCD={setNewGuestCCCD}
                  onStartEditing={() => onStartEditing(rental.idPt, ct.idCtPt)}
                  onCancelEditing={onCancelEditing}
                  onAddGuest={onAddGuest}
                  onRemoveGuest={(cccd) => onRemoveGuest(ct.idCtPt, cccd)}
                  onRoomChange={onRoomChange}
                />
              )) || (
                <div className="text-center py-4 text-gray-500">
                  Không có thông tin phòng
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Component RoomCard
const RoomCard = ({
  ct,
  rental,
  guests,
  isEditing,
  newGuestCCCD,
  setNewGuestCCCD,
  onStartEditing,
  onCancelEditing,
  onAddGuest,
  onRemoveGuest,
  onRoomChange
}) => {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h5 className="font-medium text-gray-900">Phòng {ct.soPhong}</h5>
          <p className="text-sm text-gray-600">
            {ct.tenKieuPhong} - {ct.tenLoaiPhong}
          </p>
          <p className="text-sm text-gray-600">
            Giá: {formatCurrency(ct.donGia)}/đêm
          </p>
          <p className="text-sm text-gray-600">
            Từ {formatDate(ct.ngayDen)} đến {formatDate(ct.ngayDi)}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {guests.length} khách
            </span>
          </div>
          <button
            onClick={() => onRoomChange(ct)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 border border-blue-200 rounded hover:bg-blue-50"
          >
            <RefreshCw className="w-3 h-3" />
            Đổi phòng
          </button>
        </div>
      </div>

      {/* Guest List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h6 className="text-sm font-medium text-gray-700">Danh sách khách:</h6>
          {!isEditing && (
            <button
              onClick={onStartEditing}
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Quản lý khách
            </button>
          )}
        </div>

        {guests.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Chưa có thông tin khách</p>
        ) : (
          <div className="space-y-1">
            {guests.map((guest, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{guest.cccd}</span>
                  {guest.hoTen && (
                    <span className="text-sm text-gray-600">- {guest.hoTen}</span>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => onRemoveGuest(guest.cccd)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Guest Form */}
        {isEditing && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nhập CCCD khách hàng"
                value={newGuestCCCD}
                onChange={(e) => setNewGuestCCCD(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={onAddGuest}
                className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onCancelEditing}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RentalManagement
