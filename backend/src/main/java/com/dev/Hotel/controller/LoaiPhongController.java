package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.LoaiPhong;
import com.dev.Hotel.service.interfac.ILoaiPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loai-phong")
public class LoaiPhongController {

    @Autowired
    private ILoaiPhongService loaiPhongService;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllLoaiPhong() {
        Response response = loaiPhongService.getAllLoaiPhong();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getLoaiPhongById(@PathVariable String id) {
        Response response = loaiPhongService.getLoaiPhongById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Response> createLoaiPhong(@RequestBody LoaiPhong loaiPhong) {
        Response response = loaiPhongService.createLoaiPhong(loaiPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Response> updateLoaiPhong(@PathVariable String id, @RequestBody LoaiPhong loaiPhong) {
        Response response = loaiPhongService.updateLoaiPhong(id, loaiPhong);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteLoaiPhong(@PathVariable String id) {
        Response response = loaiPhongService.deleteLoaiPhong(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
