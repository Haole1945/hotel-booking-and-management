package com.dev.Hotel.entity;

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
public class CtPhuThuId implements Serializable {
    
    private String idPhuThu;
    private Integer idCtPt;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtPhuThuId that = (CtPhuThuId) o;
        return Objects.equals(idPhuThu, that.idPhuThu) && 
               Objects.equals(idCtPt, that.idCtPt);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(idPhuThu, idCtPt);
    }
}
