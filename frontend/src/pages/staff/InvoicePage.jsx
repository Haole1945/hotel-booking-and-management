import React, { useState, useEffect } from 'react'
import { Search, FileText, Eye, Download, Printer, Calendar, User, Filter, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { invoiceService } from '../../services/invoiceService'
import { rentalService } from '../../services/rentalService'
import DetailedInvoiceModal from '../../components/staff/DetailedInvoiceModal'
import { HOTEL_INFO, INVOICE_STATUS } from '../../constants/hotelInfo'

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [highlightInvoiceId, setHighlightInvoiceId] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchInvoices()
    
    // Check if there's a highlighted invoice from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const highlightId = urlParams.get('highlight')
    if (highlightId) {
      setHighlightInvoiceId(highlightId)
      // Remove the parameter from URL after 5 seconds
      setTimeout(() => {
        setHighlightInvoiceId(null)
        window.history.replaceState({}, document.title, window.location.pathname)
      }, 5000)
    }
  }, [])

  useEffect(() => {
    applyFilters()
  }, [invoices, searchTerm, statusFilter, dateFilter])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await invoiceService.getAllInvoices()
      if (response.statusCode === 200) {
        setInvoices(response.hoaDonList || [])
      } else {
        toast.error('Không thể tải danh sách hóa đơn')
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách hóa đơn')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...invoices]

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(invoice =>
        invoice.idHd.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.hoTenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.sdtKhachHang?.includes(searchTerm) ||
        invoice.maPhieuThue?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.trangThai === statusFilter)
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(invoice => {
            const invoiceDate = new Date(invoice.ngayLap)
            invoiceDate.setHours(0, 0, 0, 0)
            return invoiceDate.getTime() === filterDate.getTime()
          })
          break
        case 'week':
          filterDate.setDate(today.getDate() - 7)
          filtered = filtered.filter(invoice => new Date(invoice.ngayLap) >= filterDate)
          break
        case 'month':
          filterDate.setMonth(today.getMonth() - 1)
          filtered = filtered.filter(invoice => new Date(invoice.ngayLap) >= filterDate)
          break
      }
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.ngayLap) - new Date(a.ngayLap))

    setFilteredInvoices(filtered)
    setCurrentPage(1)
  }

  const handleViewInvoice = async (invoice) => {
    try {
      setLoading(true)

      // CHỈ GỌI 1 API: Lấy chi tiết hóa đơn đầy đủ
      const invoiceDetailsResponse = await invoiceService.getInvoiceDetails(invoice.idHd)
      if (invoiceDetailsResponse.statusCode !== 200) {
        toast.error('Không thể tải chi tiết hóa đơn')
        return
      }

      // Get invoice details (chỉ items đã thanh toán)
      const invoiceDetails = invoiceDetailsResponse.hoaDonDetails

      // Sử dụng data từ API details (đã có đầy đủ thông tin)
      const combinedInvoice = {
        idHd: invoiceDetails.idHd,
        idPt: invoiceDetails.idPt,
        ngayLap: invoiceDetails.ngayLap,
        tongTien: invoiceDetails.tongTien,
        soTienGiam: invoiceDetails.soTienGiam, // Thêm thông tin khuyến mãi
        trangThai: invoiceDetails.trangThai,
        cccdKhachHang: invoiceDetails.cccdKhachHang,
        hoTenKhachHang: invoiceDetails.hoTenKhachHang,
        sdtKhachHang: invoiceDetails.sdtKhachHang,
        emailKhachHang: invoiceDetails.emailKhachHang,
        idNv: invoiceDetails.idNv,
        hoTenNhanVien: invoiceDetails.hoTenNhanVien,
        invoiceDetails: invoiceDetails,
        depositAmount: 0 // Hóa đơn không cần hiển thị tiền cọc vì đã thanh toán
      }

      setSelectedInvoice(combinedInvoice)
      setShowInvoiceModal(true)
    } catch (error) {
      console.error('Error fetching invoice details:', error)
      toast.error('Có lỗi xảy ra khi tải chi tiết hóa đơn')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN')
  }

  // Helper functions để tính toán từ invoice details
  const calculateRoomCharges = (rooms) => {
    return rooms.reduce((total, room) => total + (room.thanhTien || 0), 0)
  }

  const calculateServiceCharges = (services) => {
    return services.reduce((total, service) => total + (service.thanhTien || 0), 0)
  }

  const calculateSurcharges = (surcharges) => {
    return surcharges.reduce((total, surcharge) => total + (surcharge.thanhTien || 0), 0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case INVOICE_STATUS.PAID:
        return 'bg-green-100 text-green-800'
      case INVOICE_STATUS.UNPAID:
        return 'bg-yellow-100 text-yellow-800'
      case INVOICE_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800'
      case INVOICE_STATUS.PARTIAL:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý hóa đơn</h1>
          <p className="text-gray-600 mt-2">Danh sách hóa đơn đã checkout</p>
        </div>
        <button
          onClick={fetchInvoices}
          disabled={loading}
          className="btn-primary flex items-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm theo mã HĐ, tên KH, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value={INVOICE_STATUS.PAID}>Đã thanh toán</option>
            <option value={INVOICE_STATUS.UNPAID}>Chưa thanh toán</option>
            <option value={INVOICE_STATUS.PARTIAL}>Thanh toán một phần</option>
            <option value={INVOICE_STATUS.CANCELLED}>Đã hủy</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredInvoices.length} hóa đơn
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : currentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã hóa đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày lập
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoices.map((invoice) => (
                  <tr 
                    key={invoice.idHd} 
                    className={`hover:bg-gray-50 ${
                      highlightInvoiceId === invoice.idHd ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.idHd}</div>
                      <div className="text-sm text-gray-500">{invoice.maPhieuThue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.hoTenKhachHang}
                          </div>
                          <div className="text-sm text-gray-500">{invoice.sdtKhachHang}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(invoice.ngayLap)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.tongTien)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.trangThai)}`}>
                        {invoice.trangThai}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có hóa đơn nào
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Không tìm thấy hóa đơn phù hợp với bộ lọc'
                : 'Chưa có hóa đơn nào được tạo'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Detailed Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <DetailedInvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false)
            setSelectedInvoice(null)
          }}
          invoice={selectedInvoice}
          rentalDetails={{
            // Chuyển đổi từ invoiceDetails sang format cũ để tương thích
            rooms: selectedInvoice.invoiceDetails?.danhSachPhong?.map(room => ({
              tenPhong: room.soPhong,
              loaiPhong: room.tenLoaiPhong,
              ngayDen: room.ngayDen,
              ngayDi: room.ngayDi,
              soNgay: room.soNgay,
              donGia: room.donGia,
              thanhTien: room.thanhTien
            })) || [],
            services: selectedInvoice.invoiceDetails?.danhSachDichVu?.map(service => ({
              tenDichVu: service.tenDv,
              tenPhong: service.soPhong,
              donViTinh: service.donViTinh,
              ngaySD: service.ngaySuDung,
              gia: service.donGia,
              soLuong: service.soLuong,
              thanhTien: service.thanhTien
            })) || [],
            surcharges: selectedInvoice.invoiceDetails?.danhSachPhuThu?.map(surcharge => ({
              loaiPhuThu: surcharge.loaiPhuThu,
              tenPhong: surcharge.soPhong,
              moTa: surcharge.moTa,
              ngayPhatSinh: new Date().toISOString().split('T')[0], // Tạm thời dùng ngày hiện tại
              donGia: surcharge.donGia,
              soLuong: surcharge.soLuong,
              thanhTien: surcharge.thanhTien
            })) || [],
            hoTenNhanVien: selectedInvoice.hoTenNhanVien
          }}
          selectedGuest={{
            customerName: selectedInvoice.invoiceDetails?.hoTenKhachHang || selectedInvoice.hoTenKhachHang,
            customerPhone: selectedInvoice.invoiceDetails?.sdtKhachHang || selectedInvoice.sdtKhachHang,
            customerEmail: selectedInvoice.invoiceDetails?.emailKhachHang || selectedInvoice.emailKhachHang,
            cccd: selectedInvoice.invoiceDetails?.cccdKhachHang || selectedInvoice.cccdKhachHang,
            roomNumber: selectedInvoice.soPhong,
            roomType: selectedInvoice.loaiPhong,
            maPhieuThue: selectedInvoice.invoiceDetails?.maPhieuThue || selectedInvoice.maPhieuThue,
            checkIn: selectedInvoice.invoiceDetails?.ngayCheckIn || selectedInvoice.ngayCheckIn || selectedInvoice.ngayDen,
            employeeName: selectedInvoice.invoiceDetails?.hoTenNhanVien || selectedInvoice.hoTenNhanVien,
            chiTietPhieuThue: selectedInvoice.chiTietPhieuThue || [],
            depositAmount: selectedInvoice.invoiceDetails?.soTienCoc || selectedInvoice.depositAmount || 0
          }}
          bill={{
            roomCharges: calculateRoomCharges(selectedInvoice.invoiceDetails?.danhSachPhong || []),
            serviceCharges: calculateServiceCharges(selectedInvoice.invoiceDetails?.danhSachDichVu || []),
            surcharges: calculateSurcharges(selectedInvoice.invoiceDetails?.danhSachPhuThu || []),
            promotionDiscount: selectedInvoice.invoiceDetails?.soTienGiam || 0, // Thêm khuyến mãi
            paidAmount: 0, // Không hiển thị khoản đã thanh toán
            total: selectedInvoice.invoiceDetails?.tongTien || selectedInvoice.tongTien || 0
          }}
          checkOutData={{
            actualCheckOut: selectedInvoice.ngayCheckOut || selectedInvoice.ngayDiThucTe,
            paymentMethod: selectedInvoice.phuongThucThanhToan || 'cash'
          }}
        />
      )}
    </div>
  )
}

export default InvoicePage
