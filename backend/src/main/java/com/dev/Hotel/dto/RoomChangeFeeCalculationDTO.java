package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomChangeFeeCalculationDTO {
    
    // Thông tin cơ bản
    private Integer idCtPt;
    private String soPhongCu;
    private String soPhongMoi;
    private LocalDate ngayDoiPhong;
    private Integer soNgayConLai;
    
    // Thông tin giá phòng
    private BigDecimal giaPhongCu;
    private BigDecimal giaPhongMoi;
    private BigDecimal chenhLechGiaMotNgay;
    private BigDecimal tongChenhLechGia;
    
    // Thông tin phụ thu
    private BigDecimal phuThuUpgrade;
    private BigDecimal phuThuDichVu;
    private BigDecimal tongPhuThu;
    
    // Thông tin khuyến mãi
    private BigDecimal khuyenMaiApDung;
    private BigDecimal phanTramKhuyenMai;
    private String tenKhuyenMai;
    
    // Tổng kết
    private BigDecimal tongTienTruocKhuyenMai;
    private BigDecimal tongTienSauKhuyenMai;
    private BigDecimal soTienKhachCanTra;
    private BigDecimal soTienKhachDuocHoan;
    
    // Thông tin chi tiết
    private String moTaChiTiet;
    private Boolean coPhiPhatSinh;
    private String loaiGiaoDich; // "THU_THEM", "HOAN_TIEN", "KHONG_THAY_DOI"
}
