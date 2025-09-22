package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "phu_thu")
public class PhuThu {
    @Id
    @Column(name = "ID_PHU_THU")
    private String idPhuThu;

    @Column(name = "TEN_PHU_THU")
    private String tenPhuThu;

    @Column(name = "LY_DO")
    private String lyDo;

    @OneToMany(mappedBy = "phuThu", cascade = CascadeType.ALL)
    private List<CtPhuThu> chiTietPhuThu;

    @OneToMany(mappedBy = "phuThu", cascade = CascadeType.ALL)
    private List<GiaPhuThu> danhSachGia;
}
