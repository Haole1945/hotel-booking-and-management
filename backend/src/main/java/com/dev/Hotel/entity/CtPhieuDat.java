package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Data
@Getter
@Setter
@Entity
@Table(name = "ctphieudat")
public class CtPhieuDat {

    @EmbeddedId
    private CtPhieuDatId id;

    @Column(name = "SO_LUONG_PHONG_O")
    private Integer soLuongPhongO;

    @Column(name = "DON_GIA")
    private BigDecimal donGia;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPd")
    @JoinColumn(name = "ID_PD")
    private PhieuDat phieuDat;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idHangPhong")
    @JoinColumn(name = "ID_HANG_PHONG")
    private HangPhong hangPhong;

    // Manual getters and setters
    public CtPhieuDatId getId() {
        return id;
    }

    public void setId(CtPhieuDatId id) {
        this.id = id;
    }

    public Integer getSoLuongPhongO() {
        return soLuongPhongO;
    }

    public void setSoLuongPhongO(Integer soLuongPhongO) {
        this.soLuongPhongO = soLuongPhongO;
    }

    public BigDecimal getDonGia() {
        return donGia;
    }

    public void setDonGia(BigDecimal donGia) {
        this.donGia = donGia;
    }



    public PhieuDat getPhieuDat() {
        return phieuDat;
    }

    public void setPhieuDat(PhieuDat phieuDat) {
        this.phieuDat = phieuDat;
    }

    public HangPhong getHangPhong() {
        return hangPhong;
    }

    public void setHangPhong(HangPhong hangPhong) {
        this.hangPhong = hangPhong;
    }
}
