package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.service.interfac.IServiceManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service-management")
@CrossOrigin(origins = "*")
public class ServiceManagementController {

    @Autowired
    private IServiceManagementService serviceManagementService;

    // Service usage endpoints
    @GetMapping("/services/all")
    public ResponseEntity<Response> getAllServiceUsage() {
        Response response = serviceManagementService.getAllServiceUsage();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/services/current-active")
    public ResponseEntity<Response> getCurrentActiveServices() {
        Response response = serviceManagementService.getCurrentActiveServices();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/services/by-room/{soPhong}")
    public ResponseEntity<Response> getServiceUsageByRoom(@PathVariable String soPhong) {
        Response response = serviceManagementService.getServiceUsageByRoom(soPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/services/by-customer/{cccd}")
    public ResponseEntity<Response> getServiceUsageByCustomer(@PathVariable String cccd) {
        Response response = serviceManagementService.getServiceUsageByCustomer(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/services/by-date")
    public ResponseEntity<Response> getServiceUsageByDate(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        Response response = serviceManagementService.getServiceUsageByDate(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Surcharge usage endpoints
    @GetMapping("/surcharges/all")
    public ResponseEntity<Response> getAllSurchargeUsage() {
        Response response = serviceManagementService.getAllSurchargeUsage();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/surcharges/current-active")
    public ResponseEntity<Response> getCurrentActiveSurcharges() {
        Response response = serviceManagementService.getCurrentActiveSurcharges();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/surcharges/by-room/{soPhong}")
    public ResponseEntity<Response> getSurchargeUsageByRoom(@PathVariable String soPhong) {
        Response response = serviceManagementService.getSurchargeUsageByRoom(soPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/surcharges/by-customer/{cccd}")
    public ResponseEntity<Response> getSurchargeUsageByCustomer(@PathVariable String cccd) {
        Response response = serviceManagementService.getSurchargeUsageByCustomer(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Combined reports
    @GetMapping("/report")
    public ResponseEntity<Response> getServiceAndSurchargeReport() {
        Response response = serviceManagementService.getServiceAndSurchargeReport();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/current-bookings-with-services")
    public ResponseEntity<Response> getCurrentActiveBookingsWithServices() {
        Response response = serviceManagementService.getCurrentActiveBookingsWithServices();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/revenue")
    public ResponseEntity<Response> getRevenueByServiceAndSurcharge() {
        Response response = serviceManagementService.getRevenueByServiceAndSurcharge();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<Response> testEndpoint() {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Service Management API is working!");
        return ResponseEntity.ok(response);
    }

    // Combined endpoint to get all data in one call
    @GetMapping("/dashboard")
    public ResponseEntity<Response> getDashboardData() {
        Response response = serviceManagementService.getDashboardData();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Add service to booking
    @PostMapping("/add-service")
    public ResponseEntity<Response> addServiceToBooking(
            @RequestParam Integer idCtPt,
            @RequestParam String idDv,
            @RequestParam Integer soLuong) {
        Response response = serviceManagementService.addServiceToBooking(idCtPt, idDv, soLuong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Add surcharge to booking
    @PostMapping("/add-surcharge")
    public ResponseEntity<Response> addSurchargeToBooking(
            @RequestParam Integer idCtPt,
            @RequestParam String idPhuThu,
            @RequestParam Integer soLuong) {
        Response response = serviceManagementService.addSurchargeToBooking(idCtPt, idPhuThu, soLuong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Update service payment status
    @PutMapping("/update-service-payment")
    public ResponseEntity<Response> updateServicePaymentStatus(
            @RequestParam Integer idCtPt,
            @RequestParam String idDv,
            @RequestParam String newStatus) {
        Response response = serviceManagementService.updateServicePaymentStatus(idCtPt, idDv, newStatus);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Update surcharge payment status
    @PutMapping("/update-surcharge-payment")
    public ResponseEntity<Response> updateSurchargePaymentStatus(
            @RequestParam String idPhuThu,
            @RequestParam Integer idCtPt,
            @RequestParam String newStatus) {
        Response response = serviceManagementService.updateSurchargePaymentStatus(idPhuThu, idCtPt, newStatus);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Update room payment status
    @PutMapping("/update-room-payment")
    public ResponseEntity<Response> updateRoomPaymentStatus(
            @RequestParam Integer idCtPt,
            @RequestParam String newStatus) {
        Response response = serviceManagementService.updateRoomPaymentStatus(idCtPt, newStatus);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Delete service from booking
    @DeleteMapping("/delete-service")
    public ResponseEntity<Response> deleteServiceFromBooking(
            @RequestParam Integer idCtPt,
            @RequestParam String idDv) {
        Response response = serviceManagementService.deleteServiceFromBooking(idCtPt, idDv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Delete surcharge from booking
    @DeleteMapping("/delete-surcharge")
    public ResponseEntity<Response> deleteSurchargeFromBooking(
            @RequestParam String idPhuThu,
            @RequestParam Integer idCtPt) {
        Response response = serviceManagementService.deleteSurchargeFromBooking(idPhuThu, idCtPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
