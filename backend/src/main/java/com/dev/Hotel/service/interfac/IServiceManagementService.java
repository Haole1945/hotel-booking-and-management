package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;

public interface IServiceManagementService {
    
    // Service usage management
    Response getAllServiceUsage();
    Response getCurrentActiveServices();
    Response getServiceUsageByRoom(String soPhong);
    Response getServiceUsageByCustomer(String cccd);
    Response getServiceUsageByDate(String startDate, String endDate);
    
    // Surcharge usage management
    Response getAllSurchargeUsage();
    Response getCurrentActiveSurcharges();
    Response getSurchargeUsageByRoom(String soPhong);
    Response getSurchargeUsageByCustomer(String cccd);
    
    // Combined reports
    Response getServiceAndSurchargeReport();
    Response getCurrentActiveBookingsWithServices();
    Response getRevenueByServiceAndSurcharge();

    // Dashboard data - all in one call
    Response getDashboardData();

    // Add service/surcharge to booking
    Response addServiceToBooking(Integer idCtPt, String idDv, Integer soLuong);
    Response addSurchargeToBooking(Integer idCtPt, String idPhuThu, Integer soLuong);

    // Update payment status
    Response updateServicePaymentStatus(Integer idCtPt, String idDv, String newStatus);
    Response updateSurchargePaymentStatus(String idPhuThu, Integer idCtPt, String newStatus);
    Response updateRoomPaymentStatus(Integer idCtPt, String newStatus);

    // Delete service/surcharge
    Response deleteServiceFromBooking(Integer idCtPt, String idDv);
    Response deleteSurchargeFromBooking(String idPhuThu, Integer idCtPt);
}
