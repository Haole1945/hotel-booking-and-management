package com.dev.Hotel.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "phong")
public class Phong {
    @Id
    @Column(name = "SOPHONG")
    private String soPhong;
    
    @Column(name = "TANG")
    private Integer tang;
    
    @JsonBackReference("hangphong-phong")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HANG_PHONG")
    private HangPhong hangPhong;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TT")
    private TrangThai trangThai;
}