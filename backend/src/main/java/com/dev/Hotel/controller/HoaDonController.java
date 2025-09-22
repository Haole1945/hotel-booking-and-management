package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.CreateInvoiceRequest;
import com.dev.Hotel.service.interfac.IHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hoa-don")
@CrossOrigin(origins = "*")
public class HoaDonController {

    @Autowired
    private IHoaDonService hoaDonService;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllHoaDon() {
        Response response = hoaDonService.getAllHoaDon();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{idHd}")
    public ResponseEntity<Response> getHoaDonById(@PathVariable("idHd") String idHd) {
        Response response = hoaDonService.getHoaDonById(idHd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Response> createHoaDon(@RequestBody CreateInvoiceRequest request) {
        Response response = hoaDonService.createHoaDon(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create-from-checkout/{idPt}")
    public ResponseEntity<Response> createInvoiceFromCheckout(
            @PathVariable("idPt") Integer idPt,
            @RequestParam(value = "actualCheckOut", required = false) String actualCheckOut) {
        Response response = hoaDonService.createInvoiceFromCheckout(idPt, actualCheckOut);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create-from-checkout-with-promotions/{idPt}")
    public ResponseEntity<Response> createInvoiceFromCheckoutWithPromotions(
            @PathVariable("idPt") Integer idPt,
            @RequestParam(value = "actualCheckOut", required = false) String actualCheckOut,
            @RequestParam(value = "promotionDiscount", required = false) java.math.BigDecimal promotionDiscount) {
        Response response = hoaDonService.createInvoiceFromCheckoutWithPromotions(idPt, actualCheckOut, promotionDiscount);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/by-phieu-thue/{idPt}")
    public ResponseEntity<Response> getHoaDonByPhieuThue(@PathVariable("idPt") Integer idPt) {
        Response response = hoaDonService.getHoaDonByPhieuThue(idPt);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update-status/{idHd}")
    public ResponseEntity<Response> updateInvoiceStatus(@PathVariable("idHd") String idHd, 
                                                       @RequestParam("trangThai") String trangThai) {
        Response response = hoaDonService.updateInvoiceStatus(idHd, trangThai);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{idHd}")
    public ResponseEntity<Response> deleteHoaDon(@PathVariable("idHd") String idHd) {
        Response response = hoaDonService.deleteHoaDon(idHd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // API mới cho hóa đơn - chỉ hiển thị items đã thanh toán (có ID_HD)
    @GetMapping("/details/{idHd}")
    public ResponseEntity<Response> getInvoiceDetails(@PathVariable("idHd") String idHd) {
        Response response = hoaDonService.getInvoiceDetails(idHd);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
