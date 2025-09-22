package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Embeddable
public class GiaPhuThuId implements java.io.Serializable {
    @Column(name = "ID_PHU_THU")
    private String idPhuThu;
    
    @Column(name = "NGAY_AP_DUNG")
    private LocalDate ngayApDung;
    
    // Default constructor
    public GiaPhuThuId() {}
    
    public GiaPhuThuId(String idPhuThu, LocalDate ngayApDung) {
        this.idPhuThu = idPhuThu;
        this.ngayApDung = ngayApDung;
    }
    
    // equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GiaPhuThuId that = (GiaPhuThuId) o;
        return java.util.Objects.equals(idPhuThu, that.idPhuThu) &&
               java.util.Objects.equals(ngayApDung, that.ngayApDung);
    }
    
    @Override
    public int hashCode() {
        return java.util.Objects.hash(idPhuThu, ngayApDung);
    }
}
