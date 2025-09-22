package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Getter
@Setter
@Entity
@Table(name = "gia_hang_phong")
@IdClass(GiaHangPhongId.class)
public class GiaHangPhong {

    @Id
    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;

    @Id
    @Column(name = "NGAYAPDUNG")
    private LocalDate ngayApDung;

    @Column(name = "GIA")
    private BigDecimal gia;

    @Column(name = "NGAY_THIET_LAP")
    private LocalDate ngayThietLap;

    @Column(name = "ID_NV")
    private String idNv;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HANG_PHONG", insertable = false, updatable = false)
    private HangPhong hangPhong;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV", insertable = false, updatable = false)
    private NhanVien nhanVien;

    // Manual getters and setters
    public Integer getIdHangPhong() {
        return idHangPhong;
    }

    public void setIdHangPhong(Integer idHangPhong) {
        this.idHangPhong = idHangPhong;
    }

    public LocalDate getNgayApDung() {
        return ngayApDung;
    }

    public void setNgayApDung(LocalDate ngayApDung) {
        this.ngayApDung = ngayApDung;
    }

    public BigDecimal getGia() {
        return gia;
    }

    public void setGia(BigDecimal gia) {
        this.gia = gia;
    }

    public LocalDate getNgayThietLap() {
        return ngayThietLap;
    }

    public void setNgayThietLap(LocalDate ngayThietLap) {
        this.ngayThietLap = ngayThietLap;
    }

    public String getIdNv() {
        return idNv;
    }

    public void setIdNv(String idNv) {
        this.idNv = idNv;
    }

    public HangPhong getHangPhong() {
        return hangPhong;
    }

    public void setHangPhong(HangPhong hangPhong) {
        this.hangPhong = hangPhong;
    }

    public NhanVien getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(NhanVien nhanVien) {
        this.nhanVien = nhanVien;
    }
}
