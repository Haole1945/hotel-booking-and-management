package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.KieuPhong;
import com.dev.Hotel.service.interfac.IKieuPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kieu-phong")
public class KieuPhongController {

    @Autowired
    private IKieuPhongService kieuPhongService;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllKieuPhong() {
        Response response = kieuPhongService.getAllKieuPhong();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getKieuPhongById(@PathVariable String id) {
        Response response = kieuPhongService.getKieuPhongById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Response> createKieuPhong(@RequestBody KieuPhong kieuPhong) {
        Response response = kieuPhongService.createKieuPhong(kieuPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateKieuPhong(@PathVariable String id, @RequestBody KieuPhong kieuPhong) {
        Response response = kieuPhongService.updateKieuPhong(id, kieuPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteKieuPhong(@PathVariable String id) {
        Response response = kieuPhongService.deleteKieuPhong(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
