package com.dev.Hotel.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@EqualsAndHashCode
public class GiaHangPhongId implements Serializable {
    private Integer idHangPhong;
    private LocalDate ngayApDung;
}
