// Format date to Vietnamese format
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// Format date and time to Vietnamese format
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// Format currency to Vietnamese format
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A'
  
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  } catch (error) {
    return `${amount} VND`
  }
}

// Format number with thousand separators
export const formatNumber = (number) => {
  if (!number && number !== 0) return 'N/A'
  
  try {
    return new Intl.NumberFormat('vi-VN').format(number)
  } catch (error) {
    return number.toString()
  }
}

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A'
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as Vietnamese phone number
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
  }
  
  return phone
}

// Format CCCD/CMND
export const formatCCCD = (cccd) => {
  if (!cccd) return 'N/A'
  
  // Remove all non-digit characters
  const cleaned = cccd.replace(/\D/g, '')
  
  // Format as CCCD (12 digits) or CMND (9 digits)
  if (cleaned.length === 12) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{6})/, '$1 $2 $3')
  } else if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  return cccd
}

// Calculate days between two dates
export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  } catch (error) {
    return 0
  }
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text) return 'N/A'
  
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength) + '...'
}

// Format status text
export const formatStatus = (status) => {
  if (!status) return 'N/A'
  
  const statusMap = {
    'active': 'Đang hoạt động',
    'inactive': 'Không hoạt động',
    'pending': 'Chờ xử lý',
    'confirmed': 'Xác nhận',
    'cancelled': 'Đã hủy',
    'completed': 'Hoàn thành',
    'checked_in': 'Đã nhận phòng',
    'checked_out': 'Đã trả phòng',
    'available': 'Có sẵn',
    'occupied': 'Đang sử dụng',
    'maintenance': 'Bảo trì',
    'cleaning': 'Đang dọn dẹp'
  }
  
  return statusMap[status.toLowerCase()] || status
}
