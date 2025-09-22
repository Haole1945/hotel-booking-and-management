package com.dev.Hotel.dto;

import lombok.Data;
import java.util.List;

@Data
public class CheckInMultipleRoomsRequest {
    private Integer idPhieuDat;
    private String ngayDen;
    private List<String> danhSachSoPhong; // List of room numbers to check-in
}
