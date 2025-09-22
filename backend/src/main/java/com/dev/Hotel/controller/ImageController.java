package com.dev.Hotel.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/images")

public class ImageController {

    @GetMapping("/phong/{soPhong}")
    public ResponseEntity<String> getPhongImage(@PathVariable String soPhong) {
        try {
            // For now, return a placeholder response
            // In the future, implement image retrieval from AnhHangPhong
            return ResponseEntity.ok("Image endpoint for room: " + soPhong);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}




