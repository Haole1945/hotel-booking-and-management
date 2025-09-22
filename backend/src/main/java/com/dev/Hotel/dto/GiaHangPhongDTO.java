package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GiaHangPhongDTO {
    
    private Integer idHangPhong;
    private LocalDate ngayApDung;
    private BigDecimal gia;
    private LocalDate ngayThietLap;
    private String idNv;
    
    // Additional info for display
    private String tenHangPhong;
    private String tenKieuPhong;
    private String tenLoaiPhong;
    private String hoTenNhanVien;
    
    // Constructor for basic info
    public GiaHangPhongDTO() {}
    
    public GiaHangPhongDTO(Integer idHangPhong, LocalDate ngayApDung, BigDecimal gia, 
                          LocalDate ngayThietLap, String idNv) {
        this.idHangPhong = idHangPhong;
        this.ngayApDung = ngayApDung;
        this.gia = gia;
        this.ngayThietLap = ngayThietLap;
        this.idNv = idNv;
    }
}
