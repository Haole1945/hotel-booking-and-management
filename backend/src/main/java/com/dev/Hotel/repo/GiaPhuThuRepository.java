package com.dev.Hotel.repo;

import com.dev.Hotel.entity.GiaPhuThu;
import com.dev.Hotel.entity.GiaPhuThuId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GiaPhuThuRepository extends JpaRepository<GiaPhuThu, GiaPhuThuId> {
    
    @Query("SELECT gpt FROM GiaPhuThu gpt WHERE gpt.id.idPhuThu = :idPhuThu ORDER BY gpt.id.ngayApDung DESC")
    List<GiaPhuThu> findByIdPhuThuOrderByNgayApDungDesc(@Param("idPhuThu") String idPhuThu);
    
    @Query("SELECT gpt FROM GiaPhuThu gpt WHERE gpt.id.idPhuThu = :idPhuThu AND gpt.id.ngayApDung <= :date ORDER BY gpt.id.ngayApDung DESC")
    Optional<GiaPhuThu> findLatestPriceByPhuThu(@Param("idPhuThu") String idPhuThu, @Param("date") LocalDate date);
}
