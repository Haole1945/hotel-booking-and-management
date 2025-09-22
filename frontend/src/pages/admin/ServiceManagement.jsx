import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  Plus,
  Edit,
  Trash2,
  Filter,
  Package
} from 'lucide-react'
import { api } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'

const ServiceManagement = () => {
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [servicesPerPage] = useState(12)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    unit: '',
    priceRange: ''
  })

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  // Form states
  const [serviceForm, setServiceForm] = useState({
    tenDv: '',
    moTa: '',
    donViTinh: '',
    gia: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [searchTerm, filters, services])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/services/dich-vu')
      
      if (response.data.statusCode === 200) {
        const serviceData = response.data.dichVuList || []
        setServices(serviceData)
        setFilteredServices(serviceData)
      } else {
        toast.error(response.data.message || 'Lỗi khi tải danh sách dịch vụ')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Lỗi khi tải danh sách dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = services.filter(service => 
      service.tenDv?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.idDv?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.moTa?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filters.unit) {
      filtered = filtered.filter(service => service.donViTinh === filters.unit)
    }

    setFilteredServices(filtered)
  }

  const handleAddService = () => {
    setServiceForm({
      tenDv: '',
      moTa: '',
      donViTinh: '',
      gia: ''
    })
    setShowAddModal(true)
  }

  const handleEditService = (service) => {
    setSelectedService(service)
    setServiceForm({
      tenDv: service.tenDv,
      moTa: service.moTa || '',
      donViTinh: service.donViTinh || '',
      gia: service.giaHienTai || ''
    })
    setShowEditModal(true)
  }

  const handleDeleteService = async (idDv) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        const response = await api.delete(`/api/services/dich-vu/${idDv}`)
        
        if (response.data.statusCode === 200) {
          toast.success('Xóa dịch vụ thành công!')
          fetchServices()
        } else {
          toast.error(response.data.message || 'Xóa dịch vụ thất bại')
        }
      } catch (error) {
        console.error('Error deleting service:', error)
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa dịch vụ')
      }
    }
  }

  const handleSaveService = async (e) => {
    e.preventDefault()

    if (!serviceForm.tenDv || !serviceForm.donViTinh || !serviceForm.gia) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      if (showEditModal) {
        const response = await api.put(`/api/services/dich-vu/${selectedService.idDv}`, serviceForm)

        if (response.data.statusCode === 200) {
          toast.success('Cập nhật dịch vụ thành công!')
          setShowEditModal(false)
          setSelectedService(null)
          fetchServices()
        } else {
          toast.error(response.data.message || 'Cập nhật dịch vụ thất bại')
        }
      } else {
        // Khi thêm mới, không gửi idDv - để backend tự tạo
        const response = await api.post('/api/services/dich-vu', serviceForm)

        if (response.data.statusCode === 200) {
          toast.success('Thêm dịch vụ thành công!')
          setShowAddModal(false)
          setServiceForm({
            tenDv: '',
            moTa: '',
            donViTinh: '',
            gia: ''
          })
          fetchServices()
        } else {
          toast.error(response.data.message || 'Thêm dịch vụ thất bại')
        }
      }
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu dịch vụ')
    }
  }

  // Pagination
  const indexOfLastService = currentPage * servicesPerPage
  const indexOfFirstService = indexOfLastService - servicesPerPage
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService)
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý dịch vụ</h1>
          <p className="text-gray-600 mt-2">Quản lý dịch vụ khách sạn</p>
        </div>
        <button
          onClick={handleAddService}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dịch vụ mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm và lọc</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên dịch vụ, ID, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn vị tính
            </label>
            <select
              value={filters.unit}
              onChange={(e) => setFilters(prev => ({ ...prev, unit: e.target.value }))}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="Lần">Lần</option>
              <option value="Giờ">Giờ</option>
              <option value="Ngày">Ngày</option>
              <option value="Phần">Phần</option>
              <option value="Suất">Suất</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="input"
            >
              <option value="">Tất cả</option>
              <option value="0-100000">Dưới 100K</option>
              <option value="100000-500000">100K - 500K</option>
              <option value="500000-1000000">500K - 1M</option>
              <option value="1000000-">Trên 1M</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách dịch vụ ({filteredServices.length})
          </h2>
        </div>

        {filteredServices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentServices.map((service, index) => (
                <div key={service.idDv || index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {service.tenDv}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ID: {service.idDv}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.moTa || 'Không có mô tả'}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Đơn vị tính:</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {service.donViTinh}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giá hiện tại:</span>
                      <span className="font-semibold text-gray-900">
                        {service.giaHienTai ? formatCurrency(service.giaHienTai) : 'Chưa có giá'}
                      </span>
                    </div>
                    {service.ngayApDungGia && (
                      <div className="flex justify-between">
                        <span>Ngày áp dụng:</span>
                        <span>{new Date(service.ngayApDungGia).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="flex-1 text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.idDv)}
                      className="flex-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dịch vụ nào</h3>
            <p className="text-gray-600 mb-4">Bắt đầu bằng cách thêm dịch vụ đầu tiên</p>
            <button
              onClick={handleAddService}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm dịch vụ mới
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {showEditModal ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                    setSelectedService(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4">
                {showEditModal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID dịch vụ
                    </label>
                    <input
                      type="text"
                      value={selectedService?.idDv || ''}
                      className="input bg-gray-100"
                      disabled
                      placeholder="ID sẽ được tự động tạo"
                    />
                    <p className="text-xs text-gray-500 mt-1">ID không thể thay đổi</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên dịch vụ
                  </label>
                  <input
                    type="text"
                    value={serviceForm.tenDv}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, tenDv: e.target.value }))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={serviceForm.moTa}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, moTa: e.target.value }))}
                    className="input min-h-[80px]"
                    placeholder="Mô tả chi tiết về dịch vụ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn vị tính
                  </label>
                  <select
                    value={serviceForm.donViTinh}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, donViTinh: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Chọn đơn vị tính</option>
                    <option value="Lần">Lần</option>
                    <option value="Giờ">Giờ</option>
                    <option value="Ngày">Ngày</option>
                    <option value="Phần">Phần</option>
                    <option value="Suất">Suất</option>
                    <option value="Chai">Chai</option>
                    <option value="Ly">Ly</option>
                    <option value="Kg">Kg</option>
                    <option value="Gói">Gói</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá dịch vụ (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={serviceForm.gia}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, gia: e.target.value }))}
                    className="input"
                    placeholder="VD: 100000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedService(null)
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
    </div>
  )
}

export default ServiceManagement
