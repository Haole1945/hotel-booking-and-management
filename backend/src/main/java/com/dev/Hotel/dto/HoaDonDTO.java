package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HoaDonDTO {
    
    private String idHd;
    private LocalDate ngayLap;
    private BigDecimal tongTien;
    private BigDecimal soTienGiam; // Số tiền khuyến mãi
    private String trangThai;
    
    // PhieuThue info
    private Integer idPt;
    private String maPhieuThue;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    
    // Customer info
    private String cccdKhachHang;
    private String hoTenKhachHang;
    private String sdtKhachHang;
    private String emailKhachHang;
    
    // Employee info
    private String idNv;
    private String hoTenNhanVien;
    
    // Room details
    private List<RoomDetailDTO> danhSachPhong;
    
    // Service details
    private List<ServiceDetailDTO> danhSachDichVu;
    
    // Surcharge details
    private List<SurchargeDetailDTO> danhSachPhuThu;
    
    // Bill breakdown
    private BigDecimal tienPhong;
    private BigDecimal tienDichVu;
    private BigDecimal tienPhuThu;
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RoomDetailDTO {
        private String soPhong;
        private String tenKp;
        private String tenLp;
        private BigDecimal donGia;
        private Integer soNgay;
        private BigDecimal thanhTien;
    }
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ServiceDetailDTO {
        private String idDv;
        private String tenDv;
        private BigDecimal donGia;
        private Integer soLuong;
        private BigDecimal thanhTien;
        private String ttThanhToan;
    }
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SurchargeDetailDTO {
        private String idPt;
        private String tenPhuThu;
        private BigDecimal donGia;
        private Integer soLuong;
        private BigDecimal thanhTien;
        private String ttThanhToan;
    }
}
