package com.dev.Hotel.repo;

import com.dev.Hotel.entity.CtPhieuThue;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.entity.Phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CtPhieuThueRepository extends JpaRepository<CtPhieuThue, Integer> {
    
    List<CtPhieuThue> findByPhieuThue(PhieuThue phieuThue);
    
    List<CtPhieuThue> findByPhong(Phong phong);
    
    @Query("SELECT ct FROM CtPhieuThue ct WHERE ct.phieuThue.idPt = :idPt")
    List<CtPhieuThue> findByPhieuThueId(@Param("idPt") Integer idPt);
    
    @Query("SELECT ct FROM CtPhieuThue ct WHERE ct.phong.soPhong = :soPhong")
    List<CtPhieuThue> findByPhongSoPhong(@Param("soPhong") String soPhong);
    
    @Query("SELECT ct FROM CtPhieuThue ct WHERE ct.ngayDen BETWEEN :startDate AND :endDate")
    List<CtPhieuThue> findByNgayDenBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT ct FROM CtPhieuThue ct WHERE ct.ngayDi BETWEEN :startDate AND :endDate")
    List<CtPhieuThue> findByNgayDiBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT ct FROM CtPhieuThue ct WHERE ct.ngayDen <= :currentDate AND ct.ngayDi >= :currentDate")
    List<CtPhieuThue> findCurrentStays(@Param("currentDate") LocalDate currentDate);

    // Get current stays including those checking out today but excluding those with invoices
    @Query("SELECT ct FROM CtPhieuThue ct " +
           "JOIN FETCH ct.phieuThue pt " +
           "JOIN FETCH pt.khachHang kh " +
           "JOIN FETCH ct.phong p " +
           "JOIN FETCH p.hangPhong hp " +
           "JOIN FETCH hp.kieuPhong kp " +
           "JOIN FETCH hp.loaiPhong lp " +
           "JOIN FETCH p.trangThai tt " +
           "WHERE ct.ngayDen <= :currentDate AND ct.ngayDi >= :currentDate " +
           "AND NOT EXISTS (SELECT hd FROM HoaDon hd WHERE hd.phieuThue = pt)")
    List<CtPhieuThue> findCurrentStaysIncludingCheckoutToday(@Param("currentDate") LocalDate currentDate);

    // Get current stays excluding those checking out today and those with invoices (for service management)
    @Query("SELECT ct FROM CtPhieuThue ct " +
           "JOIN FETCH ct.phieuThue pt " +
           "JOIN FETCH pt.khachHang kh " +
           "JOIN FETCH ct.phong p " +
           "JOIN FETCH p.hangPhong hp " +
           "JOIN FETCH hp.kieuPhong kp " +
           "JOIN FETCH hp.loaiPhong lp " +
           "JOIN FETCH p.trangThai tt " +
           "WHERE ct.ngayDen <= :currentDate AND ct.ngayDi > :currentDate " +
           "AND NOT EXISTS (SELECT hd FROM HoaDon hd WHERE hd.phieuThue = pt)")
    List<CtPhieuThue> findCurrentStaysExcludingCheckoutToday(@Param("currentDate") LocalDate currentDate);

    // Get all stays with rooms having status TT002 (occupied) and no invoice (not checked out)
    @Query("SELECT ct FROM CtPhieuThue ct " +
           "JOIN FETCH ct.phieuThue pt " +
           "JOIN FETCH pt.khachHang kh " +
           "JOIN FETCH ct.phong p " +
           "JOIN FETCH p.hangPhong hp " +
           "JOIN FETCH hp.kieuPhong kp " +
           "JOIN FETCH hp.loaiPhong lp " +
           "JOIN FETCH p.trangThai tt " +
           "WHERE p.trangThai.idTt = 'TT002' " +
           "AND NOT EXISTS (SELECT hd FROM HoaDon hd WHERE hd.phieuThue = pt)")
    List<CtPhieuThue> findAllOccupiedRooms();
}
