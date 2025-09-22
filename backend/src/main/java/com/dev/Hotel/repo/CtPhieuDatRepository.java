package com.dev.Hotel.repo;

import com.dev.Hotel.entity.CtPhieuDat;
import com.dev.Hotel.entity.CtPhieuDatId;
import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.HangPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CtPhieuDatRepository extends JpaRepository<CtPhieuDat, CtPhieuDatId> {
    
    List<CtPhieuDat> findByPhieuDat(PhieuDat phieuDat);
    
    List<CtPhieuDat> findByHangPhong(HangPhong hangPhong);
    
    @Query("SELECT cd FROM CtPhieuDat cd WHERE cd.phieuDat.idPd = :idPd")
    List<CtPhieuDat> findByPhieuDatId(@Param("idPd") Integer idPd);
    
    @Query("SELECT cd FROM CtPhieuDat cd WHERE cd.hangPhong.idHangPhong = :idHangPhong")
    List<CtPhieuDat> findByHangPhongId(@Param("idHangPhong") Integer idHangPhong);
    
    // Get booking details by room type in date range (confirmed bookings only)
    @Query("SELECT cd FROM CtPhieuDat cd " +
           "WHERE cd.hangPhong.idHangPhong = :idHangPhong " +
           "AND cd.phieuDat.trangThai IN ('Da xac nhan', 'Da thanh toan') " +
           "AND ((:ngayDen < cd.phieuDat.ngayDi AND :ngayDi > cd.phieuDat.ngayBdThue))")
    List<CtPhieuDat> findBookingsByRoomTypeInDateRange(@Param("idHangPhong") Integer idHangPhong,
                                                       @Param("ngayDen") LocalDate ngayDen,
                                                       @Param("ngayDi") LocalDate ngayDi);
}
