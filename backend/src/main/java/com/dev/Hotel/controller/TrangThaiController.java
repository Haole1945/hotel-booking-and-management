package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.TrangThai;
import com.dev.Hotel.repo.TrangThaiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trang-thai")
@CrossOrigin(origins = "*")
public class TrangThaiController {

    @Autowired
    private TrangThaiRepository trangThaiRepository;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllTrangThai() {
        Response response = new Response();
        try {
            List<TrangThai> trangThaiList = trangThaiRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setTrangThaiList(trangThaiList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách trạng thái: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getTrangThaiById(@PathVariable String id) {
        Response response = new Response();
        try {
            TrangThai trangThai = trangThaiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trạng thái không tồn tại"));
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setTrangThai(trangThai);
        } catch (Exception e) {
            response.setStatusCode(404);
            response.setMessage("Trạng thái không tồn tại");
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
