package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "dich_vu")
public class DichVu {
    @Id
    @Column(name = "ID_DV")
    private String idDv;
    
    @Column(name = "TEN_DV")
    private String tenDv;

    @Column(name = "MO_TA")
    private String moTa;

    @Column(name = "DON_VI_TINH")
    private String donViTinh;
    
    @OneToMany(mappedBy = "dichVu", cascade = CascadeType.ALL)
    private List<GiaDichVu> danhSachGia;

    @OneToMany(mappedBy = "dichVu", cascade = CascadeType.ALL)
    private List<CtDichVu> chiTietDichVu;
}
