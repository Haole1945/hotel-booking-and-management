package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class KieuPhongDTO {
    private String idKp;
    private String tenKp;
    private String moTaKp;
    private Integer soLuongKhach;

    public KieuPhongDTO() {}

    public KieuPhongDTO(String idKp, String tenKp, String moTaKp, Integer soLuongKhach) {
        this.idKp = idKp;
        this.tenKp = tenKp;
        this.moTaKp = moTaKp;
        this.soLuongKhach = soLuongKhach;
    }

    public String getIdKp() {
        return idKp;
    }

    public void setIdKp(String idKp) {
        this.idKp = idKp;
    }

    public String getTenKp() {
        return tenKp;
    }

    public void setTenKp(String tenKp) {
        this.tenKp = tenKp;
    }

    public String getMoTaKp() {
        return moTaKp;
    }

    public void setMoTaKp(String moTaKp) {
        this.moTaKp = moTaKp;
    }

    public Integer getSoLuongKhach() {
        return soLuongKhach;
    }

    public void setSoLuongKhach(Integer soLuongKhach) {
        this.soLuongKhach = soLuongKhach;
    }
}
