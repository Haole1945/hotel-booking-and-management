package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.PhuThu;
import com.dev.Hotel.service.impl.PhuThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/phu-thu")
@CrossOrigin(origins = "*")
public class PhuThuController {

    @Autowired
    private PhuThuService phuThuService;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllPhuThu() {
        Response response = phuThuService.getAllPhuThu();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{idPhuThu}")
    public ResponseEntity<Response> getPhuThuById(@PathVariable String idPhuThu) {
        Response response = phuThuService.getPhuThuById(idPhuThu);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Response> createPhuThu(@RequestBody PhuThu phuThu) {
        Response response = phuThuService.createPhuThu(phuThu);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{idPhuThu}")
    public ResponseEntity<Response> updatePhuThu(@PathVariable String idPhuThu, @RequestBody PhuThu phuThu) {
        Response response = phuThuService.updatePhuThu(idPhuThu, phuThu);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{idPhuThu}")
    public ResponseEntity<Response> deletePhuThu(@PathVariable String idPhuThu) {
        Response response = phuThuService.deletePhuThu(idPhuThu);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/add-price")
    public ResponseEntity<Response> addPhuThuPrice(@RequestBody Map<String, Object> request) {
        try {
            String idPhuThu = (String) request.get("idPhuThu");
            LocalDate ngayApDung = LocalDate.parse((String) request.get("ngayApDung"));
            BigDecimal gia = new BigDecimal(request.get("gia").toString());
            String idNv = (String) request.get("idNv");

            Response response = phuThuService.addPhuThuPrice(idPhuThu, ngayApDung, gia, idNv);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        } catch (Exception e) {
            Response response = new Response();
            response.setStatusCode(400);
            response.setMessage("Dữ liệu không hợp lệ: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{idPhuThu}/prices")
    public ResponseEntity<Response> getPhuThuPrices(@PathVariable String idPhuThu) {
        Response response = phuThuService.getPhuThuPrices(idPhuThu);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{idPhuThu}/current-price")
    public ResponseEntity<Response> getCurrentPrice(@PathVariable String idPhuThu) {
        Response response = new Response();
        try {
            BigDecimal currentPrice = phuThuService.getCurrentPrice(idPhuThu);
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setRoomPrice(currentPrice); // Reusing roomPrice field for current price
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy giá hiện tại: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
