package com.dev.Hotel.controller;

import com.dev.Hotel.dto.CheckInWalkInRequest;
import com.dev.Hotel.dto.CheckInWithRoomRequest;
import com.dev.Hotel.dto.CheckInMultipleRoomsRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.service.interfac.IPhieuThueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/phieu-thue")
@CrossOrigin(origins = "*")
public class PhieuThueController {

    @Autowired
    private IPhieuThueService phieuThueService;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllPhieuThue() {
        Response response = phieuThueService.getAllPhieuThue();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/active-without-invoice")
    public ResponseEntity<Response> getActiveRentalsWithoutInvoice() {
        Response response = phieuThueService.getActiveRentalsWithoutInvoice();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/active-with-occupied-rooms-only")
    public ResponseEntity<Response> getActiveRentalsWithOccupiedRoomsOnly() {
        Response response = phieuThueService.getActiveRentalsWithOccupiedRoomsOnly();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{idPt}")
    public ResponseEntity<Response> getPhieuThueById(@PathVariable("idPt") Integer idPt) {
        Response response = phieuThueService.getPhieuThueById(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create") 
    public ResponseEntity<Response> createPhieuThue(@RequestBody PhieuThue phieuThue) {
        Response response = phieuThueService.createPhieuThue(phieuThue);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{idPt}")
    public ResponseEntity<Response> updatePhieuThue(@PathVariable("idPt") Integer idPt, @RequestBody PhieuThue phieuThue) {
        Response response = phieuThueService.updatePhieuThue(idPt, phieuThue);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{idPt}")
    public ResponseEntity<Response> deletePhieuThue(@PathVariable("idPt") Integer idPt) {
        Response response = phieuThueService.deletePhieuThue(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/khach-hang/{cccd}")
    public ResponseEntity<Response> getPhieuThueByKhachHang(@PathVariable("cccd") String cccd) {
        Response response = phieuThueService.getPhieuThueByKhachHang(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/nhan-vien/{idNv}")
    public ResponseEntity<Response> getPhieuThueByNhanVien(@PathVariable("idNv") String idNv) {
        Response response = phieuThueService.getPhieuThueByNhanVien(idNv);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/phieu-dat/{idPd}")
    public ResponseEntity<Response> getPhieuThueByPhieuDat(@PathVariable("idPd") Integer idPd) {
        Response response = phieuThueService.getPhieuThueByPhieuDat(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/current-stays")
    public ResponseEntity<Response> getCurrentStays() {
        LocalDate currentDate = LocalDate.now();
        Response response = phieuThueService.getCurrentStays(currentDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/checkin-from-booking/{idPd}")
    public ResponseEntity<Response> checkInFromBooking(@PathVariable("idPd") Integer idPd) {
        Response response = phieuThueService.checkInFromBooking(idPd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/checkin-from-booking-with-room")
    public ResponseEntity<Response> checkInFromBookingWithRoom(@RequestBody CheckInWithRoomRequest request) {
        Response response = phieuThueService.checkInFromBookingWithRoom(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/checkin-from-booking-multiple-rooms")
    public ResponseEntity<Response> checkInFromBookingWithMultipleRooms(@RequestBody CheckInMultipleRoomsRequest request) {
        Response response = phieuThueService.checkInFromBookingWithMultipleRooms(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/checkin-walkin")
    public ResponseEntity<Response> checkInWalkIn(@RequestBody CheckInWalkInRequest request) {
        Response response = phieuThueService.checkInWalkIn(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/checkout/{idPt}")
    public ResponseEntity<Response> checkOut(@PathVariable("idPt") Integer idPt) {
        Response response = phieuThueService.checkOut(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // API checkout-with-date đã được xóa - sử dụng create-from-checkout thay thế

    @PutMapping("/extend-stay/{idPt}")
    public ResponseEntity<Response> extendStay(@PathVariable("idPt") Integer idPt, 
                                               @RequestParam("newCheckOut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newCheckOut) {
        Response response = phieuThueService.extendStay(idPt, newCheckOut);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Response> searchPhieuThue(@RequestParam("keyword") String keyword) {
        Response response = phieuThueService.searchPhieuThue(keyword);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/date-range")
    public ResponseEntity<Response> getPhieuThueByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response response = phieuThueService.getPhieuThueByDateRange(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/today-checkins")
    public ResponseEntity<Response> getTodayCheckIns() {
        Response response = phieuThueService.getTodayCheckIns();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/today-checkouts")
    public ResponseEntity<Response> getTodayCheckOuts() {
        Response response = phieuThueService.getTodayCheckOuts();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/occupancy-report")
    public ResponseEntity<Response> getOccupancyReport(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Response response = phieuThueService.getOccupancyReport(date);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/revenue-report")
    public ResponseEntity<Response> getRevenueReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response response = phieuThueService.getRevenueReport(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/details/{idPt}")
    public ResponseEntity<Response> getPhieuThueDetails(@PathVariable("idPt") Integer idPt) {
        Response response = phieuThueService.getPhieuThueDetails(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update-payment-status/{idPt}")
    public ResponseEntity<Response> updatePaymentStatus(@PathVariable("idPt") Integer idPt,
                                                       @RequestParam("trangThaiThanhToan") String trangThaiThanhToan) {
        Response response = phieuThueService.updatePaymentStatus(idPt, trangThaiThanhToan);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
