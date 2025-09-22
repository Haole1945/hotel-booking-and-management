package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KhachHangDTO {
    
    private String cccd;
    private String ho;
    private String ten;
    private String hoTen; // Computed field: ho + " " + ten
    private String sdt;
    private String email;
    private String diaChi;
    private String maSoThue;
    
    // Booking history
    private List<PhieuDatDTO> danhSachPhieuDat;
    private List<PhieuThueDTO> danhSachPhieuThue;
    
    // Computed field
    public String getHoTen() {
        if (ho != null && ten != null) {
            return ho + " " + ten;
        }
        return null;
    }
}
