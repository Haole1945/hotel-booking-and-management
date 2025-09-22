package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.KieuPhong;

public interface IKieuPhongService {
    Response getAllKieuPhong();
    Response getKieuPhongById(String id);
    Response createKieuPhong(KieuPhong kieuPhong);
    Response updateKieuPhong(String id, KieuPhong kieuPhong);
    Response deleteKieuPhong(String id);
}
