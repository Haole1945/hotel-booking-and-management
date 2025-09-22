package com.dev.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode
@Embeddable
public class CtPhieuDatId implements Serializable {
    
    @Column(name = "ID_PD")
    private Integer idPd;
    
    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;
    
    public CtPhieuDatId() {}
    
    public CtPhieuDatId(Integer idPd, Integer idHangPhong) {
        this.idPd = idPd;
        this.idHangPhong = idHangPhong;
    }
}
