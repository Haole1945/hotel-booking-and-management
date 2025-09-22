package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CtPhieuThueDTO {
    
    private Integer idCtPt;
    private LocalDate ngayDen;
    private LocalTime gioDen;
    private LocalDate ngayDi;
    private BigDecimal donGia;
    private String ttThanhToan;
    
    // Phieu thue info
    private Integer idPt;

    // Khach hang info
    private String tenKhachHang;
    private String cccd;
    private String sdtKhachHang;

    // Phong info
    private String soPhong;
    private Integer tang;
    private String tenHangPhong;
    private String tenKieuPhong;
    private String tenLoaiPhong;
    private String tenTrangThai;
    
    // Khach o trong phong
    private List<KhachHangDTO> danhSachKhach;
    
    // Dich vu su dung
    private List<CtDichVuDTO> danhSachDichVu;
    
    // Phu thu
    private List<CtPhuThuDTO> danhSachPhuThu;
    
    // Computed fields
    private BigDecimal tongTienPhong;
    private BigDecimal tongTienDichVu;
    private BigDecimal tongTienPhuThu;
    private BigDecimal tongTien;
}
