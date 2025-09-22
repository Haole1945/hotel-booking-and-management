package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "doiphong")
public class DoiPhong {
    @EmbeddedId
    private DoiPhongId id;

    @Column(name = "NGAY_DEN")
    private LocalDate ngayDen;

    @Column(name = "NGAY_DI")
    private LocalDate ngayDi;

    @Column(name = "SOPHONGCU")
    private String soPhongCu;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCtPt")
    @JoinColumn(name = "ID_CT_PT")
    private CtPhieuThue ctPhieuThue;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("soPhongMoi")
    @JoinColumn(name = "SOPHONGMOI")
    private Phong phongMoi;
}

