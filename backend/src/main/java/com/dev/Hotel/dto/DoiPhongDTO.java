package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoiPhongDTO {
    
    // Thông tin đổi phòng
    private Integer idCtPt;
    private String soPhongMoi;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    
    // Thông tin phòng cũ
    private String soPhongCu;
    private String tenHangPhongCu;
    private String tenKieuPhongCu;
    private String tenLoaiPhongCu;
    private BigDecimal giaPhongCu;
    
    // Thông tin phòng mới
    private String tenHangPhongMoi;
    private String tenKieuPhongMoi;
    private String tenLoaiPhongMoi;
    private BigDecimal giaPhongMoi;
    
    // Thông tin khách hàng
    private String tenKhachHang;
    private String cccd;
    private String sdtKhachHang;
    
    // Thông tin phiếu thuê
    private Integer idPt;
    private LocalDate ngayLapPhieuThue;
    private LocalDate ngayDenBanDau;
    private LocalDate ngayDiBanDau;
    
    // Thông tin tài chính
    private BigDecimal chenhLechGia;
    private BigDecimal phuThu;
    private BigDecimal khuyenMai;
    private BigDecimal tongTienChenhLech;
    
    // Thông tin xử lý
    private String tenNhanVien;
    private String lyDo;
    private String ghiChu;
    private String trangThai;
    
    // Thời gian xử lý
    private LocalDate ngayTao;
    private LocalDate ngayCapNhat;
}
