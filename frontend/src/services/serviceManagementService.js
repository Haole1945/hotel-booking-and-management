import { api } from './api'

const serviceManagementService = {
  // Get all services
  getAllDichVu: async () => {
    try {
      const response = await api.get('/api/services/dich-vu')
      return response.data
    } catch (error) {
      console.error('Error getting all services:', error)
      throw error
    }
  },

  // Get all surcharges
  getAllPhuThu: async () => {
    try {
      const response = await api.get('/api/services/phu-thu')
      return response.data
    } catch (error) {
      console.error('Error getting all surcharges:', error)
      throw error
    }
  },

  // Create new service
  createDichVu: async (dichVuData) => {
    try {
      const response = await api.post('/api/services/dich-vu', dichVuData)
      return response.data
    } catch (error) {
      console.error('Error creating service:', error)
      throw error
    }
  },

  // Service usage management APIs
  getAllServiceUsage: async () => {
    try {
      const response = await api.get('/api/service-management/services/all')
      return response.data
    } catch (error) {
      console.error('Error getting all service usage:', error)
      throw error
    }
  },

  getCurrentActiveServices: async () => {
    try {
      const response = await api.get('/api/service-management/services/current-active')
      return response.data
    } catch (error) {
      console.error('Error getting current active services:', error)
      throw error
    }
  },

  getServiceUsageByRoom: async (soPhong) => {
    try {
      const response = await api.get(`/api/service-management/services/by-room/${soPhong}`)
      return response.data
    } catch (error) {
      console.error('Error getting service usage by room:', error)
      throw error
    }
  },

  getServiceUsageByCustomer: async (cccd) => {
    try {
      const response = await api.get(`/api/service-management/services/by-customer/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error getting service usage by customer:', error)
      throw error
    }
  },

  // Surcharge usage management APIs
  getAllSurchargeUsage: async () => {
    try {
      const response = await api.get('/api/service-management/surcharges/all')
      return response.data
    } catch (error) {
      console.error('Error getting all surcharge usage:', error)
      throw error
    }
  },

  getCurrentActiveSurcharges: async () => {
    try {
      const response = await api.get('/api/service-management/surcharges/current-active')
      return response.data
    } catch (error) {
      console.error('Error getting current active surcharges:', error)
      throw error
    }
  },

  getSurchargeUsageByRoom: async (soPhong) => {
    try {
      const response = await api.get(`/api/service-management/surcharges/by-room/${soPhong}`)
      return response.data
    } catch (error) {
      console.error('Error getting surcharge usage by room:', error)
      throw error
    }
  },

  getSurchargeUsageByCustomer: async (cccd) => {
    try {
      const response = await api.get(`/api/service-management/surcharges/by-customer/${cccd}`)
      return response.data
    } catch (error) {
      console.error('Error getting surcharge usage by customer:', error)
      throw error
    }
  },

  // Combined reports
  getServiceAndSurchargeReport: async () => {
    try {
      const response = await api.get('/api/service-management/report')
      return response.data
    } catch (error) {
      console.error('Error getting service and surcharge report:', error)
      throw error
    }
  },

  getCurrentActiveBookingsWithServices: async () => {
    try {
      const response = await api.get('/api/service-management/current-bookings-with-services')
      return response.data
    } catch (error) {
      console.error('Error getting current bookings with services:', error)
      throw error
    }
  },

  getRevenueByServiceAndSurcharge: async () => {
    try {
      const response = await api.get('/api/service-management/revenue')
      return response.data
    } catch (error) {
      console.error('Error getting revenue by service and surcharge:', error)
      throw error
    }
  },

  // Combined dashboard API - gets all data in one call
  getDashboardData: async () => {
    try {
      const response = await api.get('/api/service-management/dashboard')
      return response.data
    } catch (error) {
      console.error('Error getting dashboard data:', error)
      throw error
    }
  },

  // Add service to booking
  addServiceToBooking: async (idCtPt, idDv, soLuong) => {
    try {
      const response = await api.post('/api/service-management/add-service', null, {
        params: {
          idCtPt,
          idDv,
          soLuong
        }
      })
      return response.data
    } catch (error) {
      console.error('Error adding service to booking:', error)
      throw error
    }
  },

  // Add surcharge to booking
  addSurchargeToBooking: async (idCtPt, idPhuThu, soLuong) => {
    try {
      const response = await api.post('/api/service-management/add-surcharge', null, {
        params: {
          idCtPt,
          idPhuThu,
          soLuong
        }
      })
      return response.data
    } catch (error) {
      console.error('Error adding surcharge to booking:', error)
      throw error
    }
  },

  // Update service payment status
  updateServicePaymentStatus: async (idCtPt, idDv, newStatus) => {
    try {
      const response = await api.put('/api/service-management/update-service-payment', null, {
        params: {
          idCtPt,
          idDv,
          newStatus
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating service payment status:', error)
      throw error
    }
  },

  // Update surcharge payment status
  updateSurchargePaymentStatus: async (idPhuThu, idCtPt, newStatus) => {
    try {
      const response = await api.put('/api/service-management/update-surcharge-payment', null, {
        params: {
          idPhuThu,
          idCtPt,
          newStatus
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating surcharge payment status:', error)
      throw error
    }
  },

  // Update room payment status
  updateRoomPaymentStatus: async (idCtPt, newStatus) => {
    try {
      const response = await api.put('/api/service-management/update-room-payment', null, {
        params: {
          idCtPt,
          newStatus
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating room payment status:', error)
      throw error
    }
  },

  // Delete service from booking
  deleteServiceFromBooking: async (idCtPt, idDv) => {
    try {
      const response = await api.delete('/api/service-management/delete-service', {
        params: {
          idCtPt,
          idDv
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting service from booking:', error)
      throw error
    }
  },

  // Delete surcharge from booking
  deleteSurchargeFromBooking: async (idPhuThu, idCtPt) => {
    try {
      const response = await api.delete('/api/service-management/delete-surcharge', {
        params: {
          idPhuThu,
          idCtPt
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting surcharge from booking:', error)
      throw error
    }
  },

  // Create new surcharge
  createPhuThu: async (phuThuData) => {
    try {
      const response = await api.post('/api/services/phu-thu', phuThuData)
      return response.data
    } catch (error) {
      console.error('Error creating surcharge:', error)
      throw error
    }
  },

  // Update service
  updateDichVu: async (id, dichVuData) => {
    try {
      const response = await api.put(`/api/services/dich-vu/${id}`, dichVuData)
      return response.data
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  },

  // Update surcharge
  updatePhuThu: async (id, phuThuData) => {
    try {
      const response = await api.put(`/api/services/phu-thu/${id}`, phuThuData)
      return response.data
    } catch (error) {
      console.error('Error updating surcharge:', error)
      throw error
    }
  },

  // Delete service
  deleteDichVu: async (id) => {
    try {
      const response = await api.delete(`/api/services/dich-vu/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  },

  // Delete surcharge
  deletePhuThu: async (id) => {
    try {
      const response = await api.delete(`/api/services/phu-thu/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting surcharge:', error)
      throw error
    }
  },

  // Update service price
  updateServicePrice: async (idDv, price) => {
    try {
      const response = await api.put(`/api/services/dich-vu/${idDv}/price`, { price })
      return response.data
    } catch (error) {
      console.error('Error updating service price:', error)
      throw error
    }
  },

  // Update surcharge price
  updateSurchargePrice: async (idPhuThu, price) => {
    try {
      const response = await api.put(`/api/services/phu-thu/${idPhuThu}/price`, { price })
      return response.data
    } catch (error) {
      console.error('Error updating surcharge price:', error)
      throw error
    }
  }
}

export default serviceManagementService
