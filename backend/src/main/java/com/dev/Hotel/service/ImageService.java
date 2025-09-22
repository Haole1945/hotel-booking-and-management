package com.dev.Hotel.service;

import com.dev.Hotel.exception.OurException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService {

    public byte[] saveImage(MultipartFile photo) {
        try {
            if (photo != null && !photo.isEmpty()) {
                // Kiểm tra loại file
                String contentType = photo.getContentType();
                if (contentType == null || (!contentType.startsWith("image/"))) {
                    throw new OurException("File must be an image");
                }
                
                // Kiểm tra kích thước (max 5MB)
                if (photo.getSize() > 5 * 1024 * 1024) {
                    throw new OurException("Image size must be less than 5MB");
                }
                
                byte[] imageData = photo.getBytes();
                return imageData;
            }
            return null;
        } catch (IOException e) {
            throw new OurException("Error processing image: " + e.getMessage());
        }
    }
    
    public String getContentType(MultipartFile photo) {
        return photo != null ? photo.getContentType() : null;
    }
}





