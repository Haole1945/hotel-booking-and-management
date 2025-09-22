package com.dev.Hotel.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "trangthai")
public class TrangThai {
    @Id
    @Column(name = "ID_TT")
    private String idTt;
    
    @Column(name = "TEN_TRANG_THAI")
    private String tenTrangThai;
}