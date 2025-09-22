package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.LoginRequest;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.NhanVien;

import java.util.Map;

public interface INhanVienService {

    // Authentication
    Response login(LoginRequest loginRequest);

    Response register(NhanVien nhanVien);

    Response registerFromMap(Map<String, Object> requestData);

    // CRUD operations
    Response getAllNhanVien();

    Response getNhanVienById(String idNv);

    Response getNhanVienByEmail(String email);

    Response getNhanVienByUsername(String username);

    Response updateNhanVien(String idNv, NhanVien nhanVien);

    Response deleteNhanVien(String idNv);

    // Business logic
    Response changePassword(String idNv, String oldPassword, String newPassword);

    Response updateProfile(String idNv, NhanVien nhanVien);

    Response getMyInfo(String email);

    Response getNhanVienByBoPhan(String idBp);

    // Admin functions
    Response activateNhanVien(String idNv);

    Response deactivateNhanVien(String idNv);

    // Password reset
    Response forgotPassword(String email);

    Response resetPassword(String token, String newPassword);

    String extractEmailFromToken(String token);
}
