package com.dev.Hotel.repo;

import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.entity.KieuPhong;
import com.dev.Hotel.entity.LoaiPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HangPhongRepository extends JpaRepository<HangPhong, Integer> {

        List<HangPhong> findByKieuPhong(KieuPhong kieuPhong);

        List<HangPhong> findByLoaiPhong(LoaiPhong loaiPhong);

        @Query("SELECT hp FROM HangPhong hp WHERE hp.kieuPhong.idKp = :kieuPhongId")
        List<HangPhong> findByKieuPhongId(@Param("kieuPhongId") String kieuPhongId);

        @Query("SELECT hp FROM HangPhong hp WHERE hp.loaiPhong.idLp = :loaiPhongId")
        List<HangPhong> findByLoaiPhongId(@Param("loaiPhongId") String loaiPhongId);

        @Query("SELECT hp FROM HangPhong hp WHERE hp.kieuPhong.idKp = :kieuPhongId AND hp.loaiPhong.idLp = :loaiPhongId")
        List<HangPhong> findByKieuPhongAndLoaiPhong(@Param("kieuPhongId") String kieuPhongId,
                        @Param("loaiPhongId") String loaiPhongId);

        @Query("SELECT DISTINCT hp FROM HangPhong hp " +
                        "LEFT JOIN FETCH hp.kieuPhong kp " +
                        "LEFT JOIN FETCH hp.loaiPhong lp")
        List<HangPhong> findAllWithDetails();

        @Query("SELECT DISTINCT hp FROM HangPhong hp " +
                        "LEFT JOIN FETCH hp.kieuPhong kp " +
                        "LEFT JOIN FETCH hp.loaiPhong lp " +
                        "LEFT JOIN FETCH hp.danhSachAnh " +
                        "WHERE hp.idHangPhong = :idHangPhong")
        Optional<HangPhong> findByIdWithImages(@Param("idHangPhong") Integer idHangPhong);

        // Gọi stored procedure để lấy top 3 hạng phòng hot nhất trong tháng
        @Query(value = "CALL GetHotHangPhongThisMonth()", nativeQuery = true)
        List<Object[]> getHotHangPhongThisMonth();
}
