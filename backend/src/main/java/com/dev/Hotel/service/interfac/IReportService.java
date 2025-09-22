package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import java.time.LocalDate;

public interface IReportService {
    
    // Booking reports
    Response getBookingReport(LocalDate startDate, LocalDate endDate, String status);
    Response exportBookingReport(LocalDate startDate, LocalDate endDate, String status, String format);
    
    // Revenue reports
    Response getRevenueReport(LocalDate startDate, LocalDate endDate);
    
    // Occupancy reports
    Response getOccupancyReport(LocalDate startDate, LocalDate endDate);
    
    // Customer reports
    Response getCustomerReport(LocalDate startDate, LocalDate endDate);
    
    // Staff reports
    Response getStaffReport(LocalDate startDate, LocalDate endDate);
}
