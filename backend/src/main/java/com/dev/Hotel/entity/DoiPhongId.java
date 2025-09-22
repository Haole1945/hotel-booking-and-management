package com.dev.Hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class DoiPhongId implements Serializable {

    @Column(name = "ID_CT_PT")
    private Integer idCtPt;

    @Column(name = "SOPHONGMOI")
    private String soPhongMoi;
}