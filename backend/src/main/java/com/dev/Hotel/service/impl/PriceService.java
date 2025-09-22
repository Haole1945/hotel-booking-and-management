package com.dev.Hotel.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class PriceService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<BigDecimal> getLatestServicePrice(String idDv) {
        try {
            String sql = "SELECT GIA FROM gia_dich_vu WHERE ID_DV = ? ORDER BY NGAY_AP_DUNG DESC LIMIT 1";
            BigDecimal price = jdbcTemplate.queryForObject(sql, BigDecimal.class, idDv);
            return Optional.ofNullable(price);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<LocalDate> getLatestServicePriceDate(String idDv) {
        try {
            String sql = "SELECT NGAY_AP_DUNG FROM gia_dich_vu WHERE ID_DV = ? ORDER BY NGAY_AP_DUNG DESC LIMIT 1";
            LocalDate date = jdbcTemplate.queryForObject(sql, LocalDate.class, idDv);
            return Optional.ofNullable(date);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<BigDecimal> getLatestSurchargePrice(String idPhuThu) {
        try {
            String sql = "SELECT GIA FROM giaphuthu WHERE ID_PHU_THU = ? ORDER BY NGAY_AP_DUNG DESC LIMIT 1";
            BigDecimal price = jdbcTemplate.queryForObject(sql, BigDecimal.class, idPhuThu);
            return Optional.ofNullable(price);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<LocalDate> getLatestSurchargePriceDate(String idPhuThu) {
        try {
            String sql = "SELECT NGAY_AP_DUNG FROM giaphuthu WHERE ID_PHU_THU = ? ORDER BY NGAY_AP_DUNG DESC LIMIT 1";
            LocalDate date = jdbcTemplate.queryForObject(sql, LocalDate.class, idPhuThu);
            return Optional.ofNullable(date);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
