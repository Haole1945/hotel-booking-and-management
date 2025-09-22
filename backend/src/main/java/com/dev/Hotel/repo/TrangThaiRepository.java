package com.dev.Hotel.repo;

import com.dev.Hotel.entity.TrangThai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrangThaiRepository extends JpaRepository<TrangThai, String> {
    
    Optional<TrangThai> findByTenTrangThai(String tenTrangThai);
    
    boolean existsByTenTrangThai(String tenTrangThai);
}
