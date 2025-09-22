package com.dev.Hotel.repo;

import com.dev.Hotel.entity.GiaHangPhong;
import com.dev.Hotel.entity.GiaHangPhongId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GiaHangPhongRepository extends JpaRepository<GiaHangPhong, GiaHangPhongId> {

       // Lấy giá phòng hiện tại (mới nhất) cho một hạng phòng
       @Query(value = "SELECT * FROM gia_hang_phong ghp WHERE ghp.ID_HANG_PHONG = :idHangPhong " +
                     "AND ghp.NGAYAPDUNG <= :ngayHienTai " +
                     "ORDER BY ghp.NGAYAPDUNG DESC LIMIT 1", nativeQuery = true)
       Optional<GiaHangPhong> findLatestPriceByHangPhong(@Param("idHangPhong") Integer idHangPhong,
                     @Param("ngayHienTai") LocalDate ngayHienTai);

       // Lấy tất cả giá của một hạng phòng, sắp xếp theo ngày áp dụng giảm dần
       List<GiaHangPhong> findByIdHangPhongOrderByNgayApDungDesc(Integer idHangPhong);

       // Tìm giá theo hạng phòng và ngày áp dụng
       Optional<GiaHangPhong> findByIdHangPhongAndNgayApDung(Integer idHangPhong, LocalDate ngayApDung);

       // Lấy tất cả giá áp dụng cho một hạng phòng trong khoảng thời gian
       @Query(value = "SELECT * FROM gia_hang_phong ghp WHERE ghp.ID_HANG_PHONG = :idHangPhong " +
                     "AND ghp.NGAYAPDUNG <= :ngayKetThuc " +
                     "ORDER BY ghp.NGAYAPDUNG DESC", nativeQuery = true)
       List<GiaHangPhong> findPricesForDateRange(@Param("idHangPhong") Integer idHangPhong,
                     @Param("ngayKetThuc") LocalDate ngayKetThuc);

       // Lấy giá phòng tại một ngày cụ thể
       @Query(value = "SELECT * FROM gia_hang_phong ghp WHERE ghp.ID_HANG_PHONG = :idHangPhong " +
                     "AND ghp.NGAYAPDUNG <= :ngayApDung " +
                     "ORDER BY ghp.NGAYAPDUNG DESC LIMIT 1", nativeQuery = true)
       Optional<GiaHangPhong> findPriceByHangPhongAndDate(@Param("idHangPhong") Integer idHangPhong,
                     @Param("ngayApDung") LocalDate ngayApDung);
}
