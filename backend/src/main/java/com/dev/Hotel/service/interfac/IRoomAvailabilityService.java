package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface IRoomAvailabilityService {

    Response getAvailableRoomsByHangPhongAndPriceRange(LocalDate checkIn, LocalDate checkOut,
            BigDecimal minPrice, BigDecimal maxPrice);

    Response getAvailableRoomsByHangPhongAndPriceRange(LocalDate checkIn, LocalDate checkOut,
            BigDecimal minPrice, BigDecimal maxPrice,
            String idKp, String idLp);

    Response getAvailableRoomsForStaff(LocalDate checkIn, LocalDate checkOut);
}
