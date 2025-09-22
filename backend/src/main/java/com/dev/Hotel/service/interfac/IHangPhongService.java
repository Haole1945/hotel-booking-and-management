package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.HangPhong;

public interface IHangPhongService {

    // CRUD operations
    Response getAllHangPhong();

    Response getHangPhongById(Integer idHangPhong);

    Response createHangPhong(HangPhong hangPhong);

    Response updateHangPhong(Integer idHangPhong, HangPhong hangPhong);

    Response deleteHangPhong(Integer idHangPhong);

    // Business logic
    Response getHangPhongByKieuPhong(String idKp);

    Response getHangPhongByLoaiPhong(String idLp);

    Response getHangPhongByKieuAndLoai(String idKp, String idLp);

    // Room category management
    Response getAvailableHangPhong();

    Response getHangPhongWithAvailableRooms();

    Response getHangPhongStatistics();

    // Search and filter
    Response searchHangPhong(String keyword);

    Response filterHangPhong(String idKp, String idLp);

    // Hot room categories
    Response getHotHangPhongThisMonth();

    // All room categories with current prices
    Response getAllHangPhongWithPrices();
}
