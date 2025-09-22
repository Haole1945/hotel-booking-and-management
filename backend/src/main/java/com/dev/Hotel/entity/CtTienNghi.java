package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@Table(name = "cttiennghi")
@IdClass(CtTienNghiId.class)
public class CtTienNghi {

    @Id
    @Column(name = "ID_TN")
    private String idTn;

    @Id
    @Column(name = "ID_HANG_PHONG")
    private Integer idHangPhong;

    @Column(name = "SO_LUONG")
    private Integer soLuong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TN", insertable = false, updatable = false)
    private TienNghi tienNghi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HANG_PHONG", insertable = false, updatable = false)
    private HangPhong hangPhong;
}
