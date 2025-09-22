package com.dev.Hotel.repo;

import com.dev.Hotel.entity.PhieuDat;
import com.dev.Hotel.entity.KhachHang;
import com.dev.Hotel.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PhieuDatRepository extends JpaRepository<PhieuDat, Integer> {
    
    List<PhieuDat> findByKhachHang(KhachHang khachHang);
    
    List<PhieuDat> findByNhanVien(NhanVien nhanVien);
    
    List<PhieuDat> findByTrangThai(String trangThai);
    
    @Query("SELECT pd FROM PhieuDat pd WHERE pd.khachHang.cccd = :cccd")
    List<PhieuDat> findByKhachHangCccd(@Param("cccd") String cccd);
    
    @Query("SELECT pd FROM PhieuDat pd WHERE pd.ngayDat BETWEEN :startDate AND :endDate")
    List<PhieuDat> findByNgayDatBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    


    // Dashboard specific queries
    @Query("SELECT COUNT(pd) FROM PhieuDat pd WHERE pd.ngayDat = :date")
    long countByNgayDat(@Param("date") LocalDate date);

    @Query("SELECT COUNT(pd) FROM PhieuDat pd WHERE pd.ngayBdThue = :date")
    long countByNgayBdThue(@Param("date") LocalDate date);

    @Query("SELECT COUNT(pd) FROM PhieuDat pd WHERE pd.trangThai = :trangThai")
    long countByTrangThai(@Param("trangThai") String trangThai);

    @Query("SELECT COUNT(pd) FROM PhieuDat pd WHERE pd.ngayBdThue = :date AND pd.trangThai = :trangThai")
    long countByNgayBdThueAndTrangThai(@Param("date") LocalDate date, @Param("trangThai") String trangThai);

    @Query("SELECT COUNT(pd) FROM PhieuDat pd WHERE pd.ngayDi = :date AND pd.trangThai = :trangThai")
    long countByNgayDiAndTrangThai(@Param("date") LocalDate date, @Param("trangThai") String trangThai);

    @Query("SELECT pd FROM PhieuDat pd WHERE pd.ngayBdThue = :date AND pd.trangThai = :trangThai ORDER BY pd.ngayDat ASC")
    List<PhieuDat> findByNgayBdThueAndTrangThai(@Param("date") LocalDate date, @Param("trangThai") String trangThai);

    // Query with JOIN to fetch chi tiet phieu dat and hang phong info
    @Query("SELECT DISTINCT pd FROM PhieuDat pd " +
           "LEFT JOIN FETCH pd.chiTietPhieuDat ctpd " +
           "LEFT JOIN FETCH ctpd.hangPhong hp " +
           "LEFT JOIN FETCH hp.kieuPhong kp " +
           "LEFT JOIN FETCH hp.loaiPhong lp " +
           "LEFT JOIN FETCH pd.khachHang kh " +
           "LEFT JOIN FETCH pd.nhanVien nv")
    List<PhieuDat> findAllWithDetails();

    @Query("SELECT DISTINCT pd FROM PhieuDat pd " +
           "LEFT JOIN FETCH pd.chiTietPhieuDat ctpd " +
           "LEFT JOIN FETCH ctpd.hangPhong hp " +
           "LEFT JOIN FETCH hp.kieuPhong kp " +
           "LEFT JOIN FETCH hp.loaiPhong lp " +
           "LEFT JOIN FETCH pd.khachHang kh " +
           "LEFT JOIN FETCH pd.nhanVien nv " +
           "WHERE pd.trangThai = :trangThai")
    List<PhieuDat> findByTrangThaiWithDetails(@Param("trangThai") String trangThai);

    @Query("SELECT DISTINCT pd FROM PhieuDat pd " +
           "LEFT JOIN FETCH pd.chiTietPhieuDat ctpd " +
           "LEFT JOIN FETCH ctpd.hangPhong hp " +
           "LEFT JOIN FETCH hp.kieuPhong kp " +
           "LEFT JOIN FETCH hp.loaiPhong lp " +
           "LEFT JOIN FETCH pd.khachHang kh " +
           "LEFT JOIN FETCH pd.nhanVien nv " +
           "WHERE pd.idPd = :idPd")
    Optional<PhieuDat> findByIdWithDetails(@Param("idPd") Integer idPd);
}
