package com.dev.Hotel.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AvailableRoomsByHangPhongDTO {

    private Integer idHangPhong;
    private String tenHangPhong;
    private String tenKieuPhong;
    private String tenLoaiPhong;
    private Integer tongSoPhong;
    private Integer soPhongTrong;
    private Integer soPhongChiem;
    private Integer soPhongKhongKhaDung;

    // Thông tin bổ sung
    private BigDecimal giaHienTai;
    private BigDecimal totalPrice;
    private BigDecimal averagePrice;
    private String moTaKieuPhong;
    private String moTaLoaiPhong;
    private Integer soLuongKhachO;

    // Danh sách ảnh
    private List<String> danhSachAnhUrl;

    // Tiện nghi
    private List<TienNghiDTO> danhSachTienNghi;

    // Khuyến mãi
    private List<KhuyenMaiDTO> danhSachKhuyenMai;

    // Price segments for detailed breakdown
    private List<Object> priceSegments;

    // Constructor cho stored procedure result với đầy đủ thông tin
    public AvailableRoomsByHangPhongDTO(Integer idHangPhong, String tenKieuPhong,
            String tenLoaiPhong, Integer tongSoPhong, Integer soPhongChiem,
            Integer soPhongKhongKhaDung, Integer soPhongTrong) {
        this.idHangPhong = idHangPhong;
        this.tenKieuPhong = tenKieuPhong;
        this.tenLoaiPhong = tenLoaiPhong;
        this.tongSoPhong = tongSoPhong;
        this.soPhongChiem = soPhongChiem;
        this.soPhongKhongKhaDung = soPhongKhongKhaDung;
        this.soPhongTrong = soPhongTrong;
    }

    // Constructor cho stored procedure result (backward compatibility)
    public AvailableRoomsByHangPhongDTO(Integer idHangPhong, String tenKieuPhong,
            String tenLoaiPhong, Integer tongSoPhong,
            Integer soPhongTrong) {
        this.idHangPhong = idHangPhong;
        this.tenKieuPhong = tenKieuPhong;
        this.tenLoaiPhong = tenLoaiPhong;
        this.tongSoPhong = tongSoPhong;
        this.soPhongTrong = soPhongTrong;
    }

    // Default constructor
    public AvailableRoomsByHangPhongDTO() {
    }
}
