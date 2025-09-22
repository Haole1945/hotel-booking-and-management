import React, { useState, useEffect } from 'react'
import { Search, UserX, CreditCard, Receipt, AlertCircle, CheckCircle, Calculator, FileText, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { rentalService } from '../../services/rentalService'
import { invoiceService } from '../../services/invoiceService'
import { dashboardService } from '../../services/dashboardService'
import InvoiceComponent from '../../components/staff/InvoiceComponent'
import DetailedInvoiceModal from '../../components/staff/DetailedInvoiceModal'
import PromotionSelector from '../../components/staff/PromotionSelector'
import ManualDiscountSelector from '../../components/staff/ManualDiscountSelector'
import { HOTEL_INFO, INVOICE_STATUS } from '../../constants/hotelInfo'

const CheckOutPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [checkedInGuests, setCheckedInGuests] = useState([])
  const [filteredGuests, setFilteredGuests] = useState([])
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState('all') // 'all' or 'today'
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [checkOutData, setCheckOutData] = useState({
    actualCheckOut: '',
    notes: '',
    paymentMethod: 'cash'
  })
  const [bill, setBill] = useState({
    roomCharges: 0,
    serviceCharges: 0,
    surcharges: 0,
    paidAmount: 0,
    promotionDiscount: 0,
    total: 0
  })
  const [promotionData, setPromotionData] = useState({
    totalDiscount: 0,
    discountDetails: []
  })
  const [manualDiscountData, setManualDiscountData] = useState({
    discountPercent: 0,
    discountAmount: 0,
    hasManualDiscount: false
  })
  const [invoice, setInvoice] = useState(null)
  const [showInvoice, setShowInvoice] = useState(false)
  const [rentalDetails, setRentalDetails] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showRoomDetails, setShowRoomDetails] = useState(false)

  useEffect(() => {
    fetchCheckedInGuests()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [checkedInGuests, searchTerm, filterType])

  const fetchCheckedInGuests = async () => {
    try {
      setLoading(true)
      // Lấy danh sách khách đang ở - sử dụng API cũ để có đầy đủ thông tin
      const response = await rentalService.getCurrentStays()
      const guestData = response.phieuThueList || []

      // Lấy danh sách tất cả hóa đơn để kiểm tra
      const invoicesResponse = await invoiceService.getAllInvoices()
      const existingInvoices = invoicesResponse.statusCode === 200 ? invoicesResponse.hoaDonList || [] : []
      const invoicedRentalIds = new Set(existingInvoices.map(invoice => invoice.idPt))

      // Transform data to match frontend format và loại bỏ khách đã có hóa đơn
      const transformedData = guestData
        .filter(rental => !invoicedRentalIds.has(rental.idPt)) // Loại bỏ khách đã có hóa đơn
        .map(rental => {
          // Get room information from chiTietPhieuThue - CHỈ PHÒNG CHƯA THANH TOÁN
          const roomInfo = rental.chiTietPhieuThue && rental.chiTietPhieuThue.length > 0
            ? rental.chiTietPhieuThue
                .filter(ct => ct.ttThanhToan !== 'Đã thanh toán')
                .map(ct => ({
                soPhong: ct.soPhong,
                tenKieuPhong: ct.tenKieuPhong,
                tenLoaiPhong: ct.tenLoaiPhong,
                tang: ct.tang
              }))
            : [];

          // Get first room for display
          const firstRoom = roomInfo.length > 0 ? roomInfo[0] : null;

          // Kiểm tra quá hạn với logic mới (12h trưa)
          const now = new Date()
          const expectedCheckOut = new Date(rental.ngayDi)
          expectedCheckOut.setHours(12, 0, 0, 0) // Set to 12:00 PM

          const isOverdue = now > expectedCheckOut
          let overdueStatus = ""
          let overdueDays = 0

          if (isOverdue) {
            const overdueHours = Math.ceil((now - expectedCheckOut) / (1000 * 60 * 60))

            // Nếu trễ quá 12 tiếng thì tính là trễ hạn 1 ngày
            if (overdueHours >= 12) {
              overdueDays = Math.ceil(overdueHours / 24)
              overdueStatus = `${overdueDays} ngày`
            } else {
              overdueStatus = `${overdueHours} giờ`
            }
          }

          return {
            id: rental.idPt,
            maPhieuThue: `PT${rental.idPt}`,
            customerName: rental.hoTenKhachHang || 'N/A',
            customerPhone: rental.sdtKhachHang || 'N/A',
            customerEmail: rental.emailKhachHang || 'N/A',
            cccd: rental.cccd,
            checkIn: rental.ngayDen,
            checkOut: rental.ngayDi,
            roomNumber: firstRoom ? firstRoom.soPhong : 'N/A',
            roomType: firstRoom ? `${firstRoom.tenKieuPhong} - ${firstRoom.tenLoaiPhong}` : 'N/A',
            status: isOverdue ? 'overdue' : 'checkedin',
            overdueDays: overdueDays,
            overdueStatus: overdueStatus,
            isOverdue: isOverdue,
            bookingId: rental.idPd,
            employeeId: rental.idNv,
            employeeName: rental.hoTenNhanVien,
            chiTietPhieuThue: rental.chiTietPhieuThue || [],
            roomInfo: roomInfo,
            depositAmount: rental.soTienCoc || 0 // Thêm tiền đặt cọc từ API
          }
        })

      setCheckedInGuests(transformedData)
      setFilteredGuests(transformedData)
    } catch (error) {
      console.error('Error fetching checked-in guests:', error)
      setCheckedInGuests([])
      setFilteredGuests([])
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = checkedInGuests

    // Apply date filter
    if (filterType === 'today') {
      const today = new Date().toISOString().split('T')[0]
      // Filter guests who should check out today or are overdue
      filtered = filtered.filter(guest => {
        if (!guest.checkOut) return false
        return guest.checkOut <= today
      })
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(guest =>
        guest.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.maPhieuThue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.customerPhone.includes(searchTerm)
      )
    }

    setFilteredGuests(filtered)
    setCurrentPage(1)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (type) => {
    setFilterType(type)
  }

  const toDatetimeLocal = (date) => {
  const offset = date.getTimezoneOffset(); // phút
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16); // giữ lại yyyy-MM-ddTHH:mm
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
  const sortRoomDetails = (roomDetails) => {
    if (!roomDetails) return []
    return [...roomDetails].sort((a, b) => compareRoomNumbers(a.soPhong, b.soPhong))
  }

  const sortServices = (services) => {
    if (!services) return []
    return [...services].sort((a, b) => {
      // So sánh theo phòng trước (dựa vào context phòng)
      const roomCompare = compareRoomNumbers(a.soPhong, b.soPhong)
      if (roomCompare !== 0) return roomCompare

      // Nếu cùng phòng, so sánh theo ngày sử dụng
      if (!a.ngaySuDung && !b.ngaySuDung) return 0
      if (!a.ngaySuDung) return 1
      if (!b.ngaySuDung) return -1
      return new Date(a.ngaySuDung) - new Date(b.ngaySuDung)
    })
  }

  const sortSurcharges = (surcharges) => {
    if (!surcharges) return []
    return [...surcharges].sort((a, b) => {
      // So sánh theo phòng trước (dựa vào context phòng)
      const roomCompare = compareRoomNumbers(a.soPhong, b.soPhong)
      if (roomCompare !== 0) return roomCompare

      // Nếu cùng phòng, so sánh theo ngày phát sinh (tạm dùng ngày hiện tại)
      return 0 // Vì CtPhuThu không có ngày phát sinh
    })
  }

  const handleSelectGuest = async (guest) => {
    setSelectedGuest(guest)
    setCheckOutData({
      actualCheckOut: toDatetimeLocal(new Date()),
      notes: '',
      paymentMethod: 'cash'
    })

    // Calculate bill from chiTietPhieuThue
    let totalRoomCharges = 0
    let totalServiceCharges = 0
    let totalSurcharges = 0
    let totalPaidAmount = 0

    if (guest.chiTietPhieuThue && guest.chiTietPhieuThue.length > 0) {
      guest.chiTietPhieuThue.forEach(ct => {
        // CHỈ TÍNH PHÒNG CHƯA THANH TOÁN
        if (ct.ttThanhToan !== 'Đã thanh toán' && ct.donGia && ct.ngayDen) {
          const checkInDate = new Date(ct.ngayDen)
          checkInDate.setHours(0, 0, 0, 0) // Set to start of day

          // Sử dụng ngày checkout đã đặt trước từ CtPhieuThue.ngayDi
          // Nếu chưa có thì fallback về checkOutData hoặc ngày hiện tại
          const actualCheckOutDate = ct.ngayDi ?
            new Date(ct.ngayDi) :
            (checkOutData.actualCheckOut ? new Date(checkOutData.actualCheckOut) : new Date())

          // Tính số ngày: chỉ tính thêm ngày khi checkout qua ngày mới (sau 00:00)
          const checkOutDateOnly = new Date(actualCheckOutDate)
          checkOutDateOnly.setHours(0, 0, 0, 0) // Set to start of day for comparison

          const soNgay = Math.max(1, Math.ceil((checkOutDateOnly - checkInDate) / (1000 * 60 * 60 * 24)))
          const roomTotal = ct.donGia * soNgay
          totalRoomCharges += roomTotal

          // Nếu phòng đã thanh toán thì cộng vào số tiền đã thanh toán
          if (ct.ttThanhToan === 'Đã thanh toán') {
            totalPaidAmount += roomTotal
          }
        }

        // Service charges - chỉ tính các dịch vụ chưa thanh toán
        if (ct.danhSachDichVu && ct.danhSachDichVu.length > 0) {
          ct.danhSachDichVu.forEach(dv => {
            // Chỉ cộng vào tổng tiền nếu chưa thanh toán
            if (dv.ttThanhToan !== 'Đã thanh toán') {
              totalServiceCharges += dv.thanhTien || 0
            }
          })
        }

        // Surcharges - chỉ tính các phụ thu chưa thanh toán
        if (ct.danhSachPhuThu && ct.danhSachPhuThu.length > 0) {
          ct.danhSachPhuThu.forEach(pt => {
            // Chỉ cộng vào tổng tiền nếu chưa thanh toán
            if (pt.ttThanhToan !== 'Đã thanh toán') {
              totalSurcharges += pt.thanhTien || 0
            }
          })
        }
      })
    }

    setBill({
      roomCharges: totalRoomCharges,
      serviceCharges: totalServiceCharges,
      surcharges: totalSurcharges,
      paidAmount: 0, // Không tính các khoản đã thanh toán
      promotionDiscount: 0, // Sẽ được cập nhật khi chọn khuyến mãi
      manualDiscount: 0, // Sẽ được cập nhật khi chọn giảm giá thủ công
      total: totalRoomCharges + totalServiceCharges + totalSurcharges
    })

    // Reset promotion data khi chọn khách mới
    setPromotionData({
      totalDiscount: 0,
      discountDetails: []
    })

    // Reset manual discount data khi chọn khách mới
    setManualDiscountData({
      discountPercent: 0,
      discountAmount: 0,
      hasManualDiscount: false
    })

    // Tự động tải chi tiết phiếu thuê để hiển thị đầy đủ thông tin
    await fetchRentalDetailsForDisplay(guest.id)

    // Tiền đặt cọc sẽ được lấy từ rentalDetails khi fetch chi tiết
  }

  // Hàm tải chi tiết để hiển thị thông tin (không mở modal)
  const fetchRentalDetailsForDisplay = async (rentalId) => {
    try {
      setLoading(true)
      const response = await rentalService.getRentalDetails(rentalId)
      const details = response.phieuThueDetails
      setRentalDetails(details)
      // Không set setShowDetails(true) ở đây

      // Chỉ cập nhật thông tin bổ sung, không ghi đè bill đã tính toán
      if (details && selectedGuest) {
        // Debug log
        console.log('API details:', details)
        console.log('soTienCoc from API:', details.soTienCoc)

        // Update selected guest with additional info, bao gồm tiền đặt cọc từ API
        setSelectedGuest(prev => ({
          ...prev,
          customerEmail: details.emailKhachHang || prev.customerEmail,
          roomCount: details.rooms ? details.rooms.length : (prev.chiTietPhieuThue?.length || 1),
          depositAmount: details.soTienCoc || prev.depositAmount || 0 // Lấy từ API hoặc giữ nguyên
        }))
      }
    } catch (error) {
      console.error('Error fetching rental details:', error)
      toast.error('Không thể tải thông tin chi tiết phiếu thuê')
    } finally {
      setLoading(false)
    }
  }



  // Hàm chỉ để mở modal xem chi tiết (không cập nhật dữ liệu)
  const fetchRentalDetails = async (rentalId) => {
    try {
      if (!rentalDetails) {
        // Nếu chưa có dữ liệu thì tải
        await fetchRentalDetailsForDisplay(rentalId)
      }
      // Chỉ mở modal
      setShowDetails(true)
    } catch (error) {
      console.error('Error showing rental details:', error)
      toast.error('Không thể hiển thị thông tin chi tiết phiếu thuê')
    }
  }



  const handleCheckOut = async () => {
    if (!selectedGuest) return

    try {
      setLoading(true)

      // CHỈ GỌI 1 API: Tạo hóa đơn từ checkout (bao gồm cả checkout process)
      const actualCheckOutDate = checkOutData.actualCheckOut ?
        new Date(checkOutData.actualCheckOut).toISOString().split('T')[0] :
        new Date().toISOString().split('T')[0]

      // Tính tổng discount (promotion + manual)
      const totalDiscount = promotionData.totalDiscount + manualDiscountData.discountAmount

      const invoiceResult = await handleCreateInvoiceFromCheckoutWithPromotions(
        selectedGuest.id,
        actualCheckOutDate,
        totalDiscount
      )

      if (invoiceResult && invoiceResult.idHd) {
        toast.success(`Check-out thành công cho ${selectedGuest.customerName}!`)

        // Update invoice status to "Đã thanh toán" after successful checkout
        try {
          await invoiceService.updateInvoiceStatus(invoiceResult.idHd, INVOICE_STATUS.PAID)
          toast.success('Trạng thái hóa đơn đã được cập nhật!')

          // Note: Không cập nhật trạng thái phiếu đặt khi check-out
          // Phiếu đặt sẽ giữ nguyên trạng thái hiện tại (Xác nhận, Chờ xác nhận, hoặc Đã hủy)

          // Chuyển hướng đến trang hóa đơn và highlight hóa đơn vừa tạo
          navigate(`/staff/invoices?highlight=${invoiceResult.idHd}`)
          return // Không cần thực hiện các bước tiếp theo vì đã chuyển trang
        } catch (error) {
          console.error('Error updating invoice status:', error)
          toast.error('Không thể cập nhật trạng thái hóa đơn')
        }

        // Update guest status - remove from checked-in list
        setCheckedInGuests(prev =>
          prev.filter(guest => guest.id !== selectedGuest.id)
        )

        setSelectedGuest(null)
        setCheckOutData({
          actualCheckOut: '',
          notes: '',
          paymentMethod: 'cash'
        })
        setBill({
          roomCharges: 0,
          serviceCharges: 0,
          surcharges: 0,
          paidAmount: 0,
          total: 0
        })

        // Refresh the list
        fetchCheckedInGuests()
      } else {
        toast.error('Không thể tạo hóa đơn từ checkout')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi check-out')
      console.error('Check-out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async (rentalId) => {
    try {
      const response = await invoiceService.createInvoiceFromCheckout(rentalId)
      if (response.statusCode === 200) {
        setInvoice(response.hoaDon)
        toast.success('Hóa đơn đã được tạo thành công!')
        setShowInvoice(true)
        return response.hoaDon // Trả về thông tin hóa đơn
      } else {
        toast.error('Không thể tạo hóa đơn: ' + response.message)
        return null
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
      toast.error('Có lỗi xảy ra khi tạo hóa đơn')
      return null
    }
  }

  // API MỚI: Tạo hóa đơn từ checkout (bao gồm cả checkout process)
  const handleCreateInvoiceFromCheckout = async (rentalId, actualCheckOutDate) => {
    try {
      const response = await invoiceService.createInvoiceFromCheckoutWithDate(rentalId, actualCheckOutDate)
      if (response.statusCode === 200) {
        setInvoice(response.hoaDon)
        toast.success('Hóa đơn đã được tạo thành công!')
        setShowInvoice(true)
        return response.hoaDon // Trả về thông tin hóa đơn
      } else {
        toast.error('Không thể tạo hóa đơn: ' + response.message)
        return null
      }
    } catch (error) {
      console.error('Error creating invoice from checkout:', error)
      toast.error('Có lỗi xảy ra khi tạo hóa đơn')
      return null
    }
  }

  // API MỚI: Tạo hóa đơn từ checkout với khuyến mãi
  const handleCreateInvoiceFromCheckoutWithPromotions = async (rentalId, actualCheckOutDate, promotionDiscount) => {
    try {
      const response = await invoiceService.createInvoiceFromCheckoutWithPromotions(rentalId, actualCheckOutDate, promotionDiscount)
      if (response.statusCode === 200) {
        setInvoice(response.hoaDon)
        toast.success('Hóa đơn đã được tạo thành công!')
        setShowInvoice(true)
        return response.hoaDon // Trả về thông tin hóa đơn
      } else {
        toast.error('Không thể tạo hóa đơn: ' + response.message)
        return null
      }
    } catch (error) {
      console.error('Error creating invoice from checkout with promotions:', error)
      toast.error('Có lỗi xảy ra khi tạo hóa đơn')
      return null
    }
  }

  const handleViewRoomDetails = (room) => {
    setSelectedRoom(room)
    setShowRoomDetails(true)
  }

  // Handler cho promotion change
  const handlePromotionChange = (promotionCalculation) => {
    setPromotionData(promotionCalculation)
    updateBillTotal(promotionCalculation.totalDiscount, manualDiscountData.discountAmount)
  }

  // Handler cho manual discount change
  const handleManualDiscountChange = (discountData) => {
    setManualDiscountData(discountData)
    updateBillTotal(promotionData.totalDiscount, discountData.discountAmount)
  }

  // Cập nhật tổng bill với cả promotion và manual discount
  const updateBillTotal = (promotionDiscount, manualDiscount) => {
    setBill(prevBill => ({
      ...prevBill,
      promotionDiscount: promotionDiscount,
      manualDiscount: manualDiscount,
      total: prevBill.roomCharges + prevBill.serviceCharges + prevBill.surcharges - promotionDiscount - manualDiscount
    }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0)
  }

  // Helper function để format ngày theo định dạng dd-mm-yy
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định'
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    return `${day}-${month}-${year}`
  }
  const RentalDetailsModal = () => {
    if (!showDetails || !rentalDetails) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết phiếu thuê #{rentalDetails.idPt}</h2>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">Thông tin khách hàng</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="font-medium">Họ tên:</span> {rentalDetails.hoTenKhachHang}
              </div>
              <div>
                <span className="font-medium">CCCD:</span> {rentalDetails.cccdKhachHang}
              </div>
              <div>
                <span className="font-medium">SĐT:</span> {rentalDetails.sdtKhachHang}
              </div>
              <div>
                <span className="font-medium">Email:</span> {rentalDetails.emailKhachHang}
              </div>
            </div>
          </div>

          {/* Room Information */}
          {rentalDetails.rooms && rentalDetails.rooms.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Thông tin phòng</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
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
                    {/* CHỈ HIỂN THỊ PHÒNG CHƯA THANH TOÁN */}
                    {selectedGuest.chiTietPhieuThue && selectedGuest.chiTietPhieuThue
                      .filter(ct => ct.ttThanhToan !== 'Đã thanh toán')
                      .map((ct, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{ct.soPhong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{ct.tenKieuPhong} {ct.tenLoaiPhong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(ct.ngayDen)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(ct.ngayDi)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {(() => {
                            if (ct.ngayDen) {
                              const checkInDate = new Date(ct.ngayDen)
                              checkInDate.setHours(0, 0, 0, 0)

                              // Sử dụng ngày checkout đã đặt trước từ CtPhieuThue.ngayDi
                              const actualCheckOut = ct.ngayDi ?
                                new Date(ct.ngayDi) :
                                (checkOutData.actualCheckOut ? new Date(checkOutData.actualCheckOut) : new Date())
                              const checkOutDateOnly = new Date(actualCheckOut)
                              checkOutDateOnly.setHours(0, 0, 0, 0)

                              // Chỉ tính thêm ngày khi qua ngày mới (sau 00:00)
                              return Math.max(1, Math.ceil((checkOutDateOnly - checkInDate) / (1000 * 60 * 60 * 24)))
                            }
                            return 1
                          })()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(ct.donGia)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          {(() => {
                            if (ct.donGia && ct.ngayDen) {
                              const checkInDate = new Date(ct.ngayDen)
                              checkInDate.setHours(0, 0, 0, 0)

                              // Sử dụng ngày checkout đã đặt trước từ CtPhieuThue.ngayDi
                              const actualCheckOut = ct.ngayDi ?
                                new Date(ct.ngayDi) :
                                (checkOutData.actualCheckOut ? new Date(checkOutData.actualCheckOut) : new Date())
                              const checkOutDateOnly = new Date(actualCheckOut)
                              checkOutDateOnly.setHours(0, 0, 0, 0)

                              // Chỉ tính thêm ngày khi qua ngày mới (sau 00:00)
                              const soNgay = Math.max(1, Math.ceil((checkOutDateOnly - checkInDate) / (1000 * 60 * 60 * 24)))
                              const thanhTien = ct.donGia * soNgay
                              return formatCurrency(thanhTien)
                            }
                            return formatCurrency(ct.donGia || 0)
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Services Information */}
          {rentalDetails.services && rentalDetails.services.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Dịch vụ sử dụng</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
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
                    {rentalDetails.services.map((service, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{service.tenDichVu}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{service.tenPhong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(service.ngaySD)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(service.gia)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{service.soLuong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{formatCurrency(service.thanhTien)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Surcharges Information */}
          {rentalDetails.surcharges && rentalDetails.surcharges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Phụ thu</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
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
                    {rentalDetails.surcharges.map((surcharge, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{surcharge.loaiPhuThu}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{surcharge.tenPhong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(surcharge.ngayPhatSinh)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(surcharge.donGia)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{surcharge.soLuong}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{formatCurrency(surcharge.thanhTien)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-600 ">Tổng kết chi phí</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tiền phòng:</span>
                <span className="font-medium">
                  {formatCurrency((() => {
                    let totalRoomCharges = 0
                    if (selectedGuest.chiTietPhieuThue) {
                      selectedGuest.chiTietPhieuThue.forEach(ct => {
                        // CHỈ TÍNH PHÒNG CHƯA THANH TOÁN
                        if (ct.ttThanhToan !== 'Đã thanh toán' && ct.donGia && ct.ngayDen) {
                          const checkInDate = new Date(ct.ngayDen)
                          checkInDate.setHours(0, 0, 0, 0)

                          // Sử dụng ngày checkout đã đặt trước từ CtPhieuThue.ngayDi
                          const actualCheckOut = ct.ngayDi ?
                            new Date(ct.ngayDi) :
                            (checkOutData.actualCheckOut ? new Date(checkOutData.actualCheckOut) : new Date())
                          const checkOutDateOnly = new Date(actualCheckOut)
                          checkOutDateOnly.setHours(0, 0, 0, 0)

                          const soNgay = Math.max(1, Math.ceil((checkOutDateOnly - checkInDate) / (1000 * 60 * 60 * 24)))
                          totalRoomCharges += ct.donGia * soNgay
                        }
                      })
                    }
                    return totalRoomCharges
                  })())}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tiền dịch vụ:</span>
                <span className="font-medium">{formatCurrency(rentalDetails.tongTienDichVu)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phụ thu:</span>
                <span className="font-medium">{formatCurrency(rentalDetails.tongTienPhuThu)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 text-blue-600">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">
                  {formatCurrency((() => {
                    let totalRoomCharges = 0
                    if (selectedGuest.chiTietPhieuThue) {
                      selectedGuest.chiTietPhieuThue.forEach(ct => {
                        // CHỈ TÍNH PHÒNG CHƯA THANH TOÁN
                        if (ct.ttThanhToan !== 'Đã thanh toán' && ct.donGia && ct.ngayDen) {
                          const checkInDate = new Date(ct.ngayDen)
                          checkInDate.setHours(0, 0, 0, 0)

                          // Sử dụng ngày checkout đã đặt trước từ CtPhieuThue.ngayDi
                          const actualCheckOut = ct.ngayDi ?
                            new Date(ct.ngayDi) :
                            (checkOutData.actualCheckOut ? new Date(checkOutData.actualCheckOut) : new Date())
                          const checkOutDateOnly = new Date(actualCheckOut)
                          checkOutDateOnly.setHours(0, 0, 0, 0)

                          const soNgay = Math.max(1, Math.ceil((checkOutDateOnly - checkInDate) / (1000 * 60 * 60 * 24)))
                          totalRoomCharges += ct.donGia * soNgay
                        }
                      })
                    }
                    return totalRoomCharges + (rentalDetails.tongTienDichVu || 0) + (rentalDetails.tongTienPhuThu || 0)
                  })())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-out khách hàng</h1>
        <p className="text-gray-600 mt-2">Thực hiện check-out và thanh toán cho khách hàng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search and Guests List */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Khách đang lưu trú</h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => handleFilterChange('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'today'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hôm nay
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm theo tên, mã đặt phòng, SĐT..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input"
            />
          </div>

          {/* Guests List */}
          <div className="space-y-3">
            {(() => {
              const startIndex = (currentPage - 1) * itemsPerPage
              const endIndex = startIndex + itemsPerPage
              const currentGuests = filteredGuests.slice(startIndex, endIndex)

              return currentGuests.length > 0 ? (
                currentGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedGuest?.id === guest.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 cursor-pointer" onClick={() => handleSelectGuest(guest)}>
                        <h3 className="font-semibold text-gray-900">{guest.customerName}</h3>
                        <p className="text-sm text-gray-600">{guest.maPhieuThue}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">
                          Đang lưu trú
                        </span>
                        {guest.isOverdue && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full text-orange-600 bg-orange-100">
                            Quá hạn {guest.overdueStatus || `${guest.overdueDays} ngày`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 cursor-pointer" onClick={() => handleSelectGuest(guest)}>
                      <div>
                        <span className="font-medium">SĐT:</span> {guest.customerPhone}
                      </div>
                      <div>
                        <span className="font-medium">Check-in:</span> {guest.checkIn}
                      </div>
                      <div>
                        <span className="font-medium">Check-out dự kiến:</span> {guest.checkOut}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Không có khách nào đang lưu trú</p>
                </div>
              )
            })()}
          </div>

          {/* Pagination */}
          {filteredGuests.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>

              {Array.from({ length: Math.ceil(filteredGuests.length / itemsPerPage) }, (_, i) => (
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredGuests.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(filteredGuests.length / itemsPerPage)}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>

        {/* Check-out Form */}
        <div className="card">
          <div className="flex items-center mb-4">
            <UserX className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Thông tin check-out</h2>
          </div>

          {selectedGuest ? (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">Thông tin khách hàng</h3>
                  <button
                    onClick={() => fetchRentalDetails(selectedGuest.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Xem Chi Tiết
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Tên:</span> {selectedGuest.customerName}</div>
                  <div><span className="font-medium">SĐT:</span> {selectedGuest.customerPhone}</div>
                  <div><span className="font-medium">Email:</span> {selectedGuest.customerEmail || 'N/A'}</div>
                  <div><span className="font-medium">CCCD:</span> {selectedGuest.cccd || 'N/A'}</div>
                  <div><span className="font-medium">Số lượng phòng:</span> {selectedGuest.chiTietPhieuThue?.length || 0}</div>
                  <div><span className="font-medium">Check-in:</span> {selectedGuest.checkIn}</div>
                  <div><span className="font-medium">Check-out dự kiến:</span> {selectedGuest.checkOut}</div>
                  <div className="col-span-2">
                    <span className="font-medium text-green-600">Trạng thái:</span>
                    <span className="text-green-600 ml-2">Đang lưu trú</span>
                    {selectedGuest.isOverdue && (
                      <span className="text-orange-600 ml-2">
                        - Quá hạn {selectedGuest.overdueStatus || `${selectedGuest.overdueDays} ngày`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Phòng đã sử dụng</h3>
                {selectedGuest.chiTietPhieuThue && selectedGuest.chiTietPhieuThue.filter(ct => ct.ttThanhToan !== 'Đã thanh toán').length > 0 ? (
                  <div className="space-y-2">
                    {/* CHỈ HIỂN THỊ PHÒNG CHƯA THANH TOÁN */}
                    {sortRoomDetails(selectedGuest.chiTietPhieuThue.filter(ct => ct.ttThanhToan !== 'Đã thanh toán')).map((ct, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                        <div className="text-sm">
                          <span className="font-medium">Phòng {ct.soPhong}</span>
                          <span className="text-gray-600"> - {ct.tenKieuPhong} {ct.tenLoaiPhong}</span>
                          <div className="text-xs text-gray-500 mt-1">
                            Tầng {ct.tang} | {formatDate(ct.ngayDen)} - {formatDate(ct.ngayDi)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Đơn giá: {ct.donGia?.toLocaleString('vi-VN')} VNĐ/đêm
                          </div>
                          <div className="text-xs text-gray-500">
                            Số ngày: {(() => {
                              if (ct.ngayDen) {
                                const checkInDate = new Date(ct.ngayDen)
                                checkInDate.setHours(0, 0, 0, 0)

                                // Sử dụng ngày checkout đã đặt trước từ CtPhieuThue.ngayDi
                                const actualCheckOut = ct.ngayDi ?
                                  new Date(ct.ngayDi) :
                                  (checkOutData.actualCheckOut ? new Date(checkOutData.actualCheckOut) : new Date())
                                const checkOutDateOnly = new Date(actualCheckOut)
                                checkOutDateOnly.setHours(0, 0, 0, 0)

                                // Chỉ tính thêm ngày khi qua ngày mới (sau 00:00)
                                return Math.max(1, Math.ceil((checkOutDateOnly - checkInDate) / (1000 * 60 * 60 * 24)))
                              }
                              return 1
                            })()} ngày
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {(() => {
                              if (ct.donGia && ct.ngayDen) {
                                const checkInDate = new Date(ct.ngayDen)
                                checkInDate.setHours(0, 0, 0, 0)

                                // Sử dụng ngày checkout đã đặt trước từ CtPhieuThue.ngayDi
                                const actualCheckOut = ct.ngayDi ?
                                  new Date(ct.ngayDi) :
                                  (checkOutData.actualCheckOut ? new Date(checkOutData.actualCheckOut) : new Date())
                                const checkOutDateOnly = new Date(actualCheckOut)
                                checkOutDateOnly.setHours(0, 0, 0, 0)

                                // Chỉ tính thêm ngày khi qua ngày mới (sau 00:00)
                                const soNgay = Math.max(1, Math.ceil((checkOutDateOnly - checkInDate) / (1000 * 60 * 60 * 24)))
                                const thanhTien = ct.donGia * soNgay
                                return thanhTien.toLocaleString('vi-VN')
                              }
                              return (ct.donGia || 0).toLocaleString('vi-VN')
                            })()} VNĐ
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            ct.ttThanhToan === 'Đã thanh toán'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ct.ttThanhToan}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Không có thông tin phòng</p>
                  </div>
                )}
              </div>

              {/* Services and Surcharges Details - Show when unpaid data is available */}
              {selectedGuest.chiTietPhieuThue && selectedGuest.chiTietPhieuThue
                .filter(ct => ct.ttThanhToan !== 'Đã thanh toán') // Chỉ xét phòng chưa thanh toán
                .some(ct =>
                  (ct.danhSachDichVu && ct.danhSachDichVu.some(dv => dv.ttThanhToan !== 'Đã thanh toán')) ||
                  (ct.danhSachPhuThu && ct.danhSachPhuThu.some(pt => pt.ttThanhToan !== 'Đã thanh toán'))
                ) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Chi tiết dịch vụ & phụ thu</h3>
                  {sortRoomDetails(selectedGuest.chiTietPhieuThue.filter(ct => ct.ttThanhToan !== 'Đã thanh toán')).map((ct, ctIndex) => (
                    <div key={ctIndex} className="mb-4">
                      {/* Services - chỉ hiển thị dịch vụ chưa thanh toán */}
                      {ct.danhSachDichVu && ct.danhSachDichVu.filter(dv => dv.ttThanhToan !== 'Đã thanh toán').length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Phòng {ct.soPhong}:</h4>
                          <p className="text-xs text-blue-600 font-medium mb-1">Dịch vụ:</p>
                          {ct.danhSachDichVu.filter(dv => dv.ttThanhToan !== 'Đã thanh toán')
                            .map((dv, dvIndex) => (
                            <div key={dvIndex} className="flex justify-between text-xs bg-white p-2 rounded mb-1">
                              <div>
                                <span className="font-medium">{dv.tenDv}</span>
                                <span className="text-gray-500 ml-2">
                                  {dv.soLuong} x {dv.donGia?.toLocaleString('vi-VN')} VNĐ
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{dv.thanhTien?.toLocaleString('vi-VN')} VNĐ</div>
                                <div className="text-xs px-1 rounded bg-yellow-100 text-yellow-800">
                                  {dv.ttThanhToan}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Surcharges - chỉ hiển thị phụ thu chưa thanh toán */}
                      {ct.danhSachPhuThu && ct.danhSachPhuThu.filter(pt => pt.ttThanhToan !== 'Đã thanh toán').length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-red-600 font-medium mb-1">Phụ thu:</p>
                          {ct.danhSachPhuThu.filter(pt => pt.ttThanhToan !== 'Đã thanh toán')
                            .map((pt, ptIndex) => (
                            <div key={ptIndex} className="flex justify-between text-xs bg-white p-2 rounded mb-1">
                              <div>
                                <span className="font-medium">{pt.tenPhuThu}</span>
                                <span className="text-gray-500 ml-2">
                                  {pt.soLuong} x {pt.donGia?.toLocaleString('vi-VN')} VNĐ
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{pt.thanhTien?.toLocaleString('vi-VN')} VNĐ</div>
                                <div className="text-xs px-1 rounded bg-yellow-100 text-yellow-800">
                                  {pt.ttThanhToan}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Promotion Selector */}
              <PromotionSelector
                selectedGuest={selectedGuest}
                onPromotionChange={handlePromotionChange}
                loading={loading}
                disabled={manualDiscountData.hasManualDiscount}
                disabledReason="Đã có giảm giá thủ công"
              />

              {/* Manual Discount Selector */}
              <ManualDiscountSelector
                selectedGuest={selectedGuest}
                onDiscountChange={handleManualDiscountChange}
                loading={loading}
                disabled={promotionData.totalDiscount > 0}
                currentBill={bill}
              />

              {/* Check-out Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian check-out thực tế
                  </label>
                  <input
                    type="datetime-local"
                    value={checkOutData.actualCheckOut}
                    onChange={(e) => setCheckOutData(prev => ({ ...prev, actualCheckOut: e.target.value }))}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={checkOutData.paymentMethod}
                    onChange={(e) => setCheckOutData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="input"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="transfer">Chuyển khoản</option>
                  </select>
                </div>
              </div>

              {/* Invoice Component */}
              <InvoiceComponent
                selectedGuest={selectedGuest}
                bill={bill}
                promotionData={promotionData}
                checkOutData={checkOutData}
                onCheckOut={handleCheckOut}
                onCancel={() => setSelectedGuest(null)}
                loading={loading}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn khách để check-out
              </h3>
              <p className="text-gray-500">
                Tìm kiếm và chọn khách hàng từ danh sách bên trái
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Invoice Modal */}
      <DetailedInvoiceModal
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        invoice={invoice}
        selectedGuest={selectedGuest}
        bill={bill}
        checkOutData={checkOutData}
      />
      <RentalDetailsModal />
    </div>
  )
}
export default CheckOutPage
