package com.dev.Hotel.repo;

import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.entity.PhieuDat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PhieuThueRepository extends JpaRepository<PhieuThue, Integer> {
    
    List<PhieuThue> findByKhachHang(KhachHang khachHang);
    
    List<PhieuThue> findByNhanVien(NhanVien nhanVien);
    
    List<PhieuThue> findByPhieuDat(PhieuDat phieuDat);
    
    @Query("SELECT pt FROM PhieuThue pt WHERE pt.khachHang.cccd = :cccd")
    List<PhieuThue> findByKhachHangCccd(@Param("cccd") String cccd);

    // Tìm phiếu thuê đã check-in (có ngày lập) - khách đang lưu trú
    List<PhieuThue> findByNgayLapIsNotNull();
    
    @Query("SELECT DISTINCT pt FROM PhieuThue pt JOIN pt.chiTietPhieuThue ct WHERE ct.ngayDen BETWEEN :startDate AND :endDate")
    List<PhieuThue> findByNgayDenBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT DISTINCT pt FROM PhieuThue pt JOIN pt.chiTietPhieuThue ct WHERE ct.ngayDi BETWEEN :startDate AND :endDate")
    List<PhieuThue> findByNgayDiBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Lấy tất cả phiếu thuê đã check-in (có ngayLap) nhưng chưa check-out (không có hóa đơn)
    // Bao gồm cả những phiếu đã quá ngày dự kiến (ngayDi)
    @Query("SELECT pt FROM PhieuThue pt WHERE pt.ngayLap IS NOT NULL " +
           "AND NOT EXISTS (SELECT hd FROM HoaDon hd WHERE hd.phieuThue = pt)")
    List<PhieuThue> findCurrentStays(@Param("currentDate") LocalDate currentDate);

    // Dashboard specific queries
    @Query("SELECT COUNT(DISTINCT pt) FROM PhieuThue pt JOIN pt.chiTietPhieuThue ct WHERE ct.ngayDen = :date")
    long countByNgayNhanPhong(@Param("date") LocalDate date);

    @Query("SELECT COUNT(DISTINCT pt) FROM PhieuThue pt JOIN pt.chiTietPhieuThue ct WHERE ct.ngayDi = :date")
    long countByNgayTraPhong(@Param("date") LocalDate date);

    // Lấy tất cả phiếu thuê chưa xuất hóa đơn (chưa check out)
    @Query("SELECT pt FROM PhieuThue pt WHERE pt.ngayLap IS NOT NULL AND NOT EXISTS (SELECT hd FROM HoaDon hd WHERE hd.phieuThue = pt)")
    List<PhieuThue> findActiveRentalsWithoutInvoice();

    @Query("SELECT DISTINCT pt FROM PhieuThue pt JOIN pt.chiTietPhieuThue ct WHERE ct.ngayDi = :date")
    List<PhieuThue> findByNgayTraPhong(@Param("date") LocalDate date);
}
