package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Data
@Getter
@Setter
@Entity
@Table(name = "ctkhacho")
@IdClass(CtKhachO.CtKhachOId.class)
public class CtKhachO {

    @Id
    @Column(name = "ID_CT_PT")
    private Integer idCtPt;

    @Id
    @Column(name = "CCCD")
    private String cccd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CT_PT", insertable = false, updatable = false)
    private CtPhieuThue ctPhieuThue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CCCD", insertable = false, updatable = false)
    private KhachHang khachHang;

    // Composite Key Class as inner class
    @Data
    public static class CtKhachOId implements Serializable {
        private Integer idCtPt;
        private String cccd;

        public CtKhachOId() {
        }

        public CtKhachOId(Integer idCtPt, String cccd) {
            this.idCtPt = idCtPt;
            this.cccd = cccd;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;

            CtKhachOId that = (CtKhachOId) o;

            if (!idCtPt.equals(that.idCtPt))
                return false;
            return cccd.equals(that.cccd);
        }

        @Override
        public int hashCode() {
            int result = idCtPt.hashCode();
            result = 31 * result + cccd.hashCode();
            return result;
        }
    }

    // Manual getters and setters
    public Integer getIdCtPt() {
        return idCtPt;
    }

    public void setIdCtPt(Integer idCtPt) {
        this.idCtPt = idCtPt;
    }

    public String getCccd() {
        return cccd;
    }

    public void setCccd(String cccd) {
        this.cccd = cccd;
    }

    public CtPhieuThue getCtPhieuThue() {
        return ctPhieuThue;
    }

    public void setCtPhieuThue(CtPhieuThue ctPhieuThue) {
        this.ctPhieuThue = ctPhieuThue;
    }

    public KhachHang getKhachHang() {
        return khachHang;
    }

    public void setKhachHang(KhachHang khachHang) {
        this.khachHang = khachHang;
    }
}
