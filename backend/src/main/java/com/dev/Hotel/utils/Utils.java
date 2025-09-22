package com.dev.Hotel.utils;

import com.dev.Hotel.dto.KhachHangDTO;
import com.dev.Hotel.entity.KhachHang;

import java.security.SecureRandom;

public class Utils {

    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateRandomConfirmationCode(int length) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length());
            char randomChar = ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }

    public static KhachHangDTO mapKhachHangEntityToKhachHangDTO(KhachHang khachHang) {
        KhachHangDTO khachHangDTO = new KhachHangDTO();
        khachHangDTO.setCccd(khachHang.getCccd());
        khachHangDTO.setHo(khachHang.getHo());
        khachHangDTO.setTen(khachHang.getTen());
        khachHangDTO.setSdt(khachHang.getSdt());
        khachHangDTO.setEmail(khachHang.getEmail());
        khachHangDTO.setDiaChi(khachHang.getDiaChi());
        khachHangDTO.setMaSoThue(khachHang.getMaSoThue());
        return khachHangDTO;
    }
}










