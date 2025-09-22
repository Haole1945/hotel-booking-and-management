package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KhuyenMaiDTO {

    private String idKm;
    private String moTaKm;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private BigDecimal phanTramGiam;

    // Additional fields for frontend
    private Boolean selected = false;
    private BigDecimal discountAmount; // Số tiền được giảm
    private Integer minRooms; // Số phòng tối thiểu để áp dụng (cho khuyến mãi tổng hóa đơn)
}
