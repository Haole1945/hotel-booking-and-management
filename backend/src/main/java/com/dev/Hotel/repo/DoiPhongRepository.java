package com.dev.Hotel.repo;

import com.dev.Hotel.entity.DoiPhong;
import com.dev.Hotel.entity.DoiPhongId;
import com.dev.Hotel.entity.CtPhieuThue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoiPhongRepository extends JpaRepository<DoiPhong, DoiPhongId> {
    
    // Tìm lịch sử đổi phòng theo chi tiết phiếu thuê
    List<DoiPhong> findByCtPhieuThue(CtPhieuThue ctPhieuThue);
    
    // Tìm lịch sử đổi phòng theo ID chi tiết phiếu thuê
    @Query("SELECT dp FROM DoiPhong dp WHERE dp.ctPhieuThue.idCtPt = :idCtPt ORDER BY dp.ngayDen DESC")
    List<DoiPhong> findByCtPhieuThueId(@Param("idCtPt") Integer idCtPt);

    // Tìm lịch sử đổi phòng theo số phòng mới
    @Query("SELECT dp FROM DoiPhong dp WHERE dp.phongMoi.soPhong = :soPhongMoi ORDER BY dp.ngayDen DESC")
    List<DoiPhong> findByPhongMoiSoPhong(@Param("soPhongMoi") String soPhongMoi);

    // Tìm lịch sử đổi phòng trong khoảng thời gian
    @Query("SELECT dp FROM DoiPhong dp WHERE dp.ngayDen BETWEEN :startDate AND :endDate ORDER BY dp.ngayDen DESC")
    List<DoiPhong> findByNgayDenBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Tìm lịch sử đổi phòng theo khách hàng (thông qua phiếu thuê)
    @Query("SELECT dp FROM DoiPhong dp " +
           "JOIN dp.ctPhieuThue ct " +
           "JOIN ct.phieuThue pt " +
           "WHERE pt.khachHang.cccd = :cccd " +
           "ORDER BY dp.ngayDen DESC")
    List<DoiPhong> findByKhachHangCccd(@Param("cccd") String cccd);
    
    // Kiểm tra xem phòng có đang được đổi trong khoảng thời gian không
    @Query("SELECT COUNT(dp) > 0 FROM DoiPhong dp " +
           "WHERE dp.phongMoi.soPhong = :soPhong " +
           "AND dp.ngayDen <= :endDate " +
           "AND (dp.ngayDi IS NULL OR dp.ngayDi >= :startDate)")
    boolean isRoomBeingChangedInPeriod(@Param("soPhong") String soPhong, 
                                      @Param("startDate") LocalDate startDate, 
                                      @Param("endDate") LocalDate endDate);
    
    // Lấy đổi phòng hiện tại (chưa kết thúc) của một chi tiết phiếu thuê
    @Query("SELECT dp FROM DoiPhong dp " +
           "WHERE dp.ctPhieuThue.idCtPt = :idCtPt " +
           "AND (dp.ngayDi IS NULL OR dp.ngayDi > :currentDate) " +
           "ORDER BY dp.ngayDen DESC")
    List<DoiPhong> findCurrentRoomChangeByCtPhieuThue(@Param("idCtPt") Integer idCtPt, 
                                                     @Param("currentDate") LocalDate currentDate);
    
    // Lấy tất cả lịch sử đổi phòng với thông tin chi tiết
    @Query("SELECT dp FROM DoiPhong dp " +
           "JOIN FETCH dp.ctPhieuThue ct " +
           "JOIN FETCH ct.phieuThue pt " +
           "JOIN FETCH pt.khachHang kh " +
           "JOIN FETCH dp.phongMoi pm " +
           "JOIN FETCH pm.hangPhong hp " +
           "JOIN FETCH hp.kieuPhong kp " +
           "JOIN FETCH hp.loaiPhong lp " +
           "ORDER BY dp.ngayDen DESC")
    List<DoiPhong> findAllWithDetails();
    
    // Thống kê số lần đổi phòng theo tháng
    @Query("SELECT MONTH(dp.ngayDen) as month, YEAR(dp.ngayDen) as year, COUNT(dp) as count " +
           "FROM DoiPhong dp " +
           "WHERE dp.ngayDen BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(dp.ngayDen), MONTH(dp.ngayDen) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> getRoomChangeStatistics(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
}
