package com.dev.Hotel.repo;

import com.dev.Hotel.entity.TienNghi;
import com.dev.Hotel.entity.HangPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TienNghiRepository extends JpaRepository<TienNghi, String> {

    @Query(value = "SELECT t.* FROM tiennghi t " +
            "INNER JOIN cttiennghi ct ON t.ID_TN = ct.ID_TN " +
            "WHERE ct.ID_HANG_PHONG = :idHangPhong", nativeQuery = true)
    List<TienNghi> findByHangPhongIdNative(@Param("idHangPhong") Integer idHangPhong);

    // Method for HangPhong entity
    default List<TienNghi> findByHangPhong(HangPhong hangPhong) {
        return findByHangPhongIdNative(hangPhong.getIdHangPhong());
    }



    // Query để tìm ID tiện ích lớn nhất
    @Query("SELECT MAX(t.idTn) FROM TienNghi t WHERE t.idTn LIKE 'TN%'")
    String findMaxTienNghiId();
}
