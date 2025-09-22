package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GiaPhuThuDTO {
    
    private String idPhuThu;
    private LocalDate ngayApDung;
    private BigDecimal gia;
    private String idNv;
    
    // Additional info for display
    private String tenPhuThu;
    private String hoTenNhanVien;
    
    // Constructor for basic info
    public GiaPhuThuDTO() {}
    
    public GiaPhuThuDTO(String idPhuThu, LocalDate ngayApDung, BigDecimal gia, String idNv) {
        this.idPhuThu = idPhuThu;
        this.ngayApDung = ngayApDung;
        this.gia = gia;
        this.idNv = idNv;
    }
}
