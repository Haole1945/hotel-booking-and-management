package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.DoiPhongRequest;

import java.time.LocalDate;

public interface IDoiPhongService {
    
    // CRUD operations
    Response getAllDoiPhong();
    Response getDoiPhongById(Integer idCtPt, String soPhongMoi);
    Response createDoiPhong(DoiPhongRequest request);
    Response updateDoiPhong(Integer idCtPt, String soPhongMoi, DoiPhongRequest request);
    Response deleteDoiPhong(Integer idCtPt, String soPhongMoi);
    
    // Business logic
    Response getDoiPhongByCtPhieuThue(Integer idCtPt);
    Response getDoiPhongByPhongMoi(String soPhongMoi);
    Response getDoiPhongByKhachHang(String cccd);
    Response getDoiPhongByDateRange(LocalDate startDate, LocalDate endDate);
    
    // Room change management
    Response requestRoomChange(DoiPhongRequest request);
    Response changeRoom(DoiPhongRequest request);
    Response approveRoomChange(Integer idCtPt, String soPhongMoi);
    Response cancelRoomChange(Integer idCtPt, String soPhongMoi, String reason);
    Response completeRoomChange(Integer idCtPt, String soPhongMoi);
    
    // Validation and checking
    Response checkRoomChangeEligibility(Integer idCtPt);
    Response getAvailableRoomsForChange(Integer idCtPt);
    Response calculateRoomChangeFee(Integer idCtPt, String soPhongMoi);
    Response validateRoomChange(DoiPhongRequest request);
    
    // History and reporting
    Response getRoomChangeHistory(Integer idCtPt);
    Response getRoomChangeStatistics(LocalDate startDate, LocalDate endDate);
    Response getCurrentRoomChanges();
    
    // Search and filter
    Response searchDoiPhong(String keyword);
    Response filterDoiPhong(LocalDate startDate, LocalDate endDate, String cccd);

    // Debug
    Response debugCtPhieuThue(Integer idCtPt);
}
