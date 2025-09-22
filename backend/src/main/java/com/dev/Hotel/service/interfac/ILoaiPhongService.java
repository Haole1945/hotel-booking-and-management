package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.LoaiPhong;

public interface ILoaiPhongService {
    Response getAllLoaiPhong();
    Response getLoaiPhongById(String id);
    Response createLoaiPhong(LoaiPhong loaiPhong);
    Response updateLoaiPhong(String id, LoaiPhong loaiPhong);
    Response deleteLoaiPhong(String id);
}
