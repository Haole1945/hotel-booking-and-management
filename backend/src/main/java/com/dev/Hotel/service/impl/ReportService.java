package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.BookingReportDTO;
import com.dev.Hotel.dto.BookingReportSummaryDTO;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.repo.BookingReportRepository;
import com.dev.Hotel.service.interfac.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService implements IReportService {

    @Autowired
    private BookingReportRepository bookingReportRepository;

    @Override
    public Response getBookingReport(LocalDate startDate, LocalDate endDate, String status) {
        Response response = new Response();
        try {
            // Get detailed booking data
            List<BookingReportDTO> bookingDetails = bookingReportRepository.getBookingReportDetails(startDate, endDate, status);
            
            // Get summary data
            BookingReportSummaryDTO summary = bookingReportRepository.getBookingReportSummary(startDate, endDate, status);
            
            // Prepare response data
            Map<String, Object> reportData = new HashMap<>();
            reportData.put("details", bookingDetails);
            reportData.put("summary", summary);
            reportData.put("startDate", startDate);
            reportData.put("endDate", endDate);
            reportData.put("status", status);
            reportData.put("totalRecords", bookingDetails.size());
            
            response.setStatusCode(200);
            response.setMessage("Báo cáo đặt phòng được tạo thành công");
            response.setData(reportData);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo đặt phòng: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public Response exportBookingReport(LocalDate startDate, LocalDate endDate, String status, String format) {
        Response response = new Response();
        try {
            // For now, return the same data as getBookingReport
            // In a real implementation, you would generate PDF/Excel files here
            response = getBookingReport(startDate, endDate, status);
            
            if (response.getStatusCode() == 200) {
                Map<String, Object> exportData = new HashMap<>();
                exportData.put("format", format);
                exportData.put("filename", "booking_report_" + startDate + "_to_" + endDate + "." + format);
                exportData.put("reportData", response.getData());
                
                response.setData(exportData);
                response.setMessage("Báo cáo đặt phòng sẵn sàng xuất file " + format.toUpperCase());
            }
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi xuất báo cáo đặt phòng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getRevenueReport(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            // Placeholder for revenue report
            Map<String, Object> revenueData = new HashMap<>();
            revenueData.put("message", "Báo cáo doanh thu đang được phát triển");
            revenueData.put("startDate", startDate);
            revenueData.put("endDate", endDate);
            
            response.setStatusCode(200);
            response.setMessage("Báo cáo doanh thu");
            response.setData(revenueData);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo doanh thu: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getOccupancyReport(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            // Placeholder for occupancy report
            Map<String, Object> occupancyData = new HashMap<>();
            occupancyData.put("message", "Báo cáo tỷ lệ lấp đầy đang được phát triển");
            occupancyData.put("startDate", startDate);
            occupancyData.put("endDate", endDate);
            
            response.setStatusCode(200);
            response.setMessage("Báo cáo tỷ lệ lấp đầy");
            response.setData(occupancyData);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo tỷ lệ lấp đầy: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getCustomerReport(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            // Placeholder for customer report
            Map<String, Object> customerData = new HashMap<>();
            customerData.put("message", "Báo cáo khách hàng đang được phát triển");
            customerData.put("startDate", startDate);
            customerData.put("endDate", endDate);
            
            response.setStatusCode(200);
            response.setMessage("Báo cáo khách hàng");
            response.setData(customerData);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo khách hàng: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getStaffReport(LocalDate startDate, LocalDate endDate) {
        Response response = new Response();
        try {
            // Placeholder for staff report
            Map<String, Object> staffData = new HashMap<>();
            staffData.put("message", "Báo cáo nhân viên đang được phát triển");
            staffData.put("startDate", startDate);
            staffData.put("endDate", endDate);
            
            response.setStatusCode(200);
            response.setMessage("Báo cáo nhân viên");
            response.setData(staffData);
            
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tạo báo cáo nhân viên: " + e.getMessage());
        }
        return response;
    }
}
