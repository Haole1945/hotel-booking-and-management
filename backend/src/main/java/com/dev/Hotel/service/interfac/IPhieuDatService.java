package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.CreateBookingAtReceptionRequest;
import com.dev.Hotel.dto.UpdateBookingRequest;
import com.dev.Hotel.entity.PhieuDat;

import java.time.LocalDate;

public interface IPhieuDatService {

    // CRUD operations
    Response getAllPhieuDat();

    Response getPhieuDatById(Integer idPd);

    Response createPhieuDat(PhieuDat phieuDat);

    Response updatePhieuDat(Integer idPd, PhieuDat phieuDat);

    Response deletePhieuDat(Integer idPd);

    // Business logic
    Response getPhieuDatByKhachHang(String cccd);

    Response getPhieuDatByNhanVien(String idNv);

    Response getPhieuDatByTrangThai(String trangThai);

    Response getPhieuDatByDateRange(LocalDate startDate, LocalDate endDate);

    // Booking management
    Response confirmBooking(Integer idPd);

    Response cancelBooking(Integer idPd, String reason);

    Response updateBookingStatus(Integer idPd, String trangThai);

    Response updateBookingSimple(Integer idPd, UpdateBookingRequest request);

    // Search and filter
    Response searchPhieuDat(String keyword);

    Response getUpcomingBookings(LocalDate date);

    Response getTodayBookings();

    Response getConfirmedBookings();

    // Validation
    Response validateBookingDates(LocalDate checkIn, LocalDate checkOut);

    boolean isValidBookingPeriod(LocalDate checkIn, LocalDate checkOut);

    // Reception booking
    Response createBookingAtReception(CreateBookingAtReceptionRequest request);

    // PayPal booking
    Response createBookingFromPayPal(com.dev.Hotel.dto.CreateBookingRequest request);
}
