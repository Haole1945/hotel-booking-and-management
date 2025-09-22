package com.dev.Hotel.repo;

import com.dev.Hotel.entity.HoaDon;
import com.dev.Hotel.entity.PhieuThue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, String> {
    
    // Find by PhieuThue
    Optional<HoaDon> findByPhieuThue(PhieuThue phieuThue);
    
    // Find by status
    List<HoaDon> findByTrangThai(String trangThai);
    
    // Find by date range
    List<HoaDon> findByNgayLapBetween(LocalDate startDate, LocalDate endDate);
    
    // Find by ID pattern for generating new IDs
    List<HoaDon> findByIdHdStartingWithOrderByIdHdDesc(String prefix);
    
    // Find by customer (through PhieuThue)
    @Query("SELECT hd FROM HoaDon hd WHERE hd.phieuThue.khachHang.cccd = :cccd")
    List<HoaDon> findByCustomerCccd(@Param("cccd") String cccd);
    
    // Find by employee
    @Query("SELECT hd FROM HoaDon hd WHERE hd.nhanVien.idNv = :idNv")
    List<HoaDon> findByEmployeeId(@Param("idNv") String idNv);
    
    // Find today's invoices
    @Query("SELECT hd FROM HoaDon hd WHERE hd.ngayLap = :today")
    List<HoaDon> findTodayInvoices(@Param("today") LocalDate today);
    
    // Find unpaid invoices
    @Query("SELECT hd FROM HoaDon hd WHERE hd.trangThai = 'Chưa thanh toán'")
    List<HoaDon> findUnpaidInvoices();
    
    // Find paid invoices
    @Query("SELECT hd FROM HoaDon hd WHERE hd.trangThai = 'Đã thanh toán'")
    List<HoaDon> findPaidInvoices();
}
