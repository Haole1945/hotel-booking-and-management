package com.dev.Hotel.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PhuThuDTO {
    private String idPhuThu;
    private String tenPhuThu;
    private String lyDo;
    private BigDecimal giaHienTai;
    private LocalDate ngayApDungGia;
}
