// Thông tin khách sạn
export const HOTEL_INFO = {
  name: 'KHÁCH SẠN HOTEL BOOKING',
  address: '97 Man Thiện, Hiệp Phú, Thủ Đức, Hồ Chí Minh',
  phone: '0563560789',
  email: 'info@hotelbooking.com',
  website: 'www.hotelbooking.com',
  logo: '/images/hotel-logo.png', // Đường dẫn đến logo
  taxCode: '0123456789', // Mã số thuế
  bankInfo: {
    bankName: 'MB Bank',
    accountNumber: '0818181948',
    accountName: 'KHÁCH SẠN HOTEL BOOKING'
  }
}

// Trạng thái hóa đơn
export const INVOICE_STATUS = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
  PARTIAL: 'Thanh toán một phần'
}

// Phương thức thanh toán
export const PAYMENT_METHODS = {
  CASH: 'cash',
  TRANSFER: 'transfer',
  CARD: 'card'
}

// Trạng thái phiếu đặt (chỉ còn 3 trạng thái)
export const BOOKING_STATUS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Xác nhận',
  CANCELLED: 'Đã hủy'
}

// Frontend status mapping (cho UI components)
export const BOOKING_STATUS_FRONTEND = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
}

// Map backend status to frontend status
export const mapBackendStatusToFrontend = (backendStatus) => {
  switch (backendStatus) {
    case 'Chờ xác nhận': return 'pending'
    case 'Xác nhận': return 'confirmed'
    case 'Đã hủy': return 'cancelled'

    default: return 'pending'
  }
}

// Map frontend status to backend status
export const mapFrontendStatusToBackend = (frontendStatus) => {
  switch (frontendStatus) {
    case 'pending': return 'Chờ xác nhận'
    case 'confirmed': return 'Xác nhận'
    case 'cancelled': return 'Đã hủy'
    default: return 'Chờ xác nhận'
  }
}

// Get status color for UI
export const getBookingStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'text-blue-600 bg-blue-100'
    case 'pending': return 'text-yellow-600 bg-yellow-100'
    case 'cancelled': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

// Get status text for display
export const getBookingStatusText = (status) => {
  switch (status) {
    case 'confirmed': return 'Xác nhận'
    case 'pending': return 'Chờ xác nhận'
    case 'cancelled': return 'Đã hủy'
    default: return 'Không xác định'
  }
}

// Get status icon
export const getBookingStatusIcon = (status) => {
  switch (status) {
    case 'confirmed': return 'CheckCircle'
    case 'pending': return 'Clock'
    case 'cancelled': return 'XCircle'
    default: return 'AlertCircle'
  }
}

// Nhãn phương thức thanh toán
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Tiền mặt',
  [PAYMENT_METHODS.TRANSFER]: 'Chuyển khoản',
  [PAYMENT_METHODS.CARD]: 'Thẻ tín dụng'
}
