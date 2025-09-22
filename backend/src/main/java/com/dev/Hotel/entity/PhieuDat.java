package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Getter
@Setter
@Entity
@Table(name = "phieudat")
public class PhieuDat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PD")
    private Integer idPd;

    @Column(name = "NGAY_DAT")
    private LocalDate ngayDat;

    @Column(name = "NGAY_BD_THUE")
    private LocalDate ngayBdThue;

    @Column(name = "NGAY_DI")
    private LocalDate ngayDi;

    @Column(name = "TRANG_THAI")
    private String trangThai;

    @Column(name = "SO_TIEN_COC")
    private BigDecimal soTienCoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CCCD")
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV")
    private NhanVien nhanVien;

    @OneToMany(mappedBy = "phieuDat", cascade = CascadeType.ALL)
    private List<CtPhieuDat> chiTietPhieuDat;

    // Manual getters and setters
    public Integer getIdPd() {
        return idPd;
    }

    public void setIdPd(Integer idPd) {
        this.idPd = idPd;
    }

    public LocalDate getNgayDat() {
        return ngayDat;
    }

    public void setNgayDat(LocalDate ngayDat) {
        this.ngayDat = ngayDat;
    }

    public LocalDate getNgayBdThue() {
        return ngayBdThue;
    }

    public void setNgayBdThue(LocalDate ngayBdThue) {
        this.ngayBdThue = ngayBdThue;
    }

    public LocalDate getNgayDi() {
        return ngayDi;
    }

    public void setNgayDi(LocalDate ngayDi) {
        this.ngayDi = ngayDi;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public BigDecimal getSoTienCoc() {
        return soTienCoc;
    }

    public void setSoTienCoc(BigDecimal soTienCoc) {
        this.soTienCoc = soTienCoc;
    }

    public KhachHang getKhachHang() {
        return khachHang;
    }

    public void setKhachHang(KhachHang khachHang) {
        this.khachHang = khachHang;
    }

    public NhanVien getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(NhanVien nhanVien) {
        this.nhanVien = nhanVien;
    }

    public List<CtPhieuDat> getChiTietPhieuDat() {
        return chiTietPhieuDat;
    }

    public void setChiTietPhieuDat(List<CtPhieuDat> chiTietPhieuDat) {
        this.chiTietPhieuDat = chiTietPhieuDat;
    }
}