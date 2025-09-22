package com.dev.Hotel.controller;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.TienNghiRequest;
import com.dev.Hotel.service.interfac.ITienNghiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tien-nghi")
public class TienNghiController {

    @Autowired
    private ITienNghiService tienNghiService;

    @GetMapping("/all")
    // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getAllTienNghi() {
        Response response = tienNghiService.getAllTienNghi();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/{id}")
    // @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('EMPLOYEE')")
    public ResponseEntity<Response> getTienNghiById(@PathVariable("id") String id) {
        Response response = tienNghiService.getTienNghiById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/add")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> addTienNghi(@RequestBody TienNghiRequest request) {
        Response response = tienNghiService.addTienNghi(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{id}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateTienNghi(@PathVariable("id") String id,
            @RequestBody TienNghiRequest request) {
        Response response = tienNghiService.updateTienNghi(id, request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{id}")
    // @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteTienNghi(@PathVariable("id") String id) {
        Response response = tienNghiService.deleteTienNghi(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
