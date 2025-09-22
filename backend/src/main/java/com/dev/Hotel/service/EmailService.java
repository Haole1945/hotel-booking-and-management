package com.dev.Hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;
    
    /**
     * Gửi email reset password qua Gmail SMTP
     */
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            String resetLink = "http://localhost:5173/reset-password/" + resetToken;

            // Tạo email message
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Đặt lại mật khẩu tài khoản - Hotel Management System");

            // Nội dung email
            String emailContent = "Xin chào,\n\n" +
                    "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n" +
                    "Vui lòng nhấn vào link sau để đặt lại mật khẩu:\n\n" +
                    resetLink + "\n\n" +
                    "Link này sẽ hết hạn sau 1 giờ.\n" +
                    "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                    "Trân trọng,\n" +
                    "Hotel Management System";

            message.setText(emailContent);

            // Gửi email
            mailSender.send(message);

        } catch (Exception e) {
            // Log lỗi để debug nếu cần
            System.err.println("Failed to send email to: " + toEmail + " - " + e.getMessage());

            // Có thể throw exception hoặc handle theo business logic
            throw new RuntimeException("Email sending failed", e);
        }
    }

    /**
     * Gửi email thông tin khuyến mãi
     */
    public void sendPromotionEmail(String toEmail, String promotionContent) {
        try {
            // Tạo email message
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🎉 Thông tin ưu đãi đặc biệt từ Hotel Booking System");

            message.setText(promotionContent);

            // Gửi email
            mailSender.send(message);

        } catch (Exception e) {
            // Log lỗi để debug nếu cần
            System.err.println("Failed to send promotion email to: " + toEmail + " - " + e.getMessage());

            // Có thể throw exception hoặc handle theo business logic
            throw new RuntimeException("Promotion email sending failed", e);
        }
    }

}
