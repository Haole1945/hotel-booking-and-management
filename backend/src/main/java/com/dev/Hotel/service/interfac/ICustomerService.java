package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.CustomerRegisterRequest;
import com.dev.Hotel.dto.LoginRequest;
import com.dev.Hotel.dto.Response;

public interface ICustomerService {
    Response registerCustomer(CustomerRegisterRequest request);
    Response loginCustomer(LoginRequest loginRequest);

    // Password reset
    Response forgotPassword(String email);
    Response resetPassword(String token, String newPassword);
}
