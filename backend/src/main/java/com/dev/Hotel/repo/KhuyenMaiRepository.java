package com.dev.Hotel.repo;

import com.dev.Hotel.entity.KhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, String> {

    @Query("SELECT DISTINCT km FROM KhuyenMai km " +
           "JOIN FETCH km.chiTietKhuyenMai ct " +
           "WHERE ct.idHangPhong = :idHangPhong " +
           "AND km.ngayBatDau <= :ngayHienTai AND km.ngayKetThuc >= :ngayHienTai")
    List<KhuyenMai> findActiveByHangPhongId(@Param("idHangPhong") Integer idHangPhong,
            @Param("ngayHienTai") LocalDate ngayHienTai);

    @Query("SELECT DISTINCT km FROM KhuyenMai km " +
           "LEFT JOIN FETCH km.chiTietKhuyenMai " +
           "WHERE km.ngayBatDau <= :ngayHienTai AND km.ngayKetThuc >= :ngayHienTai")
    List<KhuyenMai> findActivePromotions(@Param("ngayHienTai") LocalDate ngayHienTai);

    // Method for finding active promotions by hang phong
    default List<KhuyenMai> findActivePromotionsByHangPhong(Integer idHangPhong, LocalDate ngayHienTai) {
        return findActiveByHangPhongId(idHangPhong, ngayHienTai);
    }
}
