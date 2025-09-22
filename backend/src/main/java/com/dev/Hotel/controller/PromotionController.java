package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.service.impl.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    /**
     * Lấy danh sách khuyến mãi available cho một phiếu thuê
     * Nhóm theo hạng phòng và bao gồm khuyến mãi tổng hóa đơn
     */
    @GetMapping("/by-rental/{idPt}")
    public ResponseEntity<Response> getPromotionsByRental(@PathVariable Integer idPt) {
        Response response = promotionService.getPromotionsByRental(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Lấy tất cả khuyến mãi đang active
     */
    @GetMapping("/active")
    public ResponseEntity<Response> getActivePromotions() {
        Response response = promotionService.getActivePromotions();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /**
     * Đăng ký nhận thông tin ưu đãi qua email
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Response> subscribeToPromotions(@RequestParam("email") String email) {
        Response response = promotionService.subscribeToPromotions(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
