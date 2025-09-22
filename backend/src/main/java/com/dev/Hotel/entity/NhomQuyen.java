package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "nhom_quyen")
public class NhomQuyen {
    @Id
    @Column(name = "ID_NQ")
    private String idNq;

    @Column(name = "TEN_NQ")
    private String tenNq;

    @OneToMany(mappedBy = "nhomQuyen", cascade = CascadeType.ALL)
    private List<NhanVien> danhSachNhanVien;
}
