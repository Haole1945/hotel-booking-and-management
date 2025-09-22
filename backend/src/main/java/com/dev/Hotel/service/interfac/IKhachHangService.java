package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.KhachHang;

public interface IKhachHangService {

    // CRUD operations
    Response getAllKhachHang();

    Response getKhachHangById(String cccd);

    Response getKhachHangByEmail(String email);

    Response getKhachHangBySdt(String sdt);

    Response createKhachHang(KhachHang khachHang);

    Response updateKhachHang(String cccd, KhachHang khachHang);

    Response deleteKhachHang(String cccd);

    // Business logic
    Response getKhachHangBookingHistory(String cccd);

    Response searchKhachHang(String keyword);

    Response getKhachHangByEmailOrSdt(String emailOrSdt);

    // Validation
    Response validateKhachHang(KhachHang khachHang);

    boolean existsByEmail(String email);

    boolean existsBySdt(String sdt);

    // Profile management
    Response changePassword(String cccd, String oldPassword, String newPassword);

    Response updateProfile(String cccd, KhachHang khachHang);
}
