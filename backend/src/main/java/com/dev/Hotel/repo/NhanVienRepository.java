package com.dev.Hotel.repo;

import com.dev.Hotel.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, String> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT MAX(nv.idNv) FROM NhanVien nv WHERE nv.idNv LIKE 'NV%'")
    String findMaxEmployeeId();

    Optional<NhanVien> findByEmail(String email);

    Optional<NhanVien> findByUsername(String username);

    @Query("SELECT nv FROM NhanVien nv WHERE nv.email = :email OR nv.username = :username")
    Optional<NhanVien> findByEmailOrUsername(@Param("email") String email, @Param("username") String username);

    @Query("SELECT nv FROM NhanVien nv LEFT JOIN FETCH nv.boPhan WHERE nv.email = :email OR nv.username = :username")
    Optional<NhanVien> findByEmailOrUsernameWithBoPhan(@Param("email") String email,
            @Param("username") String username);

    @Query("SELECT bp.tenBp FROM NhanVien nv LEFT JOIN nv.boPhan bp WHERE nv.idNv = :idNv")
    String findDepartmentNameByNhanVienId(@Param("idNv") String idNv);
}
