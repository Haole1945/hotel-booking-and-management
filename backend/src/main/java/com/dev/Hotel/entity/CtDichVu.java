package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "ct_dich_vu")
public class CtDichVu {

    @EmbeddedId
    private CtDichVuId id;

    @Column(name = "NGAY_SU_DUNG")
    private LocalDate ngaySuDung;

    @Column(name = "DON_GIA")
    private BigDecimal donGia;

    @Column(name = "SO_LUONG")
    private Integer soLuong;

    @Column(name = "ID_HD")
    private String idHd;

    @Column(name = "TT_THANH_TOAN")
    private String ttThanhToan;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCtPt")
    @JoinColumn(name = "ID_CT_PT")
    private CtPhieuThue ctPhieuThue;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idDv")
    @JoinColumn(name = "ID_DV")
    private DichVu dichVu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HD", insertable = false, updatable = false)
    private HoaDon hoaDon;
}