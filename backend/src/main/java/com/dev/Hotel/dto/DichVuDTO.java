package com.dev.Hotel.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DichVuDTO {
    private String idDv;
    private String tenDv;
    private String moTa;
    private String donViTinh;
    private BigDecimal giaHienTai;
    private LocalDate ngayApDungGia;
}
