package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.service.interfac.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private IReportService reportService;

    @GetMapping
    public ResponseEntity<Response> getReport(
            @RequestParam String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        
        Response response;
        
        switch (type.toLowerCase()) {
            case "booking":
                response = reportService.getBookingReport(startDate, endDate, status);
                break;
            case "revenue":
                response = reportService.getRevenueReport(startDate, endDate);
                break;
            case "occupancy":
                response = reportService.getOccupancyReport(startDate, endDate);
                break;
            case "customer":
                response = reportService.getCustomerReport(startDate, endDate);
                break;
            case "staff":
                response = reportService.getStaffReport(startDate, endDate);
                break;
            default:
                response = new Response();
                response.setStatusCode(400);
                response.setMessage("Loại báo cáo không hợp lệ: " + type);
        }
        
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/booking")
    public ResponseEntity<Response> getBookingReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        
        Response response = reportService.getBookingReport(startDate, endDate, status);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/booking/export")
    public ResponseEntity<Response> exportBookingReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "pdf") String format) {
        
        Response response = reportService.exportBookingReport(startDate, endDate, status, format);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
