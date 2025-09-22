package com.dev.Hotel.controller;

import com.dev.Hotel.dto.DoiPhongRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.service.interfac.IDoiPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/doi-phong")
@CrossOrigin(origins = "*")
public class DoiPhongController {

    @Autowired
    private IDoiPhongService doiPhongService;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<Response> testEndpoint() {
        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("DoiPhong API is working!");
        return ResponseEntity.ok(response);
    }

    // Debug endpoint để kiểm tra dữ liệu
    @GetMapping("/debug/{idCtPt}")
    public ResponseEntity<Response> debugCtPhieuThue(@PathVariable("idCtPt") Integer idCtPt) {
        Response response = new Response();
        try {
            response = doiPhongService.debugCtPhieuThue(idCtPt);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy tất cả lịch sử đổi phòng
    @GetMapping("/all")
    public ResponseEntity<Response> getAllDoiPhong() {
        Response response = doiPhongService.getAllDoiPhong();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy thông tin đổi phòng theo ID
    @GetMapping("/{idCtPt}/{soPhongMoi}")
    public ResponseEntity<Response> getDoiPhongById(
            @PathVariable("idCtPt") Integer idCtPt,
            @PathVariable("soPhongMoi") String soPhongMoi) {
        Response response = doiPhongService.getDoiPhongById(idCtPt, soPhongMoi);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Yêu cầu đổi phòng
    @PostMapping("/request")
    public ResponseEntity<Response> requestRoomChange(@RequestBody DoiPhongRequest request) {
        Response response = doiPhongService.requestRoomChange(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Thực hiện đổi phòng
    @PostMapping("/change")
    public ResponseEntity<Response> changeRoom(@RequestBody DoiPhongRequest request) {
        Response response = doiPhongService.changeRoom(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Kiểm tra điều kiện đổi phòng
    @GetMapping("/check-eligibility/{idCtPt}")
    public ResponseEntity<Response> checkRoomChangeEligibility(@PathVariable("idCtPt") Integer idCtPt) {
        Response response = doiPhongService.checkRoomChangeEligibility(idCtPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy danh sách phòng có thể đổi
    @GetMapping("/available-rooms/{idCtPt}")
    public ResponseEntity<Response> getAvailableRoomsForChange(@PathVariable("idCtPt") Integer idCtPt) {
        Response response = doiPhongService.getAvailableRoomsForChange(idCtPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Tính phí đổi phòng
    @GetMapping("/calculate-fee/{idCtPt}/{soPhongMoi}")
    public ResponseEntity<Response> calculateRoomChangeFee(
            @PathVariable("idCtPt") Integer idCtPt,
            @PathVariable("soPhongMoi") String soPhongMoi) {
        Response response = doiPhongService.calculateRoomChangeFee(idCtPt, soPhongMoi);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy lịch sử đổi phòng theo chi tiết phiếu thuê
    @GetMapping("/history/{idCtPt}")
    public ResponseEntity<Response> getRoomChangeHistory(@PathVariable("idCtPt") Integer idCtPt) {
        Response response = doiPhongService.getRoomChangeHistory(idCtPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy lịch sử đổi phòng theo phòng mới
    @GetMapping("/by-room/{soPhongMoi}")
    public ResponseEntity<Response> getDoiPhongByPhongMoi(@PathVariable("soPhongMoi") String soPhongMoi) {
        Response response = doiPhongService.getDoiPhongByPhongMoi(soPhongMoi);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy lịch sử đổi phòng theo khách hàng
    @GetMapping("/by-customer/{cccd}")
    public ResponseEntity<Response> getDoiPhongByKhachHang(@PathVariable("cccd") String cccd) {
        Response response = doiPhongService.getDoiPhongByKhachHang(cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy lịch sử đổi phòng theo khoảng thời gian
    @GetMapping("/by-date-range")
    public ResponseEntity<Response> getDoiPhongByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response response = doiPhongService.getDoiPhongByDateRange(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy danh sách đổi phòng hiện tại
    @GetMapping("/current")
    public ResponseEntity<Response> getCurrentRoomChanges() {
        Response response = doiPhongService.getCurrentRoomChanges();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Phê duyệt đổi phòng
    @PutMapping("/approve/{idCtPt}/{soPhongMoi}")
    public ResponseEntity<Response> approveRoomChange(
            @PathVariable("idCtPt") Integer idCtPt,
            @PathVariable("soPhongMoi") String soPhongMoi) {
        Response response = doiPhongService.approveRoomChange(idCtPt, soPhongMoi);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Hủy đổi phòng
    @PutMapping("/cancel/{idCtPt}/{soPhongMoi}")
    public ResponseEntity<Response> cancelRoomChange(
            @PathVariable("idCtPt") Integer idCtPt,
            @PathVariable("soPhongMoi") String soPhongMoi,
            @RequestParam("reason") String reason) {
        Response response = doiPhongService.cancelRoomChange(idCtPt, soPhongMoi, reason);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Hoàn thành đổi phòng
    @PutMapping("/complete/{idCtPt}/{soPhongMoi}")
    public ResponseEntity<Response> completeRoomChange(
            @PathVariable("idCtPt") Integer idCtPt,
            @PathVariable("soPhongMoi") String soPhongMoi) {
        Response response = doiPhongService.completeRoomChange(idCtPt, soPhongMoi);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Cập nhật thông tin đổi phòng
    @PutMapping("/update/{idCtPt}/{soPhongMoi}")
    public ResponseEntity<Response> updateDoiPhong(
            @PathVariable("idCtPt") Integer idCtPt,
            @PathVariable("soPhongMoi") String soPhongMoi,
            @RequestBody DoiPhongRequest request) {
        Response response = doiPhongService.updateDoiPhong(idCtPt, soPhongMoi, request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Xóa thông tin đổi phòng
    @DeleteMapping("/delete/{idCtPt}/{soPhongMoi}")
    public ResponseEntity<Response> deleteDoiPhong(
            @PathVariable("idCtPt") Integer idCtPt,
            @PathVariable("soPhongMoi") String soPhongMoi) {
        Response response = doiPhongService.deleteDoiPhong(idCtPt, soPhongMoi);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Kiểm tra tính hợp lệ của yêu cầu đổi phòng
    @PostMapping("/validate")
    public ResponseEntity<Response> validateRoomChange(@RequestBody DoiPhongRequest request) {
        Response response = doiPhongService.validateRoomChange(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy thống kê đổi phòng
    @GetMapping("/statistics")
    public ResponseEntity<Response> getRoomChangeStatistics(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Response response = doiPhongService.getRoomChangeStatistics(startDate, endDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Tìm kiếm đổi phòng
    @GetMapping("/search")
    public ResponseEntity<Response> searchDoiPhong(@RequestParam("keyword") String keyword) {
        Response response = doiPhongService.searchDoiPhong(keyword);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lọc đổi phòng
    @GetMapping("/filter")
    public ResponseEntity<Response> filterDoiPhong(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "cccd", required = false) String cccd) {
        Response response = doiPhongService.filterDoiPhong(startDate, endDate, cccd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
