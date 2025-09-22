package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Getter
@Setter
@Entity
@Table(name = "ct_phieu_thue")
public class CtPhieuThue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CT_PT")
    private Integer idCtPt;

    @Column(name = "NGAY_DEN")
    private LocalDate ngayDen;

    @Column(name = "GIO_DEN")
    private LocalTime gioDen;

    @Column(name = "NGAY_DI")
    private LocalDate ngayDi;

    @Column(name = "DON_GIA")
    private BigDecimal donGia;

    @Column(name = "TT_THANH_TOAN")
    private String ttThanhToan;

    @Column(name = "ID_HD")
    private String idHd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PT")
    private PhieuThue phieuThue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HD", insertable = false, updatable = false)
    private HoaDon hoaDon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SO_PHONG")
    private Phong phong;

    @OneToMany(mappedBy = "ctPhieuThue", cascade = CascadeType.ALL)
    private List<CtKhachO> danhSachKhach;

    @OneToMany(mappedBy = "ctPhieuThue", cascade = CascadeType.ALL)
    private List<CtDichVu> danhSachDichVu;

    @OneToMany(mappedBy = "ctPhieuThue", cascade = CascadeType.ALL)
    private List<CtPhuThu> danhSachPhuThu;
}