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
public class CtDichVuId implements Serializable {
    
    private Integer idCtPt;
    private String idDv;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CtDichVuId that = (CtDichVuId) o;
        return Objects.equals(idCtPt, that.idCtPt) && 
               Objects.equals(idDv, that.idDv);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(idCtPt, idDv);
    }
}
