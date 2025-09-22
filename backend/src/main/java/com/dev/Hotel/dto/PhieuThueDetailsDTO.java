package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PhieuThueDetailsDTO {
    private Integer idPt;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    private LocalDate ngayDenThucTe;
    private LocalDate ngayDiThucTe;
    private String trangThai;
    private String trangThaiThanhToan;
    private String ghiChu;
    
    // Thông tin khách hàng
    private String cccdKhachHang;
    private String hoTenKhachHang;
    private String sdtKhachHang;
    private String emailKhachHang;
    
    // Thông tin nhân viên
    private String idNv;
    private String hoTenNhanVien;

    // Thông tin phiếu đặt
    private Integer idPd;
    private BigDecimal soTienCoc;

    // Danh sách phòng
    private List<RoomDetailDTO> rooms;
    
    // Danh sách dịch vụ
    private List<ServiceDetailDTO> services;
    
    // Danh sách phụ thu
    private List<SurchargeDetailDTO> surcharges;
    
    // Tổng chi phí
    private BigDecimal tongTienPhong;
    private BigDecimal tongTienDichVu;
    private BigDecimal tongTienPhuThu;
    private BigDecimal tongTien;
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RoomDetailDTO {
        private Integer idCtPt;
        private String idPhong;
        private String tenPhong;
        private String loaiPhong;
        private BigDecimal donGia;
        private LocalDate ngayDen;
        private LocalDate ngayDi;
        private Integer soNgay;
        private BigDecimal thanhTien;
        private String trangThaiThanhToan;
    }
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ServiceDetailDTO {
        // Composite key fields
        private Integer idCtPt;
        private String idDv;

        private String tenDichVu;
        private BigDecimal gia;
        private Integer soLuong;
        private BigDecimal thanhTien;
        private LocalDate ngaySD;
        private String idPhong;
        private String tenPhong;
    }
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SurchargeDetailDTO {
        // Composite key fields
        private String idPhuThu;
        private Integer idCtPt;

        private String loaiPhuThu;
        private String moTa;
        private BigDecimal donGia;
        private Integer soLuong;
        private BigDecimal thanhTien;
        private LocalDate ngayPhatSinh;
        private String idPhong;
        private String tenPhong;
    }
}
