package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CtDichVuDTO {

    // Composite key fields
    private Integer idCtPt;
    private String idDv;

    private LocalDate ngaySuDung;
    private BigDecimal donGia;
    private Integer soLuong;
    private String idHd;
    private String ttThanhToan;

    // Phong info
    private String soPhong;
    private String tenKieuPhong;
    private String tenLoaiPhong;

    // Khach hang info
    private String tenKhachHang;
    private String cccd;

    // Dich vu info
    private String tenDv;
    private String donViTinh;

    // Computed fields
    private BigDecimal thanhTien;

    public BigDecimal getThanhTien() {
        if (donGia != null && soLuong != null) {
            return donGia.multiply(BigDecimal.valueOf(soLuong));
        }
        return BigDecimal.ZERO;
    }
}
