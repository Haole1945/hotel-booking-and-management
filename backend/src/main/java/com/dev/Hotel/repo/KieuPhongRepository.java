package com.dev.Hotel.repo;

import com.dev.Hotel.entity.KieuPhong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KieuPhongRepository extends JpaRepository<KieuPhong, String> {
    
    Optional<KieuPhong> findByTenKp(String tenKp);
    
    boolean existsByTenKp(String tenKp);
    

}
