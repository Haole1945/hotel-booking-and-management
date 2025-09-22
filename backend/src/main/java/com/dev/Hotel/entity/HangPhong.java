package com.dev.Hotel.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Data
@Getter
@Setter
@Entity
@Table(name = "hang_phong")
public class HangPhong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_KP")
    private KieuPhong kieuPhong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_LP")
    private LoaiPhong loaiPhong;

    @JsonManagedReference("hangphong-phong")
    @OneToMany(mappedBy = "hangPhong", cascade = CascadeType.ALL)
    private List<Phong> danhSachPhong;

    @JsonManagedReference("hangphong-anh")
    @OneToMany(mappedBy = "hangPhong", cascade = CascadeType.ALL)
    private List<AnhHangPhong> danhSachAnh;

    // Alias for compatibility
    public List<AnhHangPhong> getDanhSachAnhHangPhong() {
        return danhSachAnh;
    }

    @OneToMany(mappedBy = "hangPhong", cascade = CascadeType.ALL)
    private List<CtPhieuDat> chiTietPhieuDat;

    @OneToMany(mappedBy = "hangPhong", cascade = CascadeType.ALL)
    private List<CtTienNghi> chiTietTienNghi;

    @OneToMany(mappedBy = "hangPhong", cascade = CascadeType.ALL)
    private List<CtKhuyenMai> chiTietKhuyenMai;

    @OneToMany(mappedBy = "hangPhong", cascade = CascadeType.ALL)
    private List<GiaHangPhong> danhSachGia;

    // Manual getters and setters
    public Integer getIdHangPhong() {
        return idHangPhong;
    }

    public void setIdHangPhong(Integer idHangPhong) {
        this.idHangPhong = idHangPhong;
    }

    public KieuPhong getKieuPhong() {
        return kieuPhong;
    }

    public void setKieuPhong(KieuPhong kieuPhong) {
        this.kieuPhong = kieuPhong;
    }

    public LoaiPhong getLoaiPhong() {
        return loaiPhong;
    }

    public void setLoaiPhong(LoaiPhong loaiPhong) {
        this.loaiPhong = loaiPhong;
    }

    public List<Phong> getDanhSachPhong() {
        return danhSachPhong;
    }

    public void setDanhSachPhong(List<Phong> danhSachPhong) {
        this.danhSachPhong = danhSachPhong;
    }

    public List<AnhHangPhong> getDanhSachAnh() {
        return danhSachAnh;
    }

    public void setDanhSachAnh(List<AnhHangPhong> danhSachAnh) {
        this.danhSachAnh = danhSachAnh;
    }

    public List<CtPhieuDat> getChiTietPhieuDat() {
        return chiTietPhieuDat;
    }

    public void setChiTietPhieuDat(List<CtPhieuDat> chiTietPhieuDat) {
        this.chiTietPhieuDat = chiTietPhieuDat;
    }
}