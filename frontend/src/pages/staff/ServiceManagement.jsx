import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Eye, Plus, Users, Building, Calendar, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import serviceManagementService from '../../services/serviceManagementService'
import authService from '../../services/authService'

const ServiceManagement = () => {
  const [activeTab, setActiveTab] = useState('services')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'add', 'edit', 'view'
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(false)

  // Data states - từ database
  const [services, setServices] = useState([])
  const [surcharges, setSurcharges] = useState([])
  const [currentBookings, setCurrentBookings] = useState([])

  // Stats
  const [stats, setStats] = useState({
    totalAvailableServices: 0,
    totalAvailableSurcharges: 0,
    totalOccupiedRooms: 0,
    totalRevenue: 0
  })

  const [formData, setFormData] = useState({
    idDv: '',
    tenDv: '',
    donViTinh: '',
    gia: '',
    // For surcharges
    idPhuThu: '',
    tenPhuThu: ''
  })

  // Add service/surcharge modal states
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [showAddSurchargeModal, setShowAddSurchargeModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [addServiceForm, setAddServiceForm] = useState({
    idDv: '',
    soLuong: 1
  })
  const [addSurchargeForm, setAddSurchargeForm] = useState({
    idPhuThu: '',
    soLuong: 1
  })

  // Room status modal states
  const [showRoomStatusModal, setShowRoomStatusModal] = useState(false)
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null)

  // Pagination states
  const [currentRoomPage, setCurrentRoomPage] = useState(1)

  const roomsPerPage = 8

  useEffect(() => {
    fetchAllData()
  }, [])

  // Pagination helper functions
  const getPaginatedData = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const getTotalPages = (dataLength, itemsPerPage) => {
    return Math.ceil(dataLength / itemsPerPage)
  }

  const generatePageNumbers = (currentPage, totalPages) => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  // Helper function to update service price
  const updateServicePrice = async (idDv, price) => {
    return await serviceManagementService.updateServicePrice(idDv, price)
  }

  // Helper function to update surcharge price
  const updateSurchargePrice = async (idPhuThu, price) => {
    return await serviceManagementService.updateSurchargePrice(idPhuThu, price)
  }

  // Pagination component
  const PaginationComponent = ({ currentPage, totalPages, onPageChange, className = "" }) => {
    if (totalPages <= 1) return null

    const pageNumbers = generatePageNumbers(currentPage, totalPages)

    return (
      <div className={`flex items-center justify-center space-x-1 mt-4 ${className}`}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Trước
        </button>

        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded-md ${
              currentPage === page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sau
        </button>
      </div>
    )
  }

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Use combined dashboard API to get all active data in one call
      const [dashboardRes, servicesRes, surchargesRes] = await Promise.all([
        serviceManagementService.getDashboardData(),
        serviceManagementService.getAllDichVu(),
        serviceManagementService.getAllPhuThu()
      ])

      // Set basic services and surcharges for management tabs
      if (servicesRes.statusCode === 200) {
        setServices(servicesRes.dichVuList || [])
      }

      if (surchargesRes.statusCode === 200) {
        setSurcharges(surchargesRes.phuThuList || [])
      }

      // Set active data from dashboard API
      if (dashboardRes.statusCode === 200) {
        setCurrentBookings(dashboardRes.ctPhieuThueList || [])

        // Calculate stats - now showing available services/surcharges and occupied rooms
        const totalAvailableServices = servicesRes.dichVuList?.length || 0
        const totalAvailableSurcharges = surchargesRes.phuThuList?.length || 0
        // Count occupied rooms from ctPhieuThueList (all rooms with TT002 status, regardless of checkout date)
        const totalOccupiedRooms = dashboardRes.ctPhieuThueList?.length || 0

        setStats({
          totalAvailableServices,
          totalAvailableSurcharges,
          totalOccupiedRooms
        })
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }



  // Handlers
  const handleView = (service) => {
    setSelectedService(service)
    setModalType('view')
    setShowModal(true)
  }

  const handleEdit = (service) => {
    setSelectedService(service)
    setFormData({
      idDv: service.idDv,
      tenDv: service.tenDv,
      donViTinh: service.donViTinh,
      gia: service.donGia
    })
    setModalType('edit')
    setShowModal(true)
  }

  const handleDelete = async (item) => {
    if (activeTab === 'services') {
      if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${item.tenDv}"?`)) {
        try {
          const response = await serviceManagementService.deleteDichVu(item.idDv)
          if (response.statusCode === 200) {
            setServices(services.filter(s => s.idDv !== item.idDv))
            toast.success('Xóa dịch vụ thành công!')
          } else {
            toast.error(response.message || 'Lỗi khi xóa dịch vụ')
          }
        } catch (error) {
          console.error('Error deleting service:', error)
          toast.error('Lỗi khi xóa dịch vụ')
        }
      }
    } else {
      if (window.confirm(`Bạn có chắc chắn muốn xóa phụ thu "${item.tenPhuThu}"?`)) {
        try {
          const response = await serviceManagementService.deletePhuThu(item.idPhuThu)
          if (response.statusCode === 200) {
            setSurcharges(surcharges.filter(s => s.idPhuThu !== item.idPhuThu))
            toast.success('Xóa phụ thu thành công!')
          } else {
            toast.error(response.message || 'Lỗi khi xóa phụ thu')
          }
        } catch (error) {
          console.error('Error deleting surcharge:', error)
          toast.error('Lỗi khi xóa phụ thu')
        }
      }
    }
  }

  // Handler functions for room actions
  const handleAddService = (booking) => {
    setSelectedBooking(booking)
    setAddServiceForm({
      idDv: '',
      soLuong: 1
    })
    setShowAddServiceModal(true)
  }

  const handleAddSurcharge = (booking) => {
    setSelectedBooking(booking)
    setAddSurchargeForm({
      idPhuThu: '',
      soLuong: 1
    })
    setShowAddSurchargeModal(true)
  }

  // Handle add service submission
  const handleSubmitAddService = async (e) => {
    e.preventDefault()
    try {
      if (!addServiceForm.idDv || addServiceForm.soLuong <= 0) {
        toast.error('Vui lòng chọn dịch vụ và nhập số lượng hợp lệ')
        return
      }

      const response = await serviceManagementService.addServiceToBooking(
        selectedBooking.idCtPt,
        addServiceForm.idDv,
        addServiceForm.soLuong
      )

      if (response.statusCode === 200) {
        toast.success('Thêm dịch vụ thành công!')
        setShowAddServiceModal(false)
        setSelectedBooking(null)
        fetchAllData() // Refresh data
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi thêm dịch vụ')
      }
    } catch (error) {
      console.error('Error adding service:', error)
      toast.error('Có lỗi xảy ra khi thêm dịch vụ')
    }
  }

  // Handle add surcharge submission
  const handleSubmitAddSurcharge = async (e) => {
    e.preventDefault()
    try {
      if (!addSurchargeForm.idPhuThu || addSurchargeForm.soLuong <= 0) {
        toast.error('Vui lòng chọn phụ thu và nhập số lượng hợp lệ')
        return
      }

      const response = await serviceManagementService.addSurchargeToBooking(
        selectedBooking.idCtPt,
        addSurchargeForm.idPhuThu,
        addSurchargeForm.soLuong
      )

      if (response.statusCode === 200) {
        toast.success('Thêm phụ thu thành công!')
        setShowAddSurchargeModal(false)
        setSelectedBooking(null)
        fetchAllData() // Refresh data
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi thêm phụ thu')
      }
    } catch (error) {
      console.error('Error adding surcharge:', error)
      toast.error('Có lỗi xảy ra khi thêm phụ thu')
    }
  }

  const handleViewRoomStatus = (booking) => {
    setSelectedRoomDetails(booking)
    setShowRoomStatusModal(true)
  }



  // Handle delete service/surcharge
  const handleDeleteService = async (idCtPt, idDv) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      return
    }

    try {
      const response = await serviceManagementService.deleteServiceFromBooking(idCtPt, idDv)

      if (response.statusCode === 200) {
        toast.success('Xóa dịch vụ thành công!')

        // Update local state immediately
        if (selectedRoomDetails && selectedRoomDetails.danhSachDichVu) {
          const updatedRoomDetails = {
            ...selectedRoomDetails,
            danhSachDichVu: selectedRoomDetails.danhSachDichVu.filter(service =>
              !(service.idCtPt === idCtPt && service.idDv === idDv))
          }
          setSelectedRoomDetails(updatedRoomDetails)
        }

        fetchAllData() // Refresh data
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi xóa dịch vụ')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Có lỗi xảy ra khi xóa dịch vụ')
    }
  }

  const handleDeleteSurcharge = async (idPhuThu, idCtPt) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phụ thu này?')) {
      return
    }

    try {
      const response = await serviceManagementService.deleteSurchargeFromBooking(idPhuThu, idCtPt)

      if (response.statusCode === 200) {
        toast.success('Xóa phụ thu thành công!')

        // Update local state immediately
        if (selectedRoomDetails && selectedRoomDetails.danhSachPhuThu) {
          const updatedRoomDetails = {
            ...selectedRoomDetails,
            danhSachPhuThu: selectedRoomDetails.danhSachPhuThu.filter(surcharge =>
              !(surcharge.idPhuThu === idPhuThu && surcharge.idCtPt === idCtPt))
          }
          setSelectedRoomDetails(updatedRoomDetails)
        }

        fetchAllData() // Refresh data
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi xóa phụ thu')
      }
    } catch (error) {
      console.error('Error deleting surcharge:', error)
      toast.error('Có lỗi xảy ra khi xóa phụ thu')
    }
  }

  // Handle payment status update
  const handleUpdatePaymentStatus = async (type, id, newStatus, idDv = null, idPhuThu = null) => {
    try {
      let response

      if (type === 'service') {
        // For service, id is idCtPt and we need idDv as well
        response = await serviceManagementService.updateServicePaymentStatus(id, idDv, newStatus)
      } else if (type === 'surcharge') {
        // For surcharge, idPhuThu and id (idCtPt) are needed
        response = await serviceManagementService.updateSurchargePaymentStatus(idPhuThu, id, newStatus)
      } else if (type === 'room') {
        response = await serviceManagementService.updateRoomPaymentStatus(id, newStatus)
      }

      if (response && response.statusCode === 200) {
        toast.success('Cập nhật trạng thái thanh toán thành công!')

        // Update local state immediately for better UX
        if (selectedRoomDetails) {
          const updatedRoomDetails = { ...selectedRoomDetails }

          if (type === 'service' && updatedRoomDetails.danhSachDichVu) {
            updatedRoomDetails.danhSachDichVu = updatedRoomDetails.danhSachDichVu.map(service =>
              (service.idCtPt === id && service.idDv === idDv) ? { ...service, ttThanhToan: newStatus } : service
            )
          } else if (type === 'surcharge' && updatedRoomDetails.danhSachPhuThu) {
            updatedRoomDetails.danhSachPhuThu = updatedRoomDetails.danhSachPhuThu.map(surcharge =>
              (surcharge.idPhuThu === idPhuThu && surcharge.idCtPt === id) ? { ...surcharge, ttThanhToan: newStatus } : surcharge
            )
          } else if (type === 'room') {
            updatedRoomDetails.ttThanhToan = newStatus
          }

          setSelectedRoomDetails(updatedRoomDetails)
        }

        fetchAllData() // Refresh data
      } else {
        toast.error(response?.message || 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán')
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái thanh toán')
    }
  }

  // Calculate total amount for a booking (services + surcharges only, room price calculated at checkout)
  const calculateTotalAmount = (booking) => {
    let total = 0

    // Add services (only unpaid ones)
    if (booking.danhSachDichVu) {
      booking.danhSachDichVu.forEach(service => {
        if (service.ttThanhToan !== 'Đã thanh toán') {
          total += (service.donGia || 0) * (service.soLuong || 0)
        }
      })
    }

    // Add surcharges (only unpaid ones)
    if (booking.danhSachPhuThu) {
      booking.danhSachPhuThu.forEach(surcharge => {
        if (surcharge.ttThanhToan !== 'Đã thanh toán') {
          total += (surcharge.donGia || 0) * (surcharge.soLuong || 0)
        }
      })
    }

    return total
  }

  // Calculate room total (room price * number of days)
  const calculateRoomTotal = (booking) => {
    if (!booking.ngayDen || !booking.ngayDi || !booking.donGia) return 0

    const checkIn = new Date(booking.ngayDen)
    const checkOut = new Date(booking.ngayDi)
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

    return booking.donGia * Math.max(1, days) // At least 1 day
  }

  // Surcharge handlers
  const handleViewSurcharge = (surcharge) => {
    setSelectedService(surcharge)
    setModalType('view')
    setShowModal(true)
  }

  const handleEditSurcharge = (surcharge) => {
    setSelectedService(surcharge)
    setFormData({
      idDv: '',
      tenDv: '',
      donViTinh: '',
      gia: surcharge.gia,
      idPhuThu: surcharge.idPhuThu,
      tenPhuThu: surcharge.tenPhuThu
    })
    setModalType('edit')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (activeTab === 'services') {
      if (modalType === 'add') {
        try {
          const newService = {
            idDv: formData.idDv,
            tenDv: formData.tenDv,
            donViTinh: formData.donViTinh
          }

          const response = await serviceManagementService.createDichVu(newService)

          // If service created successfully and price provided, update the price
          if (response.statusCode === 200 && formData.gia && parseFloat(formData.gia) > 0) {
            try {
              await updateServicePrice(formData.idDv, parseFloat(formData.gia))
            } catch (priceError) {
              console.error('Error updating price:', priceError)
              // Continue even if price update fails
            }
          }
          if (response.statusCode === 200) {
            // Refresh services list
            const servicesRes = await serviceManagementService.getAllDichVu()
            if (servicesRes.statusCode === 200) {
              setServices(servicesRes.dichVuList || [])
            }
            toast.success('Thêm dịch vụ thành công!')
          } else {
            toast.error(response.message || 'Lỗi khi thêm dịch vụ')
            return
          }
        } catch (error) {
          console.error('Error creating service:', error)
          toast.error('Lỗi khi thêm dịch vụ')
          return
        }
      } else if (modalType === 'edit') {
        try {
          const currentUser = authService.getCurrentUser()
          const updatedService = {
            idDv: formData.idDv,
            tenDv: formData.tenDv,
            donViTinh: formData.donViTinh,
            gia: formData.gia,
            idNv: currentUser?.idNv || currentUser?.id || null
          }

          const response = await serviceManagementService.updateDichVu(selectedService.idDv, updatedService)
          if (response.statusCode === 200) {
            // Refresh services list
            const servicesRes = await serviceManagementService.getAllDichVu()
            if (servicesRes.statusCode === 200) {
              setServices(servicesRes.dichVuList || [])
            }
            toast.success('Cập nhật dịch vụ thành công!')
          } else {
            toast.error(response.message || 'Lỗi khi cập nhật dịch vụ')
            return
          }
        } catch (error) {
          console.error('Error updating service:', error)
          toast.error('Lỗi khi cập nhật dịch vụ')
          return
        }
      }
    } else {
      // Handle surcharges
      if (modalType === 'add') {
        try {
          const newSurcharge = {
            idPhuThu: formData.idPhuThu,
            tenPhuThu: formData.tenPhuThu
          }

          const response = await serviceManagementService.createPhuThu(newSurcharge)

          // If surcharge created successfully and price provided, update the price
          if (response.statusCode === 200 && formData.gia && parseFloat(formData.gia) > 0) {
            try {
              await updateSurchargePrice(formData.idPhuThu, parseFloat(formData.gia))
            } catch (priceError) {
              console.error('Error updating price:', priceError)
              // Continue even if price update fails
            }
          }
          if (response.statusCode === 200) {
            // Refresh surcharges list
            const surchargesRes = await serviceManagementService.getAllPhuThu()
            if (surchargesRes.statusCode === 200) {
              setSurcharges(surchargesRes.phuThuList || [])
            }
            toast.success('Thêm phụ thu thành công!')
          } else {
            toast.error(response.message || 'Lỗi khi thêm phụ thu')
            return
          }
        } catch (error) {
          console.error('Error creating surcharge:', error)
          toast.error('Lỗi khi thêm phụ thu')
          return
        }
      } else if (modalType === 'edit') {
        try {
          const currentUser = authService.getCurrentUser()
          const updatedSurcharge = {
            idPhuThu: formData.idPhuThu,
            tenPhuThu: formData.tenPhuThu,
            gia: formData.gia,
            idNv: currentUser?.idNv || currentUser?.id || null
          }

          const response = await serviceManagementService.updatePhuThu(selectedService.idPhuThu, updatedSurcharge)
          if (response.statusCode === 200) {
            // Refresh surcharges list
            const surchargesRes = await serviceManagementService.getAllPhuThu()
            if (surchargesRes.statusCode === 200) {
              setSurcharges(surchargesRes.phuThuList || [])
            }
            toast.success('Cập nhật phụ thu thành công!')
          } else {
            toast.error(response.message || 'Lỗi khi cập nhật phụ thu')
            return
          }
        } catch (error) {
          console.error('Error updating surcharge:', error)
          toast.error('Lỗi khi cập nhật phụ thu')
          return
        }
      }
    }

    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      idDv: '',
      tenDv: '',
      donViTinh: '',
      gia: '',
      idPhuThu: '',
      tenPhuThu: ''
    })
    setSelectedService(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý Dịch vụ & Phụ thu
        </h1>
        <p className="text-gray-600">
          Theo dõi việc sử dụng dịch vụ và phụ thu của các phiếu thuê đang hoạt động
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Dịch vụ khả dụng"
          value={stats.totalAvailableServices}
          icon={Users}
          color="bg-blue-500"
        />
        <StatsCard
          title="Phụ thu khả dụng"
          value={stats.totalAvailableSurcharges}
          icon={Plus}
          color="bg-green-500"
        />
        <StatsCard
          title="Phòng đang được sử dụng"
          value={stats.totalOccupiedRooms}
          icon={Building}
          color="bg-purple-500"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dịch vụ
            </button>
            <button
              onClick={() => setActiveTab('surcharges')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'surcharges'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Phụ thu
            </button>
          </nav>
        </div>

        <div className="p-6">


          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Danh sách Dịch vụ</h3>      
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã dịch vụ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên dịch vụ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn vị tính
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá hiện tại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày áp dụng
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.idDv} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.idDv}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.tenDv}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.donViTinh}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {service.giaHienTai ? formatCurrency(service.giaHienTai) : 'Chưa có giá'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.ngayApDungGia ? formatDate(service.ngayApDungGia) : 'Chưa có'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleView(service)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(service)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(service)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Surcharges Tab */}
          {activeTab === 'surcharges' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Danh sách Phụ thu</h3>          
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã phụ thu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên phụ thu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá hiện tại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày áp dụng
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {surcharges.map((surcharge) => (
                      <tr key={surcharge.idPhuThu} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {surcharge.idPhuThu}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {surcharge.tenPhuThu}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {surcharge.giaHienTai ? formatCurrency(surcharge.giaHienTai) : 'Chưa có giá'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {surcharge.ngayApDungGia ? formatDate(surcharge.ngayApDungGia) : 'Chưa có'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewSurcharge(surcharge)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditSurcharge(surcharge)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(surcharge)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bảng phòng đang được sử dụng */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Phòng đang được sử dụng</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentBookings.length > 0 ? (
              getPaginatedData(currentBookings, currentRoomPage, roomsPerPage).map((booking) => (
                <div key={booking.idCtPt} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Room Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Phòng {booking.soPhong}</h3>
                        <p className="text-sm text-gray-500">Tầng {booking.tang}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.ttThanhToan === 'Đã thanh toán'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.ttThanhToan}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">{booking.tenKieuPhong}</p>
                      <p className="text-sm text-gray-500">{booking.tenLoaiPhong}</p>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Phiếu thuê:</span>
                        <span className="font-medium">#{booking.idPt}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Khách hàng:</span>
                        <span className="font-medium">{booking.tenKhachHang}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Check-in:</span>
                        <span className="font-medium">{formatDate(booking.ngayDen)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Check-out dự kiến:</span>
                        <span className="font-medium">{formatDate(booking.ngayDi)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tổng tiền:</span>
                        <span className="font-bold text-blue-600">{formatCurrency(calculateTotalAmount(booking))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddService(booking)}
                        className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        + Dịch vụ
                      </button>
                      <button
                        onClick={() => handleAddSurcharge(booking)}
                        className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        + Phụ thu
                      </button>
                    </div>
                    <button
                      onClick={() => handleViewRoomStatus(booking)}
                      className="w-full mt-2 bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors"
                    >
                      Xem tình trạng phòng
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">Không có phòng nào đang được sử dụng</p>
              </div>
            )}
          </div>

          {/* Pagination for rooms */}
          {currentBookings.length > 0 && (
            <PaginationComponent
              currentPage={currentRoomPage}
              totalPages={getTotalPages(currentBookings.length, roomsPerPage)}
              onPageChange={setCurrentRoomPage}
              className="mt-6"
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === 'view' && (activeTab === 'services' ? 'Chi tiết dịch vụ' : 'Chi tiết phụ thu')}
                {modalType === 'add' && (activeTab === 'services' ? 'Thêm dịch vụ mới' : 'Thêm phụ thu mới')}
                {modalType === 'edit' && (activeTab === 'services' ? 'Chỉnh sửa dịch vụ' : 'Chỉnh sửa phụ thu')}
              </h3>

              {modalType === 'view' ? (
                <div className="space-y-3">
                  {activeTab === 'services' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mã dịch vụ</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedService?.idDv}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedService?.tenDv}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Đơn vị tính</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedService?.donViTinh}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Giá hiện tại</label>
                        <p className="mt-1 text-sm text-gray-900 font-medium">
                          {selectedService?.giaHienTai ? formatCurrency(selectedService.giaHienTai) : 'Chưa có giá'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày áp dụng</label>
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedService?.ngayApDungGia ? formatDate(selectedService.ngayApDungGia) : 'Chưa có'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mã phụ thu</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedService?.idPhuThu}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tên phụ thu</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedService?.tenPhuThu}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Giá hiện tại</label>
                        <p className="mt-1 text-sm text-gray-900 font-medium">
                          {selectedService?.giaHienTai ? formatCurrency(selectedService.giaHienTai) : 'Chưa có giá'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày áp dụng</label>
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedService?.ngayApDungGia ? formatDate(selectedService.ngayApDungGia) : 'Chưa có'}
                        </p>
                      </div>
                    </>
                  )}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTab === 'services' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mã dịch vụ
                        </label>
                        <input
                          type="text"
                          value={formData.idDv}
                          onChange={(e) => setFormData({ ...formData, idDv: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={modalType === 'edit'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên dịch vụ
                        </label>
                        <input
                          type="text"
                          value={formData.tenDv}
                          onChange={(e) => setFormData({ ...formData, tenDv: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Đơn vị tính
                        </label>
                        <input
                          type="text"
                          value={formData.donViTinh}
                          onChange={(e) => setFormData({ ...formData, donViTinh: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá dịch vụ (VND)
                        </label>
                        <input
                          type="number"
                          value={formData.gia}
                          onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min="0"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mã phụ thu
                        </label>
                        <input
                          type="text"
                          value={formData.idPhuThu}
                          onChange={(e) => setFormData({ ...formData, idPhuThu: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={modalType === 'edit'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên phụ thu
                        </label>
                        <input
                          type="text"
                          value={formData.tenPhuThu}
                          onChange={(e) => setFormData({ ...formData, tenPhuThu: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá phụ thu (VND)
                        </label>
                        <input
                          type="number"
                          value={formData.gia}
                          onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          min="0"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      {modalType === 'add' ? 'Thêm mới' : 'Cập nhật'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thêm dịch vụ cho phòng {selectedBooking?.soPhong}
              </h3>
              <form onSubmit={handleSubmitAddService}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dịch vụ
                  </label>
                  <select
                    value={addServiceForm.idDv}
                    onChange={(e) => setAddServiceForm({...addServiceForm, idDv: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn dịch vụ</option>
                    {services.map(service => (
                      <option key={service.idDv} value={service.idDv}>
                        {service.tenDv} ({service.donViTinh})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={addServiceForm.soLuong}
                    onChange={(e) => setAddServiceForm({...addServiceForm, soLuong: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>



                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Thêm dịch vụ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Surcharge Modal */}
      {showAddSurchargeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thêm phụ thu cho phòng {selectedBooking?.soPhong}
              </h3>
              <form onSubmit={handleSubmitAddSurcharge}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phụ thu
                  </label>
                  <select
                    value={addSurchargeForm.idPhuThu}
                    onChange={(e) => setAddSurchargeForm({...addSurchargeForm, idPhuThu: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn phụ thu</option>
                    {surcharges.map(surcharge => (
                      <option key={surcharge.idPhuThu} value={surcharge.idPhuThu}>
                        {surcharge.tenPhuThu}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={addSurchargeForm.soLuong}
                    onChange={(e) => setAddSurchargeForm({...addSurchargeForm, soLuong: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddSurchargeModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                  >
                    Thêm phụ thu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Room Status Modal */}
      {showRoomStatusModal && selectedRoomDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Tình trạng phòng {selectedRoomDetails.soPhong}
                </h3>
                <button
                  onClick={() => setShowRoomStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Room Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin phòng</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số phòng:</span>
                      <span className="font-medium">{selectedRoomDetails.soPhong}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tầng:</span>
                      <span className="font-medium">{selectedRoomDetails.tang}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kiểu phòng:</span>
                      <span className="font-medium">{selectedRoomDetails.tenKieuPhong}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại phòng:</span>
                      <span className="font-medium">{selectedRoomDetails.tenLoaiPhong}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khách hàng:</span>
                      <span className="font-medium">{selectedRoomDetails.tenKhachHang}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{formatDate(selectedRoomDetails.ngayDen)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out dự kiến:</span>
                      <span className="font-medium">{formatDate(selectedRoomDetails.ngayDi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá phòng/đêm:</span>
                      <span className="font-medium">{formatCurrency(selectedRoomDetails.donGia)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền phòng:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(calculateRoomTotal(selectedRoomDetails))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trạng thái thanh toán phòng:</span>
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedRoomDetails.ttThanhToan}
                          onChange={(e) => handleUpdatePaymentStatus('room', selectedRoomDetails.idCtPt, e.target.value)}
                          className={`px-3 py-1 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            selectedRoomDetails.ttThanhToan === 'Đã thanh toán'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          }`}
                        >
                          <option value="Chưa thanh toán">Chưa thanh toán</option>
                          <option value="Đã thanh toán">Đã thanh toán</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services and Surcharges */}
                <div className="space-y-4">
                  {/* Services */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 mb-3">Dịch vụ đang sử dụng</h4>
                    {selectedRoomDetails.danhSachDichVu && selectedRoomDetails.danhSachDichVu.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRoomDetails.danhSachDichVu.map((service, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{service.tenDv}</p>
                                <p className="text-sm text-gray-500">
                                  {service.soLuong} {service.donViTinh} × {formatCurrency(service.donGia)}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <p className="font-bold text-blue-600">
                                  {formatCurrency(service.donGia * service.soLuong)}
                                </p>
                                {service.ttThanhToan !== 'Đã thanh toán' && (
                                  <button
                                    onClick={() => handleDeleteService(service.idCtPt, service.idDv)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="Xóa dịch vụ"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Trạng thái:</span>
                              <select
                                value={service.ttThanhToan}
                                onChange={(e) => handleUpdatePaymentStatus('service', service.idCtPt, e.target.value, service.idDv)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="Chưa thanh toán">Chưa thanh toán</option>
                                <option value="Đã thanh toán">Đã thanh toán</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Không có dịch vụ nào</p>
                    )}
                  </div>

                  {/* Surcharges */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 mb-3">Phụ thu đang áp dụng</h4>
                    {selectedRoomDetails.danhSachPhuThu && selectedRoomDetails.danhSachPhuThu.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRoomDetails.danhSachPhuThu.map((surcharge, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{surcharge.tenPhuThu}</p>
                                <p className="text-sm text-gray-500">
                                  {surcharge.soLuong} × {formatCurrency(surcharge.donGia)}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <p className="font-bold text-green-600">
                                  {formatCurrency(surcharge.donGia * surcharge.soLuong)}
                                </p>
                                {surcharge.ttThanhToan !== 'Đã thanh toán' && (
                                  <button
                                    onClick={() => handleDeleteSurcharge(surcharge.idPhuThu, surcharge.idCtPt)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="Xóa phụ thu"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Trạng thái:</span>
                              <select
                                value={surcharge.ttThanhToan}
                                onChange={(e) => handleUpdatePaymentStatus('surcharge', surcharge.idCtPt, e.target.value, null, surcharge.idPhuThu)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="Chưa thanh toán">Chưa thanh toán</option>
                                <option value="Đã thanh toán">Đã thanh toán</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Không có phụ thu nào</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-800">Tiền phòng:</span>
                    <span className="font-medium text-yellow-900">
                      {selectedRoomDetails.ttThanhToan === 'Đã thanh toán'
                        ? formatCurrency(0)
                        : formatCurrency(calculateRoomTotal(selectedRoomDetails))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-800">Tiền dịch vụ & phụ thu:</span>
                    <span className="font-medium text-yellow-900">
                      {formatCurrency(calculateTotalAmount(selectedRoomDetails))}
                    </span>
                  </div>
                  <hr className="border-yellow-300" />
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-yellow-900">Tổng cộng:</h4>
                    <p className="text-2xl font-bold text-yellow-900">
                      {formatCurrency(
                        (selectedRoomDetails.ttThanhToan === 'Đã thanh toán' ? 0 : calculateRoomTotal(selectedRoomDetails)) +
                        calculateTotalAmount(selectedRoomDetails)
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  * Tiền phòng tính theo số đêm ở. Chỉ tính các khoản chưa thanh toán.
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowRoomStatusModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceManagement
