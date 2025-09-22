package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "hoa_don")
public class HoaDon {
    @Id
    @Column(name = "ID_HD")
    private String idHd;
    
    @Column(name = "NGAY_LAP")
    private LocalDate ngayLap;
    
    @Column(name = "TONG_TIEN")
    private BigDecimal tongTien;
    
    @Column(name = "TRANG_THAI")
    private String trangThai;

    @Column(name = "SOTIENGIAM")
    private BigDecimal soTienGiam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NV")
    private NhanVien nhanVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PT")
    private PhieuThue phieuThue;
}