package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "khuyenmai")
public class KhuyenMai {
    @Id
    @Column(name = "ID_KM")
    private String idKm;

    @Column(name = "MO_TA_KM")
    private String moTaKm;

    @Column(name = "NGAY_BAT_DAU")
    private LocalDate ngayBatDau;

    @Column(name = "NGAY_KET_THUC")
    private LocalDate ngayKetThuc;

    @OneToMany(mappedBy = "khuyenMai", cascade = CascadeType.ALL)
    private List<CtKhuyenMai> chiTietKhuyenMai;
}