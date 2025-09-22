package com.dev.Hotel.repo;

import com.dev.Hotel.dto.BookingReportDTO;
import com.dev.Hotel.dto.BookingReportSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public class BookingReportRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<BookingReportDTO> getBookingReportDetails(LocalDate startDate, LocalDate endDate, String status) {
        String sql = "CALL sp_booking_report_final(?, ?, ?)";
        
        return jdbcTemplate.query(sql, new Object[]{startDate, endDate, status}, new RowMapper<BookingReportDTO>() {
            @Override
            public BookingReportDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
                BookingReportDTO dto = new BookingReportDTO();
                dto.setIdPd(rs.getInt("id_pd"));
                dto.setNgayDat(rs.getDate("ngay_dat") != null ? rs.getDate("ngay_dat").toLocalDate() : null);
                dto.setNgayBdThue(rs.getDate("ngay_bd_thue") != null ? rs.getDate("ngay_bd_thue").toLocalDate() : null);
                dto.setNgayDi(rs.getDate("ngay_di") != null ? rs.getDate("ngay_di").toLocalDate() : null);
                dto.setSoNgayO(rs.getInt("so_ngay_o"));
                dto.setTrangThaiGoc(rs.getString("trang_thai_goc"));
                dto.setSoTienCoc(rs.getBigDecimal("so_tien_coc"));
                dto.setCccdKhach(rs.getString("cccd_khach"));
                dto.setHoTenKhach(rs.getString("ho_ten_khach"));
                dto.setSdtKhach(rs.getString("sdt_khach"));
                dto.setEmailKhach(rs.getString("email_khach"));
                dto.setIdNvDat(rs.getString("id_nv_dat"));
                dto.setHoTenNvDat(rs.getString("ho_ten_nv_dat"));
                dto.setIdPt(rs.getObject("id_pt") != null ? rs.getInt("id_pt") : null);
                dto.setNgayCheckInThucTe(rs.getDate("ngay_check_in_thuc_te") != null ? rs.getDate("ngay_check_in_thuc_te").toLocalDate() : null);
                dto.setSoPhongDat(rs.getInt("so_phong_dat"));
                dto.setChiTietPhong(rs.getString("chi_tiet_phong"));
                dto.setTongTienPhong(rs.getBigDecimal("tong_tien_phong"));
                return dto;
            }
        });
    }

    public BookingReportSummaryDTO getBookingReportSummary(LocalDate startDate, LocalDate endDate, String status) {
        String sql = "CALL sp_booking_report_final(?, ?, ?)";
        
        // Execute the stored procedure and get multiple result sets
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, startDate, endDate, status);
        
        // The summary should be in the second result set, but since JdbcTemplate doesn't handle multiple result sets well,
        // we'll need to use a different approach or modify the stored procedure
        // For now, let's create a separate method to get summary
        return getBookingReportSummaryDirect(startDate, endDate, status);
    }

    private BookingReportSummaryDTO getBookingReportSummaryDirect(LocalDate startDate, LocalDate endDate, String status) {
        // Create a simplified query to get summary data
        String sql = """
            SELECT 
                'THỐNG KÊ TỔNG QUAN' AS loai_bao_cao,
                COUNT(*) AS tong_so_phieu,
                FORMAT(SUM(pd.SO_TIEN_COC), 0) AS tong_tien_coc,
                FORMAT(SUM(IFNULL((SELECT SUM(cpd.DON_GIA * cpd.SO_LUONG_PHONG_O) FROM ctphieudat cpd WHERE cpd.ID_PD = pd.ID_PD), 0)), 0) AS tong_tien_phong,
                SUM(IFNULL((SELECT SUM(cpd.SO_LUONG_PHONG_O) FROM ctphieudat cpd WHERE cpd.ID_PD = pd.ID_PD), 0)) AS tong_so_phong_dat,
                ROUND(AVG(DATEDIFF(pd.NGAY_DI, pd.NGAY_BD_THUE)), 1) AS so_ngay_o_tb
            FROM phieudat pd
            WHERE pd.NGAY_DAT BETWEEN ? AND ?
            """ + (!"ALL".equalsIgnoreCase(status) ? " AND UPPER(pd.TRANG_THAI) = UPPER(?)" : "");

        Object[] params = "ALL".equalsIgnoreCase(status) ? 
            new Object[]{startDate, endDate} : 
            new Object[]{startDate, endDate, status};

        return jdbcTemplate.queryForObject(sql, params, new RowMapper<BookingReportSummaryDTO>() {
            @Override
            public BookingReportSummaryDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
                BookingReportSummaryDTO dto = new BookingReportSummaryDTO();
                dto.setLoaiBaoCao(rs.getString("loai_bao_cao"));
                dto.setTongSoPhieu(rs.getLong("tong_so_phieu"));
                dto.setTongTienCoc(rs.getString("tong_tien_coc"));
                dto.setTongTienPhong(rs.getString("tong_tien_phong"));
                dto.setTongSoPhongDat(rs.getLong("tong_so_phong_dat"));
                dto.setSoNgayOTb(rs.getDouble("so_ngay_o_tb"));
                return dto;
            }
        });
    }
}
