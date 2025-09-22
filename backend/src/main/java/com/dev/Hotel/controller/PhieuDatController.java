package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.CreateBookingRequest;
import com.dev.Hotel.dto.CreateBookingAtReceptionRequest;
import com.dev.Hotel.dto.UpdateBookingRequest;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.service.interfac.IPhieuDatService;
import com.dev.Hotel.service.impl.PhieuDatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/phieu-dat")
@CrossOrigin(origins = "*")
public class PhieuDatController {

    @Autowired
    private IPhieuDatService phieuDatService;

    @Autowired
    private PhieuDatService phieuDatServiceImpl;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllPhieuDat() {
        Response response = phieuDatService.getAllPhieuDat();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{idPd}")
    public ResponseEntity<Response> getPhieuDatById(@PathVariable("idPd") Integer idPd) {
        Response response = phieuDatService.getPhieuDatById(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Response> createPhieuDat(@RequestBody PhieuDat phieuDat) {
        Response response = phieuDatService.createPhieuDat(phieuDat);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create-at-reception")
    public ResponseEntity<Response> createBookingAtReception(@RequestBody CreateBookingAtReceptionRequest request) {
        Response response = phieuDatService.createBookingAtReception(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{idPd}")
    public ResponseEntity<Response> updatePhieuDat(@PathVariable("idPd") Integer idPd, @RequestBody PhieuDat phieuDat) {
        Response response = phieuDatService.updatePhieuDat(idPd, phieuDat);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{idPd}")
   
    public ResponseEntity<Response> deletePhieuDat(@PathVariable("idPd") Integer idPd) {
        Response response = phieuDatService.deletePhieuDat(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/khach-hang/{cccd}")
  
    public ResponseEntity<Response> getPhieuDatByKhachHang(@PathVariable("cccd") String cccd) {
        Response response = phieuDatService.getPhieuDatByKhachHang(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/nhan-vien/{idNv}")

    public ResponseEntity<Response> getPhieuDatByNhanVien(@PathVariable("idNv") String idNv) {
        Response response = phieuDatService.getPhieuDatByNhanVien(idNv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<Response> getPhieuDatByTrangThai(@PathVariable("trangThai") String trangThai) {
        Response response = phieuDatService.getPhieuDatByTrangThai(trangThai);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/date-range")
    public ResponseEntity<Response> getPhieuDatByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response response = phieuDatService.getPhieuDatByDateRange(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/confirm/{idPd}")
    public ResponseEntity<Response> confirmBooking(@PathVariable("idPd") Integer idPd) {
        Response response = phieuDatService.confirmBooking(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/cancel/{idPd}")
    public ResponseEntity<Response> cancelBooking(@PathVariable("idPd") Integer idPd,
            @RequestParam("reason") String reason) {
        Response response = phieuDatService.cancelBooking(idPd, reason);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update-status/{idPd}")
    public ResponseEntity<Response> updateBookingStatus(@PathVariable("idPd") Integer idPd,
            @RequestParam("trangThai") String trangThai) {
        Response response = phieuDatService.updateBookingStatus(idPd, trangThai);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update-simple/{idPd}")
    public ResponseEntity<Response> updateBookingSimple(@PathVariable("idPd") Integer idPd,
            @RequestBody UpdateBookingRequest request) {
        Response response = phieuDatService.updateBookingSimple(idPd, request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Staff specific endpoints
    @GetMapping("/khach-hang/recent")
    public ResponseEntity<Response> getRecentBookingsByCustomer(@RequestParam("cccd") String cccd) {
        Response response = phieuDatService.getPhieuDatByKhachHang(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/pending")
    public ResponseEntity<Response> getPendingBookings() {
        Response response = phieuDatService.getPhieuDatByTrangThai("Chờ xác nhận");
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/today")
    public ResponseEntity<Response> getTodayBookings() {
        LocalDate today = LocalDate.now();
        Response response = phieuDatService.getPhieuDatByDateRange(today, today);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/confirmed")
    public ResponseEntity<Response> getConfirmedBookings() {
        Response response = phieuDatService.getConfirmedBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Test endpoint for PayPal
     */
    @GetMapping("/test-paypal")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> testPayPal() {
        System.out.println("Test PayPal endpoint hit!");
        return ResponseEntity.ok("PayPal endpoint working!");
    }

    /**
     * Create booking from PayPal payment
     */
    @PostMapping("/create-paypal")
    @CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.OPTIONS })
    public ResponseEntity<Response> createBookingFromPayPal(@RequestBody CreateBookingRequest request) {
        System.out.println("=== PayPal Controller Endpoint Hit ===");
        System.out.println("Request received at /api/phieu-dat/create-paypal");
        System.out.println("Request body: " + request);

        try {
            Response response = phieuDatServiceImpl.createBookingFromPayPal(request);
            System.out.println("Response status: " + response.getStatusCode());
            System.out.println("Response message: " + response.getMessage());
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            System.out.println("Controller error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
