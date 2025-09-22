package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PhieuThueDTO {
    
    private Integer idPt;
    private LocalDate ngayLap;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    
    // Khach hang info
    private String cccd;
    private String hoTenKhachHang;
    private String sdtKhachHang;
    private String emailKhachHang;
    
    // Nhan vien info
    private String idNv;
    private String hoTenNhanVien;
    
    // Phieu dat info
    private Integer idPd;
    private BigDecimal soTienCoc;
    
    // Chi tiet phieu thue
    private List<CtPhieuThueDTO> chiTietPhieuThue;
    
    // Computed fields
    private Long soNgayThue;
    
    public Long getSoNgayThue() {
        if (ngayDen != null && ngayDi != null) {
            return java.time.temporal.ChronoUnit.DAYS.between(ngayDen, ngayDi);
        }
        return null;
    }
}
