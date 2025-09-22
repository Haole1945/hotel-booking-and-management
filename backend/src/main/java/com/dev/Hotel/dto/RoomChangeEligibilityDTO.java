package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomChangeEligibilityDTO {
    
    // Thông tin chi tiết phiếu thuê
    private Integer idCtPt;
    private String soPhongHienTai;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    
    // Thông tin khách hàng
    private String tenKhachHang;
    private String cccd;
    
    // Tình trạng đủ điều kiện đổi phòng
    private Boolean eligible;
    private String reason;
    private List<String> requirements;
    
    // Thông tin thời gian còn lại
    private Integer soNgayConLai;
    private Boolean thoiGianHopLe;
    
    // Thông tin phòng hiện tại
    private String tenHangPhong;
    private String tenKieuPhong;
    private String tenLoaiPhong;
    private BigDecimal giaPhongHienTai;
    
    // Danh sách phòng có thể đổi
    private List<PhongDTO> danhSachPhongCoTheDoiPhong;
    
    // Thông tin hạn chế
    private List<String> hanChe;
    private Boolean coPhiPhatSinh;
    private BigDecimal phiDuKien;
}
