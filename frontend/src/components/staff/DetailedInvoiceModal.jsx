import React from 'react'
import { X, FileText, Calendar, User, Phone, Mail, CreditCard, Download, Printer } from 'lucide-react'
import { HOTEL_INFO, PAYMENT_METHOD_LABELS } from '../../constants/hotelInfo'
import toast from 'react-hot-toast'

const DetailedInvoiceModal = ({
  isOpen,
  onClose,
  invoice,
  rentalDetails,
  selectedGuest,
  bill,
  checkOutData
}) => {
  if (!isOpen || !invoice || !selectedGuest) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0)
  }

  // Helper function để so sánh số phòng
  const compareRoomNumbers = (room1, room2) => {
    if (!room1 && !room2) return 0
    if (!room1) return 1
    if (!room2) return -1

    try {
      const roomNum1 = parseInt(room1)
      const roomNum2 = parseInt(room2)
      return roomNum1 - roomNum2
    } catch (e) {
      return room1.localeCompare(room2)
    }
  }

  // Helper function để sắp xếp danh sách
  const sortRooms = (rooms) => {
    if (!rooms) return []
    return [...rooms].sort((a, b) => compareRoomNumbers(a.tenPhong, b.tenPhong))
  }

  const sortServices = (services) => {
    if (!services) return []
    return [...services].sort((a, b) => {
      // So sánh theo phòng trước
      const roomCompare = compareRoomNumbers(a.tenPhong, b.tenPhong)
      if (roomCompare !== 0) return roomCompare

      // Nếu cùng phòng, so sánh theo ngày sử dụng
      if (!a.ngaySD && !b.ngaySD) return 0
      if (!a.ngaySD) return 1
      if (!b.ngaySD) return -1
      return new Date(a.ngaySD) - new Date(b.ngaySD)
    })
  }

  const sortSurcharges = (surcharges) => {
    if (!surcharges) return []
    return [...surcharges].sort((a, b) => {
      // So sánh theo phòng trước
      const roomCompare = compareRoomNumbers(a.tenPhong, b.tenPhong)
      if (roomCompare !== 0) return roomCompare

      // Nếu cùng phòng, so sánh theo ngày phát sinh
      if (!a.ngayPhatSinh && !b.ngayPhatSinh) return 0
      if (!a.ngayPhatSinh) return 1
      if (!b.ngayPhatSinh) return -1
      return new Date(a.ngayPhatSinh) - new Date(b.ngayPhatSinh)
    })
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('vi-VN')
  }

  const handlePrintInvoice = () => {
    try {
      // Create a new window for printing with clean invoice content
      const printWindow = window.open('', '_blank', 'width=800,height=600')

      if (!printWindow) {
        toast.error('Không thể mở cửa sổ in. Vui lòng cho phép popup.')
        return
      }

      const invoiceHTML = generateInvoiceHTML()

      printWindow.document.write(invoiceHTML)
      printWindow.document.close()

      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print()
        // Don't close immediately, let user close manually
      }, 500)

    } catch (error) {
      console.error('Error printing invoice:', error)
      toast.error('Có lỗi xảy ra khi in hóa đơn')
    }
  }

  const generateInvoiceHTML = () => {
    const currentDate = new Date().toLocaleDateString('vi-VN')
    const currentTime = new Date().toLocaleTimeString('vi-VN')

    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hóa đơn ${invoice.idHd}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.4;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
          }

          .hotel-name {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .hotel-info {
            font-size: 13px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.3;
          }

          .invoice-title {
            font-size: 20px;
            font-weight: bold;
            margin: 15px 0 8px 0;
            color: #333;
            text-transform: uppercase;
          }

          .invoice-meta {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
          }

          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0066cc;
            margin: 25px 0 15px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
          }

          .customer-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
          }

          .info-row {
            display: flex;
            margin: 3px 0;
            font-size: 14px;
          }

          .info-label {
            font-weight: bold;
            min-width: 120px;
            color: #555;
          }

          .info-value {
            flex: 1;
            color: #333;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 13px;
          }

          .table th {
            background: linear-gradient(135deg, #0066cc, #004499);
            color: white;
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #0066cc;
          }

          .table td {
            border: 1px solid #ddd;
            padding: 10px 8px;
            text-align: center;
          }

          .table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          .table tbody tr:hover {
            background-color: #f0f8ff;
          }

          .table .text-left { text-align: left; }
          .table .text-right { text-align: right; }

          .total-section {
            margin-top: 30px;
            background: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 14px;
            padding: 3px 0;
          }

          .total-label {
            font-weight: bold;
            color: #555;
          }

          .total-value {
            font-weight: bold;
            color: #333;
          }

          .total-final {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #0066cc;
            padding-top: 10px;
            margin-top: 10px;
            color: #0066cc;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }

          .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin-top: 10px;
            text-align: center;
          }

          .signature-box {
            padding: 20px 0;
          }

          .signature-title {
            font-weight: bold;
            margin-bottom: 60px;
            color: #333;
          }

          .signature-line {
            border-top: 1px solid #333;
            margin-top: 10px;
            font-style: italic;
            color: #666;
            font-size: 12px;
          }

          @media print {
            body {
              margin: 0;
              padding: 15px;
              font-size: 12px;
            }
            .header { margin-bottom: 20px; }
            .section-title { margin: 15px 0 10px 0; }
            .total-section { margin-top: 20px; }
            .footer { margin-top: 20px; }
            .signature-section { margin-top: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hotel-name">${HOTEL_INFO.name}</div>
          <div class="hotel-info">
            Địa chỉ: ${HOTEL_INFO.address}<br>
            Điện thoại: ${HOTEL_INFO.phone} | Email: ${HOTEL_INFO.email}
          </div>
          <div class="invoice-title">HÓA ĐƠN THANH TOÁN</div>
          <div class="invoice-meta">Mã hóa đơn: ${invoice.idHd}</div>
          <div class="invoice-meta">Ngày xuất: ${currentDate} - ${currentTime}</div>
        </div>

        <div class="section-title">Thông tin khách hàng</div>
        <div class="customer-info">
          <div>
            <div class="info-row">
              <span class="info-label">Họ tên:</span>
              <span class="info-value">${selectedGuest?.customerName || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Số điện thoại:</span>
              <span class="info-value">${selectedGuest?.customerPhone || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${selectedGuest?.customerEmail || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">CCCD:</span>
              <span class="info-value">${selectedGuest?.cccd || 'N/A'}</span>
            </div>
          </div>
          <div>
            <div class="info-row">
              <span class="info-label">Nhân viên thực hiện:</span>
              <span class="info-value">${rentalDetails?.hoTenNhanVien || selectedGuest?.employeeName || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Mã phiếu thuê:</span>
              <span class="info-value">${selectedGuest?.maPhieuThue || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Ngày check-in:</span>
              <span class="info-value">${selectedGuest?.checkIn ? formatDate(selectedGuest.checkIn) : 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Ngày check-out:</span>
              <span class="info-value">${invoice.ngayLap ? formatDate(invoice.ngayLap) : 'N/A'}</span>
            </div>
          </div>
        </div>

        ${rentalDetails && rentalDetails.rooms && rentalDetails.rooms.length > 0 ? `
        <div class="section-title">Chi tiết phòng</div>
        <table class="table">
          <thead>
            <tr>
              <th>Phòng</th>
              <th>Loại phòng</th>
              <th>Ngày đến</th>
              <th>Ngày đi</th>
              <th>Số ngày</th>
              <th class="text-right">Đơn giá</th>
              <th class="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${sortRooms(rentalDetails.rooms).map(room => `
            <tr>
              <td class="text-left">${room.tenPhong}</td>
              <td class="text-left">${room.loaiPhong}</td>
              <td>${formatDate(room.ngayDen)}</td>
              <td>${formatDate(room.ngayDi)}</td>
              <td>${room.soNgay}</td>
              <td class="text-right">${formatCurrency(room.donGia)}</td>
              <td class="text-right">${formatCurrency(room.thanhTien)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}

        ${rentalDetails && rentalDetails.services && rentalDetails.services.length > 0 ? `
        <div class="section-title">Dịch vụ sử dụng</div>
        <table class="table">
          <thead>
            <tr>
              <th>Dịch vụ</th>
              <th>Phòng</th>
              <th>Ngày sử dụng</th>
              <th class="text-right">Đơn giá</th>
              <th>Số lượng</th>
              <th class="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${sortServices(rentalDetails.services).map(service => `
            <tr>
              <td class="text-left">${service.tenDichVu}</td>
              <td class="text-left">${service.tenPhong}</td>
              <td>${formatDate(service.ngaySD)}</td>
              <td class="text-right">${formatCurrency(service.gia)}</td>
              <td>${service.soLuong}</td>
              <td class="text-right">${formatCurrency(service.thanhTien)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}

        ${rentalDetails && rentalDetails.surcharges && rentalDetails.surcharges.length > 0 ? `
        <div class="section-title">Phụ thu</div>
        <table class="table">
          <thead>
            <tr>
              <th>Loại phụ thu</th>
              <th>Phòng</th>
              <th>Ngày phát sinh</th>
              <th class="text-right">Đơn giá</th>
              <th>Số lượng</th>
              <th class="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${sortSurcharges(rentalDetails.surcharges).map(surcharge => `
            <tr>
              <td class="text-left">${surcharge.loaiPhuThu}</td>
              <td class="text-left">${surcharge.tenPhong}</td>
              <td>${formatDate(surcharge.ngayPhatSinh)}</td>
              <td class="text-right">${formatCurrency(surcharge.donGia)}</td>
              <td>${surcharge.soLuong}</td>
              <td class="text-right">${formatCurrency(surcharge.thanhTien)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}

        <div class="section-title">Tổng kết thanh toán</div>
        <div class="total-section">
          <div class="total-row">
            <span class="total-label">Tiền phòng:</span>
            <span class="total-value">${formatCurrency(rentalDetails?.tongTienPhong || bill.roomCharges)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Tiền dịch vụ:</span>
            <span class="total-value">${formatCurrency(rentalDetails?.tongTienDichVu || bill.serviceCharges)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Phụ thu:</span>
            <span class="total-value">${formatCurrency(rentalDetails?.tongTienPhuThu || bill.surcharges)}</span>
          </div>
          ${invoice.invoiceDetails?.soTienGiam && invoice.invoiceDetails.soTienGiam > 0 ? `
          <div class="total-row" style="color: #dc2626;">
            <span class="total-label">Khuyến mãi:</span>
            <span class="total-value">-${formatCurrency(invoice.invoiceDetails.soTienGiam)}</span>
          </div>
          ` : ''}
          <div class="total-row total-final">
            <span class="total-label">TỔNG CỘNG:</span>
            <span class="total-value">${formatCurrency(bill.roomCharges + bill.serviceCharges + bill.surcharges - (invoice.invoiceDetails?.soTienGiam || 0))}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Tiền đặt cọc:</span>
            <span class="total-value">${formatCurrency(selectedGuest?.depositAmount || 0)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Phương thức thanh toán:</span>
            <span class="total-value">${PAYMENT_METHOD_LABELS[checkOutData?.paymentMethod] || checkOutData?.paymentMethod || 'N/A'}</span>
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-title">Khách hàng</div>
            <div class="signature-line">(Ký và ghi rõ họ tên)</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">Nhân viên thu ngân</div>
            <div class="signature-line">(Ký và ghi rõ họ tên)</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Cảm ơn quý khách đã sử dụng dịch vụ!</strong></p>
          <p>${HOTEL_INFO.name} - ${HOTEL_INFO.address}</p>
          <p>Hotline: ${HOTEL_INFO.phone} | Email: ${HOTEL_INFO.email}</p>
        </div>
      </body>
      </html>
    `
  }

  const handleDownloadInvoice = async () => {
    try {
      const htmlContent = generateInvoiceHTML()
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `HoaDon_${invoice.idHd}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Hóa đơn đã được tải xuống!')
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error('Có lỗi xảy ra khi tải xuống hóa đơn')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center mb-2">
              <img 
                src={HOTEL_INFO.logo} 
                alt="Hotel Logo" 
                className="h-12 w-12 mr-3"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-600">{HOTEL_INFO.name}</h1>
                <p className="text-sm text-gray-600">{HOTEL_INFO.address}</p>
                <p className="text-sm text-gray-600">ĐT: {HOTEL_INFO.phone} | Email: {HOTEL_INFO.email}</p>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">HÓA ĐƠN THANH TOÁN</h2>
            <p className="text-lg font-semibold text-blue-600">Mã hóa đơn: {invoice.idHd}</p>
            <p className="text-sm text-gray-600">
              Ngày xuất: {formatDate(invoice.ngayLap)} - {new Date().toLocaleTimeString('vi-VN')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Họ tên:</span>
                <span className="ml-2">{selectedGuest.customerName}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">SĐT:</span>
                <span className="ml-2">{selectedGuest.customerPhone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span className="ml-2">{selectedGuest.customerEmail || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">CCCD:</span>
                <span className="ml-2">{selectedGuest.cccd || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Nhân viên thực hiện:</span>
                <span className="ml-2">{rentalDetails?.hoTenNhanVien || selectedGuest.employeeName || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Mã phiếu thuê:</span>
                <span className="ml-2">{selectedGuest.maPhieuThue}</span>
              </div>
            </div>
          </div>

          {/* Check-in/Check-out Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Thông tin lưu trú
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Ngày check-in :</span>
                <div className="text-blue-600 font-medium">{formatDate(selectedGuest.checkIn || invoice.ngayCheckIn)}</div>
              </div>
              <div>
                <span className="font-medium">Ngày check-out thực tế:</span>
                <div className="text-blue-600 font-medium">{formatDate(invoice.ngayLap)}</div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          {rentalDetails && rentalDetails.rooms && rentalDetails.rooms.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg mb-6">
              <h3 className="text-lg font-semibold p-4 border-b text-blue-600">Thông tin phòng</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Phòng</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Loại phòng</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ngày đến</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ngày đi</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Số ngày</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Đơn giá</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortRooms(rentalDetails.rooms).map((room, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{room.tenPhong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{room.loaiPhong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(room.ngayDen)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(room.ngayDi)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{room.soNgay}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(room.donGia)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{formatCurrency(room.thanhTien)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Services - hiển thị tất cả dịch vụ trong hóa đơn */}
          {rentalDetails && rentalDetails.services && rentalDetails.services.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg mb-6">
              <h3 className="text-lg font-semibold p-4 border-b text-blue-600">Dịch vụ sử dụng</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Dịch vụ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Phòng</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ngày sử dụng</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Đơn giá</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Số lượng</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortServices(rentalDetails.services).map((service, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{service.tenDichVu}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{service.tenPhong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(service.ngaySD)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(service.gia)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{service.soLuong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{formatCurrency(service.thanhTien)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Surcharges - hiển thị tất cả phụ thu trong hóa đơn */}
          {rentalDetails && rentalDetails.surcharges && rentalDetails.surcharges.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg mb-6">
              <h3 className="text-lg font-semibold p-4 border-b text-blue-600">Phụ thu</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Loại phụ thu</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Phòng</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ngày phát sinh</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Đơn giá</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Số lượng</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortSurcharges(rentalDetails.surcharges).map((surcharge, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{surcharge.loaiPhuThu}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{surcharge.tenPhong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(surcharge.ngayPhatSinh)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(surcharge.donGia)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{surcharge.soLuong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{formatCurrency(surcharge.thanhTien)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Tổng kết thanh toán</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tiền phòng:</span>
                <span className="font-medium">{formatCurrency(rentalDetails?.tongTienPhong || bill.roomCharges)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tiền dịch vụ:</span>
                <span className="font-medium">{formatCurrency(rentalDetails?.tongTienDichVu || bill.serviceCharges)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phụ thu:</span>
                <span className="font-medium">{formatCurrency(rentalDetails?.tongTienPhuThu || bill.surcharges)}</span>
              </div>

              {/* Hiển thị khuyến mãi nếu có */}
              {invoice.invoiceDetails?.soTienGiam && invoice.invoiceDetails.soTienGiam > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Khuyến mãi:</span>
                  <span className="font-medium">-{formatCurrency(invoice.invoiceDetails.soTienGiam)}</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-lg font-bold text-blue-600">
                <span>TỔNG CỘNG:</span>
                <span>{formatCurrency(bill.roomCharges + bill.serviceCharges + bill.surcharges - (invoice.invoiceDetails?.soTienGiam || 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tiền đặt cọc:</span>
                <span className="font-medium">{formatCurrency(selectedGuest?.depositAmount || 0)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-red-600">
                <span>SỐ TIỀN PHẢI THANH TOÁN:</span>
                <span>{formatCurrency(Math.max(0, (rentalDetails?.tongTien || bill.total) ))}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Phương thức thanh toán:</span>
                <span className="font-medium">{PAYMENT_METHOD_LABELS[checkOutData.paymentMethod] || checkOutData.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t print:hidden">
            <button
              onClick={handlePrintInvoice}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              In hóa đơn
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailedInvoiceModal
