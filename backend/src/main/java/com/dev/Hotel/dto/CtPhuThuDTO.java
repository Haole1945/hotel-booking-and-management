package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CtPhuThuDTO {

    // Composite key fields
    private String idPhuThu;
    private Integer idCtPt;

    private String idHd;
    private String ttThanhToan;
    private BigDecimal donGia;
    private Integer soLuong;

    // Phong info
    private String soPhong;
    private String tenKieuPhong;
    private String tenLoaiPhong;

    // Khach hang info
    private String tenKhachHang;
    private String cccd;

    // Phu thu info
    private String tenPhuThu;

    // Computed fields
    private BigDecimal thanhTien;

    public BigDecimal getThanhTien() {
        if (donGia != null && soLuong != null) {
            return donGia.multiply(BigDecimal.valueOf(soLuong));
        }
        return BigDecimal.ZERO;
    }
}
