package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.NhomQuyen;
import com.dev.Hotel.repo.NhomQuyenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhom-quyen")
@CrossOrigin(origins = "*")
public class NhomQuyenController {

    @Autowired
    private NhomQuyenRepository nhomQuyenRepository;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllNhomQuyen() {
        Response response = new Response();
        try {
            List<NhomQuyen> nhomQuyenList = nhomQuyenRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setNhomQuyenList(nhomQuyenList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách nhóm quyền: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getNhomQuyenById(@PathVariable String id) {
        Response response = new Response();
        try {
            NhomQuyen nhomQuyen = nhomQuyenRepository.findById(id).orElse(null);
            if (nhomQuyen != null) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setNhomQuyen(nhomQuyen);
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy nhóm quyền");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin nhóm quyền: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
