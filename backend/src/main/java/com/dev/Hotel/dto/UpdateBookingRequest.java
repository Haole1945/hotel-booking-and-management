package com.dev.Hotel.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateBookingRequest {
    
    // Customer information
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    
    // Booking information
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    private BigDecimal soTienCoc;
    
    // Room information
    private String kieuPhong;
    private String loaiPhong;
    private Integer soLuongPhongO;
    
    // Additional fields
    private String ghiChu;
}
