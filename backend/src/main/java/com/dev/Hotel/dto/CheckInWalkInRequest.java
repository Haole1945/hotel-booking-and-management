package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CheckInWalkInRequest {
    
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    
    // Khach hang info - can be just CCCD or full info
    private KhachHangInfo khachHang;
    
    // Nhan vien info - just ID
    private NhanVienInfo nhanVien;
    
    // Room info - list of rooms to book
    private List<PhongInfo> danhSachPhong;
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class KhachHangInfo {
        private String cccd;
        private String ho;
        private String ten;
        private String sdt;
        private String email;
        private String diaChi;
    }
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NhanVienInfo {
        private String idNv;
    }
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PhongInfo {
        private String soPhong;
        private List<String> danhSachKhachCccd; // List of guest CCCDs for this room
    }
}
