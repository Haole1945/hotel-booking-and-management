package com.dev.Hotel.repo;

import com.dev.Hotel.entity.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DichVuRepository extends JpaRepository<DichVu, String> {

    @Query("SELECT d.idDv FROM DichVu d WHERE d.idDv LIKE 'DV%' ORDER BY d.idDv DESC")
    List<String> findAllDichVuIdsOrderByDesc();

    @Query("SELECT MAX(d.idDv) FROM DichVu d WHERE d.idDv LIKE 'DV%'")
    String findMaxDichVuId();
}
