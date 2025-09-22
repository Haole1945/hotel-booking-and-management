package com.dev.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class QuanLyId implements Serializable {
    
    @Column(name = "ID_BP")
    private String idBp;

    @Column(name = "NGAYBDQL")
    private LocalDate ngayBdQl;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuanLyId that = (QuanLyId) o;
        return Objects.equals(idBp, that.idBp) && 
               Objects.equals(ngayBdQl, that.ngayBdQl);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(idBp, ngayBdQl);
    }
}
