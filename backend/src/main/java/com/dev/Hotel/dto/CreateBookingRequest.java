package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateBookingRequest {

    // Booking dates
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer nights;

    // Customer info
    private String fullName;
    private String phone;
    private String email;
    private String idCard; // CCCD

    // Room info
    private RoomInfo room;

    // Payment info
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    private String paymentMethod;
    private String paymentStatus;
    private PaymentData paymentData;

    @Data
    public static class RoomInfo {
        private Integer idHangPhong;
        private String tenKieuPhong;
        private String tenLoaiPhong;
        private String tenHangPhong;
        private BigDecimal giaPhong;
        private Integer soLuongPhongDat; // Số phòng muốn đặt
    }

    // Compatibility methods
    public String getCustomerName() {
        return fullName;
    }

    public String getCustomerPhone() {
        return phone;
    }

    public String getCustomerEmail() {
        return email;
    }

    public String getStatus() {
        return paymentStatus;
    }

    @Data
    public static class PaymentData {
        private String paypalOrderId;
        private String paypalPayerId;
        private String transactionId;
        private String paymentStatus;
        private AmountPaid amountPaid;
        private String paymentTime;
        private PayerInfo payerInfo;

        @Data
        public static class AmountPaid {
            private Double usd;
            private Double vnd;
        }

        @Data
        public static class PayerInfo {
            private String email;
            private String name;
            private String payerId;
        }
    }
}
