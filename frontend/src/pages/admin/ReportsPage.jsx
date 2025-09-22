import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'
import * as XLSX from 'xlsx'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  FileText,
  PieChart,
  Activity,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const ReportsPage = () => {
  // Get current month's first and last day
  const getCurrentMonthRange = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    // First day of current month
    const firstDay = new Date(year, month, 1)
    // Last day of current month
    const lastDay = new Date(year, month + 1, 0)

    return {
      startDate: firstDay.toISOString().split('T')[0], // Format: YYYY-MM-DD
      endDate: lastDay.toISOString().split('T')[0]
    }
  }

  const [dateRange, setDateRange] = useState(getCurrentMonthRange())

  // Add print styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        body { font-size: 12px; }
        .card { box-shadow: none; border: 1px solid #ddd; }
        table { font-size: 11px; }
        .page-break { page-break-before: always; }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  const [reportType, setReportType] = useState('revenue')
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [bookingStatus, setBookingStatus] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchReportData()
  }, [dateRange, reportType, bookingStatus])

  const fetchReportData = async () => {
    try {
      setLoading(true)

      // Gọi API để lấy dữ liệu báo cáo
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        type: reportType
      }

      // Thêm status cho báo cáo đặt phòng
      if (reportType === 'booking') {
        params.status = bookingStatus
      }

      // Gọi API thực tế cho tất cả các loại báo cáo
      const response = await api.get('/api/reports', { params })

      if (response.data.statusCode === 200) {
        setReportData(response.data.data || {})
      } else {
        console.error('Error:', response.data.message)
        // Hiển thị thông báo lỗi thay vì mock data
        setReportData({
          message: "Dữ liệu báo cáo đang được phát triển. Vui lòng liên hệ admin để cập nhật.",
          total: 0,
          growth: 0,
          daily: 0,
          monthly: 0,
          byRoomType: [],
          byPaymentMethod: [],
          topCustomers: []
        })
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const exportReport = async (format) => {
    try {
      setLoading(true)

      if (reportType === 'booking') {
        // Sử dụng dữ liệu hiện tại thay vì gọi API mới
        if (reportData && reportData.details) {
          if (format === 'excel') {
            exportToExcel(reportData)
          }
        } else {
          alert('Không có dữ liệu để xuất. Vui lòng tải dữ liệu báo cáo trước.')
        }
      } else {
        alert('Chức năng xuất Excel chỉ khả dụng cho báo cáo đặt phòng')
      }
    } catch (error) {
      console.error('Error exporting report:', error)
      alert('Có lỗi xảy ra khi xuất báo cáo')
    } finally {
      setLoading(false)
    }
  }



  const exportToExcel = (data) => {
    if (!data || !data.details || data.details.length === 0) {
      alert('Không có dữ liệu để xuất')
      return
    }

    // Tạo workbook mới
    const workbook = XLSX.utils.book_new()

    // Tạo header với thông tin báo cáo
    const reportInfo = [
      ['BÁO CÁO CHI TIẾT ĐẶT PHÒNG'],
      [''],
      [`Thời gian: ${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} - ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}`],
      [`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}`],
      [`Trạng thái: ${bookingStatus === 'ALL' ? 'Tất cả' : bookingStatus}`],
      [`Tổng số bản ghi: ${data.details.length}`],
      [''],
      ['STT', 'ID Phiếu', 'Ngày đặt', 'Check-in', 'Check-out', 'Số ngày', 'Trạng thái', 'Khách hàng', 'CCCD', 'SĐT', 'Email', 'Phòng', 'Loại phòng', 'Tiền cọc', 'Tổng tiền']
    ]

    // Thêm dữ liệu chi tiết
    data.details.forEach((booking, index) => {
      reportInfo.push([
        index + 1,
        booking.idPd || '',
        booking.ngayDat ? new Date(booking.ngayDat).toLocaleDateString('vi-VN') : '',
        booking.ngayBdThue ? new Date(booking.ngayBdThue).toLocaleDateString('vi-VN') : '',
        booking.ngayDi ? new Date(booking.ngayDi).toLocaleDateString('vi-VN') : '',
        booking.soNgayO || 0,
        booking.trangThaiGoc || '',
        booking.hoTenKhach || '',
        booking.cccdKhach || '',
        booking.sdtKhach || '',
        booking.emailKhach || '',
        `Phòng ${booking.soPhongDat}`,
        booking.chiTietPhong || '',
        booking.soTienCoc || 0,
        booking.tongTienPhong || 0
      ])
    })

    const worksheet = XLSX.utils.aoa_to_sheet(reportInfo)

    // Thiết lập độ rộng cột
    const colWidths = [
      { wch: 5 },  // STT
      { wch: 10 }, // ID Phiếu
      { wch: 12 }, // Ngày đặt
      { wch: 12 }, // Check-in
      { wch: 12 }, // Check-out
      { wch: 8 },  // Số ngày
      { wch: 15 }, // Trạng thái
      { wch: 20 }, // Khách hàng
      { wch: 15 }, // CCCD
      { wch: 12 }, // SĐT
      { wch: 25 }, // Email
      { wch: 12 }, // Phòng
      { wch: 18 }, // Loại phòng
      { wch: 15 }, // Tiền cọc
      { wch: 18 }  // Tổng tiền
    ]

    worksheet['!cols'] = colWidths

    // Merge cells cho tiêu đề và thông tin
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }, // Tiêu đề báo cáo
      { s: { r: 2, c: 0 }, e: { r: 2, c: 14 } }, // Thời gian
      { s: { r: 3, c: 0 }, e: { r: 3, c: 14 } }, // Ngày xuất
      { s: { r: 4, c: 0 }, e: { r: 4, c: 14 } }, // Trạng thái
      { s: { r: 5, c: 0 }, e: { r: 5, c: 14 } }  // Tổng số bản ghi
    ]

    // Định dạng tiêu đề chính
    if (worksheet['A1']) {
      worksheet['A1'].s = {
        font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '1E40AF' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thick', color: { rgb: '000000' } },
          bottom: { style: 'thick', color: { rgb: '000000' } },
          left: { style: 'thick', color: { rgb: '000000' } },
          right: { style: 'thick', color: { rgb: '000000' } }
        }
      }
    }

    // Định dạng thông tin báo cáo
    for (let row = 3; row <= 6; row++) {
      if (worksheet[`A${row}`]) {
        worksheet[`A${row}`].s = {
          font: { bold: true, sz: 11 },
          alignment: { horizontal: 'center' },
          fill: { fgColor: { rgb: 'F3F4F6' } }
        }
      }
    }

    // Định dạng header bảng (dòng 8)
    const headerRow = 8
    for (let col = 0; col < 15; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRow - 1, c: col })
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
          fill: { fgColor: { rgb: '059669' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'medium', color: { rgb: '000000' } },
            bottom: { style: 'medium', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          }
        }
      }
    }

    // Định dạng dữ liệu
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    for (let row = headerRow; row <= range.e.r; row++) {
      for (let col = 0; col <= 14; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
        if (worksheet[cellAddress]) {
          const isEvenRow = (row - headerRow) % 2 === 0
          worksheet[cellAddress].s = {
            alignment: {
              horizontal: col === 0 ? 'center' : (col >= 13 ? 'right' : 'left'),
              vertical: 'center'
            },
            fill: { fgColor: { rgb: isEvenRow ? 'FFFFFF' : 'F9FAFB' } },
            border: {
              top: { style: 'thin', color: { rgb: 'E5E7EB' } },
              bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
              left: { style: 'thin', color: { rgb: 'E5E7EB' } },
              right: { style: 'thin', color: { rgb: 'E5E7EB' } }
            }
          }

          // Định dạng số cho cột tiền (cột 13 và 14)
          if ((col === 13 || col === 14) && worksheet[cellAddress].v && typeof worksheet[cellAddress].v === 'number') {
            worksheet[cellAddress].z = '#,##0" VNĐ"'
            worksheet[cellAddress].s.font = { color: { rgb: '059669' }, bold: true }
          }

          // Định dạng cho cột trạng thái (cột 6)
          if (col === 6 && worksheet[cellAddress].v) {
            const status = worksheet[cellAddress].v
            if (status === 'Xác nhận') {
              worksheet[cellAddress].s.font = { color: { rgb: '059669' }, bold: true }
            } else if (status === 'Chờ xác nhận') {
              worksheet[cellAddress].s.font = { color: { rgb: 'D97706' }, bold: true }
            } else if (status === 'Đã hủy') {
              worksheet[cellAddress].s.font = { color: { rgb: 'DC2626' }, bold: true }
            }
          }
        }
      }
    }

    // Thêm auto filter cho bảng dữ liệu (từ dòng 8)
    worksheet['!autofilter'] = { ref: `A8:O${data.details.length + 8}` }

    // Thiết lập chiều cao hàng
    worksheet['!rows'] = [
      { hpt: 35 }, // Tiêu đề chính
      { hpt: 15 }, // Dòng trống
      { hpt: 20 }, // Thời gian
      { hpt: 20 }, // Ngày xuất
      { hpt: 20 }, // Trạng thái
      { hpt: 20 }, // Tổng số bản ghi
      { hpt: 15 }, // Dòng trống
      { hpt: 30 }, // Header bảng
      ...Array(data.details.length).fill({ hpt: 25 }) // Dữ liệu
    ]

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chi tiết đặt phòng')

    // Tạo tên file
    const fileName = `ChiTiet_DatPhong_${dateRange.startDate}_${dateRange.endDate}.xlsx`

    // Xuất file
    XLSX.writeFile(workbook, fileName)

    alert('Báo cáo Excel đã được tải xuống thành công!')
  }

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />
    } else if (growth < 0) {
      return <ArrowDownRight className="w-4 h-4 text-red-500" />
    }
    return <Activity className="w-4 h-4 text-gray-500" />
  }

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B VNĐ`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)}M VNĐ`
    } else {
      return `${amount.toLocaleString('vi-VN')} VNĐ`
    }
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-2">Phân tích dữ liệu hoạt động kinh doanh</p>
        </div>
        <div className="flex space-x-3 no-print">
          <button
            onClick={() => fetchReportData()}
            className="btn-outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>

          <button
            onClick={() => exportReport('excel')}
            className="btn-primary"
            disabled={loading || !(reportType === 'booking' && reportData && reportData.details && reportData.details.length > 0)}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card no-print">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Bộ lọc báo cáo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại báo cáo
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input"
            >
              <option value="booking">Đặt phòng</option>
              <option value="revenue">Doanh thu</option>
              <option value="occupancy">Tỷ lệ lấp đầy</option>
              <option value="customer">Khách hàng</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
              className="input"
              disabled={reportType !== 'booking'}
            >
              <option value="ALL">Tất cả</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Xác nhận">Xác nhận</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking Report */}
      {reportType === 'booking' && reportData && (
        <div className="space-y-6 overflow-x-hidden">
          {/* Booking Summary */}
          {reportData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng số phiếu</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.tongSoPhieu || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng tiền cọc</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.tongTienCoc || '0'} VNĐ
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng phòng đặt</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.tongSoPhongDat || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Số ngày ở TB</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.soNgayOTb || 0} ngày
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng tiền phòng</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportData.summary.tongTienPhong || '0'} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Details Table */}
          {reportData.details && reportData.details.length > 0 && (
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết đặt phòng</h3>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Hiển thị:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">mục/trang</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Tổng: {reportData.totalRecords} bản ghi
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Số ngày</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">SĐT</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tiền cọc</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.details
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((booking, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.idPd}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.ngayDat).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.ngayBdThue).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.ngayDi).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                          {booking.soNgayO} ngày
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.trangThaiGoc === 'Xác nhận' ? 'bg-green-100 text-green-800' :
                            booking.trangThaiGoc === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800' :
                            booking.trangThaiGoc === 'Đã hủy' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.trangThaiGoc}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{booking.hoTenKhach}</div>
                            <div className="text-gray-500 text-xs">{booking.emailKhach}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                          {booking.sdtKhach}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">Phòng {booking.soPhongDat}</div>
                            <div className="text-gray-500 text-xs">{booking.chiTietPhong}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                          {booking.soTienCoc?.toLocaleString()} VNĐ
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.tongTienPhong?.toLocaleString()} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {reportData.details && reportData.details.length > itemsPerPage && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                  <div className="flex justify-between flex-1 sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(reportData.details.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(reportData.details.length / itemsPerPage)}
                      className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị{' '}
                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                        {' '}-{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, reportData.details.length)}
                        </span>
                        {' '}trong{' '}
                        <span className="font-medium">{reportData.details.length}</span>
                        {' '}kết quả
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Trang trước</span>
                          ‹
                        </button>

                        {Array.from({ length: Math.ceil(reportData.details.length / itemsPerPage) }, (_, i) => i + 1)
                          .filter(page => {
                            const totalPages = Math.ceil(reportData.details.length / itemsPerPage);
                            if (totalPages <= 7) return true;
                            if (page === 1 || page === totalPages) return true;
                            if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                            return false;
                          })
                          .map((page, index, array) => {
                            const showEllipsis = index > 0 && page - array[index - 1] > 1;
                            return (
                              <React.Fragment key={page}>
                                {showEllipsis && (
                                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => setCurrentPage(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === page
                                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            );
                          })}

                        <button
                          onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(reportData.details.length / itemsPerPage)))}
                          disabled={currentPage === Math.ceil(reportData.details.length / itemsPerPage)}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Trang sau</span>
                          ›
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Revenue Report */}
      {reportType === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-700">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(reportData?.total || 0)}
                  </p>
                  <div className="flex items-center mt-1">
                    {getGrowthIcon(reportData?.growth || 0)}
                    <span className={`text-sm ml-1 ${getGrowthColor(reportData?.growth || 0)}`}>
                      {reportData?.growth > 0 ? '+' : ''}{reportData?.growth || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-700">Doanh thu/ngày</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(reportData?.daily || 0)}
                  </p>
                  <p className="text-sm text-blue-600">Trung bình</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">Tổng booking</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {(reportData?.totalBookings || 0).toLocaleString('vi-VN')}
                  </p>
                  <p className="text-sm text-purple-600">
                    {formatCurrency(reportData?.averageBookingValue || 0)}/booking
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Building className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-700">Tỷ lệ lấp đầy</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {reportData?.occupancyRate || 0}%
                  </p>
                  <p className="text-sm text-orange-600">Trung bình</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue by Room Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo loại phòng</h3>
              <div className="space-y-4">
                {(reportData?.byRoomType || []).map((room, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{room.name}</span>
                        <span className="text-sm text-gray-600">{room.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${room.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{room.bookings} booking</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(room.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!reportData?.byRoomType || reportData.byRoomType.length === 0) && (
                  <p className="text-gray-500 text-center py-4">Chưa có dữ liệu doanh thu theo loại phòng</p>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo phương thức thanh toán</h3>
              <div className="space-y-4">
                {(reportData?.byPaymentMethod || []).map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{method.name}</span>
                        <span className="text-sm text-gray-600">{method.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(method.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!reportData?.byPaymentMethod || reportData.byPaymentMethod.length === 0) && (
                  <p className="text-gray-500 text-center py-4">Chưa có dữ liệu doanh thu theo phương thức thanh toán</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Khách hàng VIP</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Xếp hạng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng chi tiêu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số booking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trung bình/booking
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(reportData?.topCustomers || []).map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(customer.totalSpent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.bookings}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(customer.totalSpent / customer.bookings)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(!reportData?.topCustomers || reportData.topCustomers.length === 0) && (
              <p className="text-gray-500 text-center py-8">Chưa có dữ liệu khách hàng VIP</p>
            )}
          </div>

          {/* Revenue Trend Chart Placeholder */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng doanh thu theo ngày</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Biểu đồ xu hướng doanh thu</p>
                <p className="text-sm text-gray-400 mt-2">Tích hợp Chart.js hoặc Recharts</p>
                <div className="mt-4 grid grid-cols-7 gap-2 max-w-md mx-auto">
                  {[85, 92, 78, 105, 98, 87, 94].map((value, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="bg-blue-500 rounded-t mx-auto mb-1"
                        style={{
                          height: `${(value / 105) * 60}px`,
                          width: '20px'
                        }}
                      ></div>
                      <span className="text-xs text-gray-500">{value}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-700">Tăng trưởng so với kỳ trước</p>
                  <p className="text-2xl font-bold text-green-900">
                    +{reportData?.growth || 0}%
                  </p>
                  <p className="text-sm text-green-600">
                    +{formatCurrency((reportData?.total || 0) - (reportData?.previousRevenue || 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-700">Giá trị booking trung bình</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(reportData?.averageBookingValue || 0)}
                  </p>
                  <p className="text-sm text-blue-600">
                    {(reportData?.totalBookings || 0).toLocaleString('vi-VN')} booking
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">Loại phòng bán chạy nhất</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {reportData?.byRoomType?.[0]?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-purple-600">
                    {reportData?.byRoomType?.[0]?.percentage || 0}% tổng doanh thu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default ReportsPage
