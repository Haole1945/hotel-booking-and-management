package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PhongDTO {

    // Basic room info
    private String soPhong;
    private Integer tang;

    // Room category info
    private Integer idHangPhong;
    private Double giaPhong;
    private Double gia; // Alias for giaPhong for frontend compatibility

    // Room type info (Kieu phong)
    private String idKp;
    private String tenKp;
    private String moTaKp;
    private Integer soLuongKhachO;

    // Bed type info (Loai phong)
    private String idLp;
    private String tenLp;
    private String moTaLp;

    // Status info
    private String idTt;
    private String tenTrangThai;
    private Boolean isAvailable;

    // Additional info
    private List<String> danhSachAnhUrl;
}
