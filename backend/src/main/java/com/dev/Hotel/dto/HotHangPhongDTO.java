package com.dev.Hotel.dto;

import java.math.BigDecimal;
import java.util.List;

public class HotHangPhongDTO {
    private Integer idHangPhong;
    private String moTa;
    private String tenKp;
    private String tenLp;
    private Long soLuotThue;
    private BigDecimal giaHienTai;
    private String urlAnhDaiDien;
    private List<TienNghiDTO> danhSachTienNghi;
    private String moTaKieuPhong; // Mô tả kiểu phòng (One double and one single bed)

    // Constructors
    public HotHangPhongDTO() {
    }

    public HotHangPhongDTO(Integer idHangPhong, String moTa, String tenKp, String tenLp, Long soLuotThue,
            BigDecimal giaHienTai) {
        this.idHangPhong = idHangPhong;
        this.moTa = moTa;
        this.tenKp = tenKp;
        this.tenLp = tenLp;
        this.soLuotThue = soLuotThue;
        this.giaHienTai = giaHienTai;
    }

    // Getters and Setters
    public Integer getIdHangPhong() {
        return idHangPhong;
    }

    public void setIdHangPhong(Integer idHangPhong) {
        this.idHangPhong = idHangPhong;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getTenKp() {
        return tenKp;
    }

    public void setTenKp(String tenKp) {
        this.tenKp = tenKp;
    }

    public String getTenLp() {
        return tenLp;
    }

    public void setTenLp(String tenLp) {
        this.tenLp = tenLp;
    }

    public Long getSoLuotThue() {
        return soLuotThue;
    }

    public void setSoLuotThue(Long soLuotThue) {
        this.soLuotThue = soLuotThue;
    }

    public BigDecimal getGiaHienTai() {
        return giaHienTai;
    }

    public void setGiaHienTai(BigDecimal giaHienTai) {
        this.giaHienTai = giaHienTai;
    }

    public String getUrlAnhDaiDien() {
        return urlAnhDaiDien;
    }

    public void setUrlAnhDaiDien(String urlAnhDaiDien) {
        this.urlAnhDaiDien = urlAnhDaiDien;
    }

    public List<TienNghiDTO> getDanhSachTienNghi() {
        return danhSachTienNghi;
    }

    public void setDanhSachTienNghi(List<TienNghiDTO> danhSachTienNghi) {
        this.danhSachTienNghi = danhSachTienNghi;
    }

    public String getMoTaKieuPhong() {
        return moTaKieuPhong;
    }

    public void setMoTaKieuPhong(String moTaKieuPhong) {
        this.moTaKieuPhong = moTaKieuPhong;
    }

    @Override
    public String toString() {
        return "HotHangPhongDTO{" +
                "idHangPhong=" + idHangPhong +
                ", moTa='" + moTa + '\'' +
                ", tenKp='" + tenKp + '\'' +
                ", tenLp='" + tenLp + '\'' +
                ", soLuotThue=" + soLuotThue +
                ", giaHienTai=" + giaHienTai +
                '}';
    }
}
