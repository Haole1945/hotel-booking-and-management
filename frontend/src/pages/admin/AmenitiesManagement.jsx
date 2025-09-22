import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Bath,
  Utensils,
  Dumbbell,
  Waves,
  Shield,
  Bed,
  Phone,
  Refrigerator,
  Microwave,
  Shirt,
  Snowflake,
  Sun,
  Moon,
  Clock,
  MapPin
} from 'lucide-react'
import { api } from '../../services/api'
import { AMENITY_ICONS, getAmenityIcon, getAmenityLabel, getCategories } from '../../utils/amenityIcons.jsx'
import AmenityIcon from '../../components/common/AmenityIcon.jsx'

const AmenitiesManagement = () => {
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAmenity, setEditingAmenity] = useState(null)
  const [formData, setFormData] = useState({
    idTn: '',
    tenTn: '',
    icon: ''
  })

  // Sử dụng danh sách icons từ utility
  const iconOptions = AMENITY_ICONS

  useEffect(() => {
    fetchAmenities()
  }, [])

  const fetchAmenities = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/tien-nghi/all')
      if (response.data.statusCode === 200) {
        setAmenities(response.data.tienNghiList || [])
      } else {
        toast.error('Không thể tải danh sách tiện ích')
      }
    } catch (error) {
      console.error('Error fetching amenities:', error)
      toast.error('Lỗi khi tải danh sách tiện ích')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Khi tạo mới, không cần kiểm tra idTn vì sẽ auto-generate
    if (!editingAmenity && (!formData.tenTn || !formData.icon)) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    // Khi edit, cần kiểm tra đầy đủ
    if (editingAmenity && (!formData.idTn || !formData.tenTn || !formData.icon)) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      let response
      if (editingAmenity) {
        response = await api.put(`/api/tien-nghi/update/${editingAmenity.idTn}`, formData)
      } else {
        // Khi tạo mới, không gửi idTn để backend tự động tạo
        const { idTn, ...dataToSend } = formData
        console.log('Data to send:', dataToSend)
        response = await api.post('/api/tien-nghi/add', dataToSend)
      }

      if (response.data.statusCode === 200) {
        toast.success(editingAmenity ? 'Cập nhật tiện ích thành công' : 'Thêm tiện ích thành công')
        setShowModal(false)
        setEditingAmenity(null)
        setFormData({ idTn: '', tenTn: '', icon: '' })
        fetchAmenities()
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error saving amenity:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || 'Lỗi khi lưu tiện ích')
    }
  }

  const handleEdit = (amenity) => {
    setEditingAmenity(amenity)
    setFormData({
      idTn: amenity.idTn,
      tenTn: amenity.tenTn,
      icon: amenity.icon
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tiện ích này?')) {
      return
    }

    try {
      const response = await api.delete(`/api/tien-nghi/delete/${id}`)
      if (response.data.statusCode === 200) {
        toast.success('Xóa tiện ích thành công')
        fetchAmenities()
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error deleting amenity:', error)
      toast.error('Lỗi khi xóa tiện ích')
    }
  }

  // Sử dụng utility function
  const getIconComponent = (iconName) => getAmenityIcon(iconName)

  const filteredAmenities = amenities.filter(amenity =>
    amenity.tenTn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    amenity.idTn?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openAddModal = () => {
    setEditingAmenity(null)
    setFormData({ idTn: '', tenTn: '', icon: '' })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tiện ích</h1>
          <p className="text-gray-600">Quản lý các tiện ích của khách sạn</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tiện ích</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm tiện ích..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAmenities.map((amenity) => (
          <div key={amenity.idTn} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <AmenityIcon amenity={amenity} className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold text-gray-900">{amenity.tenTn}</h3>
                  <p className="text-sm text-gray-500">ID: {amenity.idTn}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(amenity)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(amenity.idTn)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAmenities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Không tìm thấy tiện ích nào</div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingAmenity ? 'Chỉnh sửa tiện ích' : 'Thêm tiện ích mới'}
            </h2>

            {!editingAmenity && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">💡 Lưu ý:</span> ID tiện ích sẽ được tự động tạo (TN001, TN002, ...)
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {editingAmenity && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID tiện ích
                  </label>
                  <input
                    type="text"
                    name="idTn"
                    value={formData.idTn}
                    onChange={handleInputChange}
                    disabled={true}
                    className="input bg-gray-100"
                    placeholder="ID sẽ được tự động tạo"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tiện ích
                </label>
                <input
                  type="text"
                  name="tenTn"
                  value={formData.tenTn}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Nhập tên tiện ích"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="">Chọn icon</option>
                  {getCategories().map((category) => (
                    <optgroup key={category.value} label={category.label}>
                      {iconOptions
                        .filter(option => option.category === category.value)
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingAmenity ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmenitiesManagement
