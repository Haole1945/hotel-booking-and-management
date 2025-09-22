package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PhieuDatDTO {
    
    private Integer idPd;
    private LocalDate ngayDat;
    private LocalDate ngayBdThue;
    private LocalDate ngayDi;
    private String trangThai;
    private BigDecimal soTienCoc;
    
    // Khach hang info
    private String cccd;
    private String hoTenKhachHang;
    private String sdtKhachHang;
    private String emailKhachHang;
    
    // Nhan vien info
    private String idNv;
    private String hoTenNhanVien;

    // Chi tiet phieu dat info (from CtPhieuDat)
    private Integer soLuongPhongO;
    private String tenKp; // Ten kieu phong
    private String tenLp; // Ten loai phong
    private String idKp; // ID kieu phong
    private String idLp; // ID loai phong
    private Integer idHangPhong;

    // Computed fields
    private Long soNgayThue;
    
    public Long getSoNgayThue() {
        if (ngayBdThue != null && ngayDi != null) {
            return java.time.temporal.ChronoUnit.DAYS.between(ngayBdThue, ngayDi);
        }
        return null;
    }
}
