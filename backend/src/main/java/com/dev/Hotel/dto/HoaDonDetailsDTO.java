package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HoaDonDetailsDTO {
    
    // Invoice basic info
    private String idHd;
    private Integer idPt;
    private LocalDate ngayLap;
    private BigDecimal tongTien;
    private BigDecimal soTienGiam; // Số tiền khuyến mãi
    private String trangThai;
    
    // Customer info
    private String cccdKhachHang;
    private String hoTenKhachHang;
    private String sdtKhachHang;
    private String emailKhachHang;
    
    // Employee info
    private String idNv;
    private String hoTenNhanVien;

    // Booking info
    private BigDecimal soTienCoc;
    private String maPhieuThue;
    private LocalDate ngayCheckIn; // Ngày check-in (ngayDen sớm nhất)

    // Details - chỉ items đã thanh toán (có ID_HD)
    private List<RoomDetailDTO> danhSachPhong;
    private List<ServiceDetailDTO> danhSachDichVu;
    private List<SurchargeDetailDTO> danhSachPhuThu;
    
    // Room detail for invoice
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RoomDetailDTO {
        private Integer idCtPt;
        private String soPhong;
        private String tenKieuPhong;
        private String tenLoaiPhong;
        private LocalDate ngayDen;
        private LocalDate ngayDi;
        private Integer soNgay;
        private BigDecimal donGia;
        private BigDecimal thanhTien;
    }
    
    // Service detail for invoice
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ServiceDetailDTO {
        private String idDv;
        private Integer idCtPt;
        private String soPhong;
        private String tenDv;
        private String donViTinh;
        private LocalDate ngaySuDung;
        private BigDecimal donGia;
        private Integer soLuong;
        private BigDecimal thanhTien;
    }
    
    // Surcharge detail for invoice
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SurchargeDetailDTO {
        private String idPhuThu;
        private Integer idCtPt;
        private String soPhong;
        private String loaiPhuThu;
        private String moTa;
        private BigDecimal donGia;
        private Integer soLuong;
        private BigDecimal thanhTien;
    }
}
