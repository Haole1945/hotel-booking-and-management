package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.Phong;

import java.time.LocalDate;

public interface IPhongService {
    
    // CRUD operations
    Response getAllPhong();
    Response getPhongById(String soPhong);
    Response getPhongDetails(String soPhong);
    Response createPhong(Phong phong);
    Response updatePhong(String soPhong, Phong phong);
    Response deletePhong(String soPhong);
    
    // Business logic
    Response getAvailableRooms();
    Response getOccupiedRooms();
    Response getMaintenanceRooms();
    Response getCleaningRooms();
    Response getAvailableRoomsByDateRange(LocalDate checkIn, LocalDate checkOut);
    Response getAvailableRoomsByDateRange(LocalDate checkIn, LocalDate checkOut, String idKp, String idLp);
    Response getPhongByHangPhong(Integer idHangPhong);
    Response getPhongByTang(Integer tang);
    Response getPhongByTrangThai(String idTrangThai);
    
    // Room management
    Response updateRoomStatus(String soPhong, String idTrangThai);
    Response updateRoomTypeAndCategory(String soPhong, String idKieuPhong, String idLoaiPhong);
    Response getRoomsByType(String idKieuPhong);
    Response getRoomsByCategory(String idLoaiPhong);
    
    // Search and filter
    Response searchRooms(String keyword);
    Response filterRooms(Integer tang, String idHangPhong, String idTrangThai);
    
    // Availability check
    boolean isRoomAvailable(String soPhong, LocalDate checkIn, LocalDate checkOut);
    Response checkRoomAvailability(String soPhong, LocalDate checkIn, LocalDate checkOut);
}
