package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Data
@Getter
@Setter
@Entity
@Table(name = "ctkhuyenmai")
@IdClass(CtKhuyenMaiId.class)
public class CtKhuyenMai {

    @Id
    @Column(name = "ID_KM")
    private String idKm;

    @Id
    @Column(name = "ID_HANGPHONG")
    private Integer idHangPhong;

    @Column(name = "PHAN_TRAM_GIAM")
    private BigDecimal phanTramGiam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_KM", insertable = false, updatable = false)
    private KhuyenMai khuyenMai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HANGPHONG", insertable = false, updatable = false)
    private HangPhong hangPhong;
}
