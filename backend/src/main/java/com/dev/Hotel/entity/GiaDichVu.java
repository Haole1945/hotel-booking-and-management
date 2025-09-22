package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "gia_dich_vu")
public class GiaDichVu {
    @EmbeddedId
    private GiaDichVuId id;

    @Column(name = "GIA")
    private BigDecimal gia;

    @Column(name = "ID_NV")
    private String idNv;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idDv")
    @JoinColumn(name = "ID_DV")
    private DichVu dichVu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV", insertable = false, updatable = false)
    private NhanVien nhanVien;
}
