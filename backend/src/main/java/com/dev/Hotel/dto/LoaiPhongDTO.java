package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoaiPhongDTO {
    private String idLp;
    private String tenLp;
    private String moTaLp;

    public LoaiPhongDTO() {}

    public LoaiPhongDTO(String idLp, String tenLp, String moTaLp) {
        this.idLp = idLp;
        this.tenLp = tenLp;
        this.moTaLp = moTaLp;
    }

    public String getIdLp() {
        return idLp;
    }

    public void setIdLp(String idLp) {
        this.idLp = idLp;
    }

    public String getTenLp() {
        return tenLp;
    }

    public void setTenLp(String tenLp) {
        this.tenLp = tenLp;
    }

    public String getMoTaLp() {
        return moTaLp;
    }

    public void setMoTaLp(String moTaLp) {
        this.moTaLp = moTaLp;
    }
}
