package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HangPhongDTO {
    
    private Integer idHangPhong;
    
    // Kieu phong info
    private String idKp;
    private String tenKp;
    private String moTaKp;
    private Integer soLuongKhachO;
    
    // Loai phong info
    private String idLp;
    private String tenLp;
    private String moTaLp;
    
    // Danh sach phong thuoc hang phong nay
    private List<PhongDTO> danhSachPhong;
    
    // Danh sach anh
    private List<String> danhSachAnhUrl;
    
    // Computed fields
    private Integer soPhongTrong;
    private Integer tongSoPhong;
}
