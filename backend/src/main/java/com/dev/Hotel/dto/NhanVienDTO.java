package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NhanVienDTO {

    private String idNv;
    private String ho;
    private String ten;
    private String hoTen; // Computed field: ho + " " + ten
    private String phai;
    private LocalDate ngaySinh;
    private String diaChi;
    private String sdt;
    private String email;
    private String hinh;
    private String username;
    // Note: password is excluded for security

    // Bo phan info
    private String idBp;
    private String tenBp;

    // Nhom quyen info
    private String idNq;
    private String tenNq;

    // Computed field
    public String getHoTen() {
        if (ho != null && ten != null) {
            return ho + " " + ten;
        }
        return null;
    }
}
