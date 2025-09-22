package com.dev.Hotel.repo;

import com.dev.Hotel.entity.GiaDichVu;
import com.dev.Hotel.entity.GiaDichVuId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GiaDichVuRepository extends JpaRepository<GiaDichVu, GiaDichVuId> {

    @Query("SELECT gdv FROM GiaDichVu gdv WHERE gdv.id.idDv = :idDv ORDER BY gdv.id.ngayApDung DESC")
    List<GiaDichVu> findByIdDvOrderByNgayApDungDesc(@Param("idDv") String idDv);

    @Query("SELECT gdv FROM GiaDichVu gdv WHERE gdv.id.idDv = :idDv AND gdv.id.ngayApDung <= :date ORDER BY gdv.id.ngayApDung DESC")
    Optional<GiaDichVu> findLatestPriceByDichVu(@Param("idDv") String idDv, @Param("date") LocalDate date);

    @Query("SELECT gdv FROM GiaDichVu gdv WHERE gdv.id.idDv = :idDv AND gdv.id.ngayApDung = :ngayApDung")
    Optional<GiaDichVu> findByIdDvAndNgayApDung(@Param("idDv") String idDv, @Param("ngayApDung") LocalDate ngayApDung);

    @Query("SELECT COUNT(gdv) > 0 FROM GiaDichVu gdv WHERE gdv.id.idDv = :idDv AND gdv.id.ngayApDung = :ngayApDung")
    boolean existsByIdDvAndNgayApDung(@Param("idDv") String idDv, @Param("ngayApDung") LocalDate ngayApDung);
}
