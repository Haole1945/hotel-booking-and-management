package com.dev.Hotel.repo;

import com.dev.Hotel.entity.PhuThu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhuThuRepository extends JpaRepository<PhuThu, String> {
}
