package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "giaphuthu")
public class GiaPhuThu {
    @EmbeddedId
    private GiaPhuThuId id;

    @Column(name = "GIA")
    private BigDecimal gia;

    @Column(name = "ID_NV")
    private String idNv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PHU_THU", insertable = false, updatable = false)
    private PhuThu phuThu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV", insertable = false, updatable = false)
    private NhanVien nhanVien;
}
