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
public class CtTienNghiId implements Serializable {
    
    @Column(name = "ID_TN")
    private String idTn;
    
    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtTienNghiId that = (CtTienNghiId) o;
        return Objects.equals(idTn, that.idTn) && 
               Objects.equals(idHangPhong, that.idHangPhong);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(idTn, idHangPhong);
    }
}
