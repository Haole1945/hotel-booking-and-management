package com.dev.Hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.NhanVienRepository;
import com.dev.Hotel.repo.KhachHangRepository;
import com.dev.Hotel.entity.NhanVien;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailsService: Trying to authenticate user: " + username);

        // Try to find customer first (by email or phone number)
        var khachHang = khachHangRepository.findByEmailOrSdt(username, username);
        if (khachHang.isPresent()) {
            System.out.println("CustomUserDetailsService: Found customer: " + khachHang.get().getEmail());
            return User.builder()
                    .username(khachHang.get().getEmail())
                    .password(khachHang.get().getMatKhau())
                    .authorities(Collections.singletonList(new SimpleGrantedAuthority("CUSTOMER")))
                    .build();
        }
        // If not found, try to find employee
        NhanVien nhanVien = nhanVienRepository.findByEmailOrUsername(username, username)
                .orElseThrow(() -> new OurException("Username/Email not Found"));

        // Determine role based on department
        String role = determineUserRole(nhanVien);
        // Create UserDetails with appropriate role
        return User.builder()
                .username(nhanVien.getEmail())
                .password(nhanVien.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(role)))
                .build();
    }
    /**
     * Determine user role based on department
     */
    private String determineUserRole(NhanVien nhanVien) {
        try {
            // Get department name directly from database to avoid lazy loading issues
            String tenBoPhan = nhanVienRepository.findDepartmentNameByNhanVienId(nhanVien.getIdNv());

            if (tenBoPhan == null || tenBoPhan.trim().isEmpty()) {
                return "EMPLOYEE"; // Default role
            }

            // Check for admin/management roles
            String tenBoPhanLower = tenBoPhan.toLowerCase();
            if (tenBoPhanLower.contains("quản lý") ||
                    tenBoPhanLower.contains("admin") ||
                    tenBoPhanLower.contains("giám đốc")) {
                return "ADMIN";
            }

            // All other departments are employees
            return "EMPLOYEE";
        } catch (Exception e) {
            // If there's any issue, default to EMPLOYEE
            System.err.println("Error determining user role in CustomUserDetailsService: " + e.getMessage());
            return "EMPLOYEE";
        }
    }
}
