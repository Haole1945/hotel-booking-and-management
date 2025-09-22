package com.dev.Hotel.repo;

import com.dev.Hotel.entity.NhomQuyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhomQuyenRepository extends JpaRepository<NhomQuyen, String> {
    
}
