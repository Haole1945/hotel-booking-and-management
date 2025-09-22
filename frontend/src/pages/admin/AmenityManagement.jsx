import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Filter,
  CheckCircle,
  XCircle,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Tv,
  Wind
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'
import { api } from '../../services/api'
import AmenityIcon from '../../components/common/AmenityIcon.jsx'

const AmenityManagement = () => {
  const [amenities, setAmenities] = useState([])
  const [filteredAmenities, setFilteredAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [amenitiesPerPage] = useState(12)
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    status: '',
    type: ''
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAmenity, setSelectedAmenity] = useState(null)
  const [amenityForm, setAmenityForm] = useState({
    tenTienNghi: '',
    moTa: '',
    danhMuc: '',
    loai: '',
    trangThai: 'active',
    icon: '',
    thuTu: ''
  })

  useEffect(() => {
    fetchAmenities()
  }, [])

  const fetchAmenities = async () => {
    try {
      setLoading(true)
      // Gọi API thực tế để lấy danh sách tiện nghi
      const response = await api.get('/api/tien-nghi')
      const amenityData = response.data.tienNghiList || []

      setAmenities(amenityData)
      setFilteredAmenities(amenityData)


    } catch (error) {
      console.error('Error fetching amenities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (currentFilters) => {
    let filtered = [...amenities]

    // Filter by search term
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(amenity =>
        amenity.tenTienNghi.toLowerCase().includes(searchLower) ||
        amenity.moTa.toLowerCase().includes(searchLower) ||
        amenity.danhMuc.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (currentFilters.category) {
      filtered = filtered.filter(amenity => amenity.danhMuc === currentFilters.category)
    }

    // Filter by status
    if (currentFilters.status) {
      filtered = filtered.filter(amenity => amenity.trangThai === currentFilters.status)
    }

    // Filter by type
    if (currentFilters.type) {
      filtered = filtered.filter(amenity => amenity.loai === currentFilters.type)
    }

    setFilteredAmenities(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      status: '',
      type: ''
    })
    setFilteredAmenities(amenities)
    setCurrentPage(1)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-red-600 bg-red-100'
      case 'maintenance': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động'
      case 'inactive': return 'Ngừng hoạt động'
      case 'maintenance': return 'Bảo trì'
      default: return 'Không xác định'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technology': return 'text-blue-600 bg-blue-100'
      case 'Comfort': return 'text-green-600 bg-green-100'
      case 'Entertainment': return 'text-purple-600 bg-purple-100'
      case 'Food & Beverage': return 'text-orange-600 bg-orange-100'
      case 'Transportation': return 'text-indigo-600 bg-indigo-100'
      case 'Wellness': return 'text-pink-600 bg-pink-100'
      case 'Security': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Cơ bản': return 'text-gray-600 bg-gray-100'
      case 'Tiêu chuẩn': return 'text-blue-600 bg-blue-100'
      case 'Cao cấp': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getIconComponent = (iconName) => {
    const iconProps = { className: "w-8 h-8" }
    switch (iconName) {
      case 'Wifi': return <Wifi {...iconProps} />
      case 'Wind': return <Wind {...iconProps} />
      case 'Tv': return <Tv {...iconProps} />
      case 'Coffee': return <Coffee {...iconProps} />
      case 'Car': return <Car {...iconProps} />
      case 'Dumbbell': return <Dumbbell {...iconProps} />
      case 'Star': return <Star {...iconProps} />
      default: return <Star {...iconProps} />
    }
  }

  const handleAddAmenity = () => {
    setAmenityForm({
      tenTienNghi: '',
      moTa: '',
      danhMuc: '',
      loai: '',
      trangThai: 'active',
      icon: 'Star',
      thuTu: ''
    })
    setShowAddModal(true)
  }

  const handleEditAmenity = (amenity) => {
    setSelectedAmenity(amenity)
    setAmenityForm({
      tenTienNghi: amenity.tenTienNghi,
      moTa: amenity.moTa,
      danhMuc: amenity.danhMuc,
      loai: amenity.loai,
      trangThai: amenity.trangThai,
      icon: amenity.icon,
      thuTu: amenity.thuTu.toString()
    })
    setShowEditModal(true)
  }

  const handleViewAmenity = (amenity) => {
    setSelectedAmenity(amenity)
    setShowDetailModal(true)
  }

  const handleDeleteAmenity = async (amenityId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tiện nghi này?')) {
      try {
        // TODO: Call API to delete amenity
        setAmenities(prev => prev.filter(amenity => amenity.id !== amenityId))
        setFilteredAmenities(prev => prev.filter(amenity => amenity.id !== amenityId))
        toast.success('Xóa tiện nghi thành công!')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa tiện nghi')
      }
    }
  }

  const handleSaveAmenity = async (e) => {
    e.preventDefault()
    try {
      if (showEditModal) {
        // TODO: Call API to update amenity
        setAmenities(prev => prev.map(amenity =>
          amenity.id === selectedAmenity.id
            ? {
                ...amenity,
                ...amenityForm,
                thuTu: parseInt(amenityForm.thuTu)
              }
            : amenity
        ))
        toast.success('Cập nhật tiện nghi thành công!')
      } else {
        // TODO: Call API to create amenity
        const newAmenity = {
          id: Date.now(),
          ...amenityForm,
          thuTu: parseInt(amenityForm.thuTu),
          soPhongCo: 0,
          danhGia: 0
        }
        setAmenities(prev => [...prev, newAmenity])
        toast.success('Thêm tiện nghi thành công!')
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedAmenity(null)
      applyFilters(filters)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu tiện nghi')
    }
  }

  // Get current amenities for pagination
  const indexOfLastAmenity = currentPage * amenitiesPerPage
  const indexOfFirstAmenity = indexOfLastAmenity - amenitiesPerPage
  const currentAmenities = filteredAmenities.slice(indexOfFirstAmenity, indexOfLastAmenity)

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tiện nghi</h1>
          <p className="text-gray-600 mt-2">Thêm, sửa, xóa và quản lý tiện nghi phòng khách sạn</p>
        </div>
        <button
          onClick={handleAddAmenity}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm tiện nghi mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tiện nghi</p>
              <p className="text-2xl font-bold text-gray-900">{amenities.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {amenities.filter(a => a.trangThai === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cao cấp</p>
              <p className="text-2xl font-bold text-gray-900">
                {amenities.filter(a => a.loai === 'Cao cấp').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <XCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bảo trì</p>
              <p className="text-2xl font-bold text-gray-900">
                {amenities.filter(a => a.trangThai === 'maintenance').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
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
              placeholder="Tên tiện nghi, mô tả..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="input"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Technology">Technology</option>
              <option value="Comfort">Comfort</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Transportation">Transportation</option>
              <option value="Wellness">Wellness</option>
              <option value="Security">Security</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Tiêu chuẩn">Tiêu chuẩn</option>
              <option value="Cao cấp">Cao cấp</option>
            </select>
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
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
              <option value="maintenance">Bảo trì</option>
            </select>
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

      {/* Amenities Grid */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách tiện nghi ({filteredAmenities.length})
          </h2>
        </div>

        {filteredAmenities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentAmenities.map((amenity) => (
                <div key={amenity.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <AmenityIcon amenity={amenity} className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {amenity.tenTienNghi}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(amenity.loai)}`}>
                          {amenity.loai}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(amenity.trangThai)}`}>
                      {getStatusText(amenity.trangThai)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {amenity.moTa}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Danh mục:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(amenity.danhMuc)}`}>
                        {amenity.danhMuc}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thứ tự:</span>
                      <span className="font-semibold text-gray-900">#{amenity.thuTu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số phòng có:</span>
                      <span>{amenity.soPhongCo} phòng</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Đánh giá:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{amenity.danhGia}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewAmenity(amenity)}
                      className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      Xem
                    </button>
                    <button
                      onClick={() => handleEditAmenity(amenity)}
                      className="flex-1 text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteAmenity(amenity.id)}
                      className="flex-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              itemsPerPage={amenitiesPerPage}
              totalItems={filteredAmenities.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có tiện nghi nào
            </h3>
            <p className="text-gray-500">
              Không tìm thấy tiện nghi nào phù hợp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Amenity Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {showEditModal ? 'Chỉnh sửa tiện nghi' : 'Thêm tiện nghi mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    setSelectedAmenity(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveAmenity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên tiện nghi
                  </label>
                  <input
                    type="text"
                    value={amenityForm.tenTienNghi}
                    onChange={(e) => setAmenityForm(prev => ({ ...prev, tenTienNghi: e.target.value }))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={amenityForm.moTa}
                    onChange={(e) => setAmenityForm(prev => ({ ...prev, moTa: e.target.value }))}
                    className="input min-h-[80px]"
                    placeholder="Mô tả chi tiết về tiện nghi..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={amenityForm.danhMuc}
                      onChange={(e) => setAmenityForm(prev => ({ ...prev, danhMuc: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="Technology">Technology</option>
                      <option value="Comfort">Comfort</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại
                    </label>
                    <select
                      value={amenityForm.loai}
                      onChange={(e) => setAmenityForm(prev => ({ ...prev, loai: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="">Chọn loại</option>
                      <option value="Cơ bản">Cơ bản</option>
                      <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                      <option value="Cao cấp">Cao cấp</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={amenityForm.icon}
                      onChange={(e) => setAmenityForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="Star">Star</option>
                      <option value="Wifi">Wifi</option>
                      <option value="Wind">Wind</option>
                      <option value="Tv">TV</option>
                      <option value="Coffee">Coffee</option>
                      <option value="Car">Car</option>
                      <option value="Dumbbell">Dumbbell</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thứ tự
                    </label>
                    <input
                      type="number"
                      value={amenityForm.thuTu}
                      onChange={(e) => setAmenityForm(prev => ({ ...prev, thuTu: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={amenityForm.trangThai}
                    onChange={(e) => setAmenityForm(prev => ({ ...prev, trangThai: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedAmenity(null)
                    }}
                    className="btn-outline"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {showEditModal ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Amenity Detail Modal */}
      {showDetailModal && selectedAmenity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết tiện nghi
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <AmenityIcon amenity={selectedAmenity} className="w-8 h-8" showTooltip={true} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedAmenity.tenTienNghi}</h2>
                    <div className="flex space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedAmenity.danhMuc)}`}>
                        {selectedAmenity.danhMuc}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedAmenity.loai)}`}>
                        {selectedAmenity.loai}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thứ tự hiển thị</label>
                    <p className="mt-1 text-sm text-gray-900">#{selectedAmenity.thuTu}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedAmenity.trangThai)}`}>
                      {getStatusText(selectedAmenity.trangThai)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số phòng có</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAmenity.soPhongCo} phòng</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Đánh giá</label>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900">{selectedAmenity.danhGia}/5</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAmenity.moTa}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="btn-outline"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleEditAmenity(selectedAmenity)
                  }}
                  className="btn-primary"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmenityManagement
