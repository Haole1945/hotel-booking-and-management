package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "phieuthue")
public class PhieuThue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PT")
    private Integer idPt;
    
    @Column(name = "NGAY_LAP")
    private LocalDate ngayLap;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV")
    private NhanVien nhanVien;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CCCD")
    private KhachHang khachHang;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PD")
    private PhieuDat phieuDat;
    
    @OneToMany(mappedBy = "phieuThue", cascade = CascadeType.ALL)
    private List<CtPhieuThue> chiTietPhieuThue;
}