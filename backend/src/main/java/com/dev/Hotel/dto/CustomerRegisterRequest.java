package com.dev.Hotel.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CustomerRegisterRequest {
    @NotBlank(message = "CCCD không được để trống")
    @Size(max = 20, message = "CCCD không được quá 20 ký tự")
    @Pattern(regexp = "^[0-9]{9,12}$", message = "CCCD phải có 9-12 chữ số")
    private String cccd;

    @NotBlank(message = "Họ không được để trống")
    @Size(max = 10, message = "Họ không được quá 10 ký tự")
    private String ho;

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 10, message = "Tên không được quá 10 ký tự")
    private String ten;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(max = 15, message = "Số điện thoại không được quá 15 ký tự")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại phải có 10-11 chữ số")
    private String sdt;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 50, message = "Email không được quá 50 ký tự")
    private String email;

    @Size(max = 100, message = "Địa chỉ không được quá 100 ký tự")
    private String diaChi;

    @Size(max = 20, message = "Mã số thuế không được quá 20 ký tự")
    private String maSoThue;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String matKhau;
}
