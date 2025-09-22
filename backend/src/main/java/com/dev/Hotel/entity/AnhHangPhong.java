package com.dev.Hotel.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "anh_hang_phong")
public class AnhHangPhong {
    @Id
    @Column(name = "ID_ANH_HANG_PHONG")
    private String idAnhHangPhong;
    
    @Column(name = "URL_ANH")
    private String urlAnh;
    
    @JsonBackReference("hangphong-anh")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_HANG_PHONG")
    private HangPhong hangPhong;
}