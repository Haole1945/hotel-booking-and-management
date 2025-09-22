package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PhieuThueSimpleDTO {
    
    private Integer idPt;
    private LocalDate ngayLap;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    
    // Chỉ cần CCCD của khách hàng
    private String cccd;
    
    // Chỉ cần ID của nhân viên
    private String idNv;
    
    // Thông tin phiếu đặt (nếu có)
    private Integer idPd;
    
    // Computed fields
    private Long soNgayThue;
    
    public Long getSoNgayThue() {
        if (ngayDen != null && ngayDi != null) {
            return java.time.temporal.ChronoUnit.DAYS.between(ngayDen, ngayDi);
        }
        return null;
    }
}
