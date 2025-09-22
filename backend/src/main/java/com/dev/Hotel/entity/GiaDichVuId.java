package com.dev.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@Embeddable
public class GiaDichVuId implements Serializable {
    @Column(name = "ID_DV")
    private String idDv;

    @Column(name = "NGAY_AP_DUNG")
    private LocalDate ngayApDung;
}


