package com.dev.Hotel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;

    // Getter for Vietnamese field name
    public String getMatKhau() {
        return password;
    }

    // Setter for Vietnamese field name
    public void setMatKhau(String matKhau) {
        this.password = matKhau;
    }
}
