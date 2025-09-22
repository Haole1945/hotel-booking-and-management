package com.dev.Hotel.repo;

import com.dev.Hotel.entity.CtDichVu;
import com.dev.Hotel.entity.CtDichVuId;
import com.dev.Hotel.entity.CtPhieuThue;
import com.dev.Hotel.entity.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CtDichVuRepository extends JpaRepository<CtDichVu, CtDichVuId> {
    
    List<CtDichVu> findByCtPhieuThue(CtPhieuThue ctPhieuThue);
    
    List<CtDichVu> findByDichVu(DichVu dichVu);
    
    @Query("SELECT cd FROM CtDichVu cd WHERE cd.ctPhieuThue.idCtPt = :idCtPt")
    List<CtDichVu> findByCtPhieuThueId(@Param("idCtPt") Integer idCtPt);
    
    @Query("SELECT cd FROM CtDichVu cd WHERE cd.dichVu.idDv = :idDv")
    List<CtDichVu> findByDichVuId(@Param("idDv") String idDv);

    @Query("SELECT cd FROM CtDichVu cd WHERE cd.id.idCtPt = :idCtPt AND cd.id.idDv = :idDv")
    CtDichVu findByIdCtPtAndIdDv(@Param("idCtPt") Integer idCtPt, @Param("idDv") String idDv);
    
    @Query("SELECT cd FROM CtDichVu cd WHERE cd.ngaySuDung BETWEEN :startDate AND :endDate")
    List<CtDichVu> findByNgaySuDungBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    

    
    // Query to get all service usage with details
    @Query("SELECT cd FROM CtDichVu cd " +
           "JOIN FETCH cd.dichVu dv " +
           "JOIN FETCH cd.ctPhieuThue ct " +
           "JOIN FETCH ct.phieuThue pt " +
           "JOIN FETCH pt.khachHang kh " +
           "JOIN FETCH ct.phong p")
    List<CtDichVu> findAllWithDetails();
    
    // Query to get current active service usage (excluding checkout today and those with invoices)
    @Query("SELECT cd FROM CtDichVu cd " +
           "JOIN FETCH cd.dichVu dv " +
           "JOIN FETCH cd.ctPhieuThue ct " +
           "JOIN FETCH ct.phieuThue pt " +
           "JOIN FETCH pt.khachHang kh " +
           "JOIN FETCH ct.phong p " +
           "WHERE ct.ngayDen <= :currentDate AND ct.ngayDi > :currentDate " +
           "AND NOT EXISTS (SELECT hd FROM HoaDon hd WHERE hd.phieuThue = pt)")
    List<CtDichVu> findCurrentActiveServices(@Param("currentDate") LocalDate currentDate);
}
