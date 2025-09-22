package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Data
@Entity
@Table(name = "bo_phan")
public class BoPhan {
    @Id
    @Column(name = "ID_BP")
    private String idBp;

    @Column(name = "TENBP")
    private String tenBp;

    @JsonIgnore
    @OneToMany(mappedBy = "boPhan", cascade = CascadeType.ALL)
    private List<NhanVien> danhSachNhanVien;

    @JsonIgnore
    @OneToMany(mappedBy = "boPhan", cascade = CascadeType.ALL)
    private List<QuanLy> danhSachQuanLy;
}
