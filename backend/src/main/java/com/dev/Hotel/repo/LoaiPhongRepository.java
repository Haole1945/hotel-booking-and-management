package com.dev.Hotel.repo;

import com.dev.Hotel.entity.LoaiPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoaiPhongRepository extends JpaRepository<LoaiPhong, String> {
    
    Optional<LoaiPhong> findByTenLp(String tenLp);
    
    boolean existsByTenLp(String tenLp);
    

}
