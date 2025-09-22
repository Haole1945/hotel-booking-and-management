package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PhieuDatSimpleDTO {
    
    private Integer idPd;
    private LocalDate ngayDat;
    private LocalDate ngayBdThue;
    private LocalDate ngayDi;
    private String trangThai;
    private BigDecimal soTienCoc;
    
    // Chỉ cần CCCD của khách hàng
    private String cccd;
    
    // Chỉ cần ID của nhân viên
    private String idNv;
    
    // Computed fields
    private Long soNgayThue;
    
    public Long getSoNgayThue() {
        if (ngayBdThue != null && ngayDi != null) {
            return java.time.temporal.ChronoUnit.DAYS.between(ngayBdThue, ngayDi);
        }
        return null;
    }
}
