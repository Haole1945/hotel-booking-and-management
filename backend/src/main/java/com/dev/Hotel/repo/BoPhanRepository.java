package com.dev.Hotel.repo;

import com.dev.Hotel.entity.BoPhan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoPhanRepository extends JpaRepository<BoPhan, String> {
    
}
