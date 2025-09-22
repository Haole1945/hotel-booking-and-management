package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "tiennghi")
public class TienNghi {
    @Id
    @Column(name = "ID_TN")
    private String idTn;
    
    @Column(name = "TEN_TN")
    private String tenTn;
    
    @Column(name = "ICON")
    private String icon;

    @Column(name = "MO_TA")
    private String moTa;

    @OneToMany(mappedBy = "tienNghi", cascade = CascadeType.ALL)
    private List<CtTienNghi> chiTietTienNghi;
}
