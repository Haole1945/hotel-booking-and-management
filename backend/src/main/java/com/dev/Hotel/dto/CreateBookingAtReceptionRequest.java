package com.dev.Hotel.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateBookingAtReceptionRequest {
    
    // Thông tin khách hàng
    private String cccd;
    private String ho;
    private String ten;
    private String sdt;
    private String email;
    private String diaChi;
    private boolean isNewCustomer; // true = khách mới, false = khách cũ
    
    // Thông tin đặt phòng
    private LocalDate ngayBdThue;
    private LocalDate ngayDi;
    private String idKp; // ID kiểu phòng
    private String idLp; // ID loại phòng
    private Integer soLuongPhongO; // Số lượng phòng ở (thay đổi từ soKhachO)
    private BigDecimal tienDatCoc;
    
    // Thông tin nhân viên
    private String idNv;
    
    // Ghi chú
    private String ghiChu;
}
