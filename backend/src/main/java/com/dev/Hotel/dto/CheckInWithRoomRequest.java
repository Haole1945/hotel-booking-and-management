package com.dev.Hotel.dto;

import lombok.Data;

@Data
public class CheckInWithRoomRequest {
    private Integer idPhieuDat;
    private String soPhong;
    private String ngayDen;
}
