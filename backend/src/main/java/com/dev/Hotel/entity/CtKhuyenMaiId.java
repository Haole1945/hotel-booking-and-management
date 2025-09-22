package com.dev.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CtKhuyenMaiId implements Serializable {
    
    @Column(name = "ID_KM")
    private String idKm;

    @Column(name = "ID_HANGPHONG")
    private Integer idHangPhong;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtKhuyenMaiId that = (CtKhuyenMaiId) o;
        return Objects.equals(idKm, that.idKm) && 
               Objects.equals(idHangPhong, that.idHangPhong);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(idKm, idHangPhong);
    }
}
