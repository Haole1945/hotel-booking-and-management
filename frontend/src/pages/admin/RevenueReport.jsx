import React, { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Building,
  Users,
  CreditCard,
  Download,
  Printer,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { api } from '../../services/api'
import * as XLSX from 'xlsx'

const RevenueReport = () => {
  // State management
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [revenueData, setRevenueData] = useState(null)
  const [comparisonPeriod, setComparisonPeriod] = useState('previous_month')

  // Fetch revenue data
  const fetchRevenueData = async () => {
    try {
      setLoading(true)

      // Gọi API thực tế để lấy dữ liệu doanh thu
      const response = await api.get('/api/reports/revenue', {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      })

      if (response.data.statusCode === 200) {
        setRevenueData(response.data.data || {})
      } else {
        // Nếu API chưa implement, hiển thị thông báo
        setRevenueData({
          summary: {
            totalRevenue: 0,
            previousRevenue: 0,
            growth: 0,
            averageDaily: 0,
            totalBookings: 0,
            averageBookingValue: 0,
            occupancyRate: 0
          },
          byRoomType: [],
          byPaymentMethod: [],
          dailyRevenue: [],
          topCustomers: [],
          message: "Dữ liệu doanh thu đang được phát triển. Vui lòng liên hệ admin để cập nhật."
        })
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add print styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        body { font-size: 12px; }
        .card {
          box-shadow: none;
          border: 1px solid #ddd;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        table { font-size: 11px; }
        .page-break { page-break-before: always; }
        h1 { font-size: 24px; }
        h3 { font-size: 16px; }
        .grid { display: block !important; }
        .grid > * { margin-bottom: 15px; }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    fetchRevenueData()
  }, [dateRange, comparisonPeriod])

  // Helper functions
  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B VNĐ`
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)}M VNĐ`
    } else {
      return `${amount.toLocaleString('vi-VN')} VNĐ`
    }
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

  // Export functions
  const exportToExcel = () => {
    if (!revenueData) return

    const workbook = XLSX.utils.book_new()
    
    // Summary sheet
    const summaryData = [
      ['BÁO CÁO DOANH THU CHI TIẾT'],
      [''],
      [`Thời gian: ${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} - ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}`],
      [`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}`],
      [''],
      ['TỔNG QUAN DOANH THU'],
      ['Tổng doanh thu', revenueData.summary.totalRevenue],
      ['Doanh thu kỳ trước', revenueData.summary.previousRevenue],
      ['Tăng trưởng (%)', revenueData.summary.growth],
      ['Doanh thu trung bình/ngày', revenueData.summary.averageDaily],
      ['Tổng số booking', revenueData.summary.totalBookings],
      ['Giá trị trung bình/booking', revenueData.summary.averageBookingValue],
      ['Tỷ lệ lấp đầy (%)', revenueData.summary.occupancyRate],
      [''],
      ['DOANH THU THEO LOẠI PHÒNG'],
      ['Loại phòng', 'Doanh thu', 'Tỷ lệ (%)', 'Số booking'],
      ...revenueData.byRoomType.map(room => [room.name, room.revenue, room.percentage, room.bookings])
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tổng quan')

    // Room type sheet
    const roomTypeSheet = XLSX.utils.json_to_sheet(revenueData.byRoomType)
    XLSX.utils.book_append_sheet(workbook, roomTypeSheet, 'Theo loại phòng')

    // Payment method sheet
    const paymentSheet = XLSX.utils.json_to_sheet(revenueData.byPaymentMethod)
    XLSX.utils.book_append_sheet(workbook, paymentSheet, 'Theo phương thức TT')

    // Top customers sheet
    const customersSheet = XLSX.utils.json_to_sheet(revenueData.topCustomers)
    XLSX.utils.book_append_sheet(workbook, customersSheet, 'Khách hàng VIP')

    // Export file
    const fileName = `Bao_cao_doanh_thu_${dateRange.startDate}_${dateRange.endDate}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  const printReport = () => {
    window.print()
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Báo Cáo Doanh Thu</h1>
          <p className="text-gray-600 mt-1">Phân tích chi tiết doanh thu và hiệu suất kinh doanh</p>
        </div>
        
        <div className="flex space-x-3 no-print">
          <button
            onClick={fetchRevenueData}
            className="btn-secondary"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </button>
          <button
            onClick={exportToExcel}
            className="btn-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
          <button
            onClick={printReport}
            className="btn-secondary"
          >
            <Printer className="w-4 h-4 mr-2" />
            In báo cáo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
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
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              So sánh với
            </label>
            <select
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              className="input"
            >
              <option value="previous_month">Tháng trước</option>
              <option value="previous_quarter">Quý trước</option>
              <option value="previous_year">Năm trước</option>
              <option value="same_period_last_year">Cùng kỳ năm trước</option>
            </select>
          </div>
        </div>
      </div>

      {revenueData && (
        <>
          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(revenueData.summary.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-1">
                    {getGrowthIcon(revenueData.summary.growth)}
                    <span className={`text-sm ml-1 ${getGrowthColor(revenueData.summary.growth)}`}>
                      {revenueData.summary.growth > 0 ? '+' : ''}{revenueData.summary.growth}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Doanh thu/ngày</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(revenueData.summary.averageDaily)}
                  </p>
                  <p className="text-sm text-gray-500">Trung bình</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng booking</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {revenueData.summary.totalBookings.toLocaleString('vi-VN')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(revenueData.summary.averageBookingValue)}/booking
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Building className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tỷ lệ lấp đầy</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {revenueData.summary.occupancyRate}%
                  </p>
                  <p className="text-sm text-gray-500">Trung bình</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue by Room Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo loại phòng</h3>
              <div className="space-y-4">
                {revenueData.byRoomType.map((room, index) => (
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
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo phương thức thanh toán</h3>
              <div className="space-y-4">
                {revenueData.byPaymentMethod.map((method, index) => (
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
                          {formatCurrency(method.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                  {revenueData.topCustomers.map((customer, index) => (
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
                    +{revenueData.summary.growth}%
                  </p>
                  <p className="text-sm text-green-600">
                    +{formatCurrency(revenueData.summary.totalRevenue - revenueData.summary.previousRevenue)}
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
                    {formatCurrency(revenueData.summary.averageBookingValue)}
                  </p>
                  <p className="text-sm text-blue-600">
                    {revenueData.summary.totalBookings} booking
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
                    {revenueData.byRoomType[0]?.name}
                  </p>
                  <p className="text-sm text-purple-600">
                    {revenueData.byRoomType[0]?.percentage}% tổng doanh thu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RevenueReport
