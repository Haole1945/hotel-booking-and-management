package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@Table(name = "quan_ly")
@IdClass(QuanLyId.class)
public class QuanLy {

    @Id
    @Column(name = "ID_BP")
    private String idBp;

    @Id
    @Column(name = "NGAYBDQL")
    private java.time.LocalDate ngayBdQl;

    @Column(name = "MANV")
    private String maNv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_BP", insertable = false, updatable = false)
    private BoPhan boPhan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MANV", insertable = false, updatable = false)
    private NhanVien nhanVien;
}
