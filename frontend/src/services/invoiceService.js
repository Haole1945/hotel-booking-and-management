import { api } from './api'

export const invoiceService = {
  // Get all invoices
  getAllInvoices: async () => {
    try {
      const response = await api.get('/api/hoa-don/all')
      return response.data
    } catch (error) {
      console.error('Error fetching all invoices:', error)
      throw error
    }
  },

  // Get invoice by ID
  getInvoiceById: async (idHd) => {
    try {
      const response = await api.get(`/api/hoa-don/get-by-id/${idHd}`)
      return response.data
    } catch (error) {
      console.error('Error fetching invoice by ID:', error)
      throw error
    }
  },

  // Create invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post('/api/hoa-don/create', invoiceData)
      return response.data
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  },

  // Create invoice from checkout
  createInvoiceFromCheckout: async (idPt) => {
    try {
      const response = await api.post(`/api/hoa-don/create-from-checkout/${idPt}`)
      return response.data
    } catch (error) {
      console.error('Error creating invoice from checkout:', error)
      throw error
    }
  },

  // Get invoice by rental ID
  getInvoiceByRental: async (idPt) => {
    try {
      const response = await api.get(`/api/hoa-don/by-phieu-thue/${idPt}`)
      return response.data
    } catch (error) {
      console.error('Error fetching invoice by rental:', error)
      throw error
    }
  },

  // Update invoice status
  updateInvoiceStatus: async (idHd, trangThai) => {
    try {
      const response = await api.put(`/api/hoa-don/update-status/${idHd}?trangThai=${trangThai}`)
      return response.data
    } catch (error) {
      console.error('Error updating invoice status:', error)
      throw error
    }
  },

  // Delete invoice
  deleteInvoice: async (idHd) => {
    try {
      const response = await api.delete(`/api/hoa-don/delete/${idHd}`)
      return response.data
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  },

  // Print invoice (generate PDF or print-friendly format)
  printInvoice: async (idHd) => {
    try {
      const response = await api.get(`/api/hoa-don/print/${idHd}`, {
        responseType: 'blob' // For PDF download
      })
      return response.data
    } catch (error) {
      console.error('Error printing invoice:', error)
      throw error
    }
  },

  // Export invoice to PDF
  exportInvoiceToPDF: async (invoiceData) => {
    try {
      // This will generate a PDF blob that can be downloaded
      const response = await api.post('/api/hoa-don/export-pdf', invoiceData, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting invoice to PDF:', error)
      throw error
    }
  },

  // API MỚI: Lấy chi tiết hóa đơn - chỉ hiển thị items đã thanh toán (có ID_HD)
  getInvoiceDetails: async (idHd) => {
    try {
      const response = await api.get(`/api/hoa-don/details/${idHd}`)
      return response.data
    } catch (error) {
      console.error('Error fetching invoice details:', error)
      throw error
    }
  },

  // API MỚI: Tạo hóa đơn từ checkout với ngày checkout (bao gồm cả checkout process)
  createInvoiceFromCheckoutWithDate: async (rentalId, actualCheckOutDate) => {
    try {
      const response = await api.post(`/api/hoa-don/create-from-checkout/${rentalId}?actualCheckOut=${actualCheckOutDate}`)
      return response.data
    } catch (error) {
      console.error('Error creating invoice from checkout with date:', error)
      throw error
    }
  },

  // API MỚI: Tạo hóa đơn từ checkout với khuyến mãi
  createInvoiceFromCheckoutWithPromotions: async (rentalId, actualCheckOutDate, promotionDiscount) => {
    try {
      let url = `/api/hoa-don/create-from-checkout-with-promotions/${rentalId}`
      const params = new URLSearchParams()

      if (actualCheckOutDate) {
        params.append('actualCheckOut', actualCheckOutDate)
      }
      if (promotionDiscount && promotionDiscount > 0) {
        params.append('promotionDiscount', promotionDiscount.toString())
      }

      if (params.toString()) {
        url += '?' + params.toString()
      }

      const response = await api.post(url)
      return response.data
    } catch (error) {
      console.error('Error creating invoice from checkout with promotions:', error)
      throw error
    }
  },

  // Get invoices by date range
  getInvoicesByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/api/hoa-don/by-date-range?startDate=${startDate}&endDate=${endDate}`)
      return response.data
    } catch (error) {
      console.error('Error fetching invoices by date range:', error)
      throw error
    }
  },

  // Get invoices by status
  getInvoicesByStatus: async (trangThai) => {
    try {
      const response = await api.get(`/api/hoa-don/by-status?trangThai=${trangThai}`)
      return response.data
    } catch (error) {
      console.error('Error fetching invoices by status:', error)
      throw error
    }
  }
}
