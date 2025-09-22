package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.BoPhan;
import com.dev.Hotel.repo.BoPhanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bo-phan")
@CrossOrigin(origins = "*")
public class BoPhanController {

    @Autowired
    private BoPhanRepository boPhanRepository;

    @GetMapping("/all")
    public ResponseEntity<Response> getAllBoPhan() {
        Response response = new Response();
        try {
            List<BoPhan> boPhanList = boPhanRepository.findAll();
            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setBoPhanList(boPhanList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách bộ phận: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getBoPhanById(@PathVariable String id) {
        Response response = new Response();
        try {
            BoPhan boPhan = boPhanRepository.findById(id).orElse(null);
            if (boPhan != null) {
                response.setStatusCode(200);
                response.setMessage("Thành công");
                response.setBoPhan(boPhan);
            } else {
                response.setStatusCode(404);
                response.setMessage("Không tìm thấy bộ phận");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy thông tin bộ phận: " + e.getMessage());
        }
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
