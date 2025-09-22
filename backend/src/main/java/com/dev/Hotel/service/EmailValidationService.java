package com.dev.Hotel.service;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;
import java.util.Arrays;
import java.util.List;

@Service
public class EmailValidationService {

    private static final String EMAIL_PATTERN =
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

    private static final Pattern pattern = Pattern.compile(EMAIL_PATTERN);

    // List of common valid email domains
    private static final List<String> VALID_DOMAINS = Arrays.asList(
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
        "icloud.com", "aol.com", "protonmail.com", "zoho.com", "yandex.com",
        "mail.com", "gmx.com", "fastmail.com", "tutanota.com", "disroot.org",
        "edu.vn", "hcmus.edu.vn", "uit.edu.vn", "hcmut.edu.vn", "vnuhcm.edu.vn"
    );

    /**
     * Validate email format and check if domain is in whitelist
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }

        // Check email format
        if (!pattern.matcher(email).matches()) {
            return false;
        }

        // Extract domain
        String domain = email.substring(email.indexOf('@') + 1).toLowerCase();

        // Check if domain is in whitelist
        return VALID_DOMAINS.contains(domain);
    }

    /**
     * Validate email with detailed response
     */
    public EmailValidationResult validateEmailDetailed(String email) {
        EmailValidationResult result = new EmailValidationResult();

        if (email == null || email.trim().isEmpty()) {
            result.setValid(false);
            result.setReason("Email không được để trống");
            return result;
        }

        // Check format
        if (!pattern.matcher(email).matches()) {
            result.setValid(false);
            result.setReason("Định dạng email không hợp lệ");
            return result;
        }

        // Extract domain
        String domain = email.substring(email.indexOf('@') + 1).toLowerCase();

        // Check if domain is in whitelist
        if (!VALID_DOMAINS.contains(domain)) {
            result.setValid(false);
            result.setReason("Tên miền email không được hỗ trợ. Vui lòng sử dụng email từ các nhà cung cấp phổ biến như Gmail, Yahoo, Outlook, v.v.");
            return result;
        }

        result.setValid(true);
        result.setReason("Email hợp lệ");
        return result;
    }

    /**
     * Inner class for detailed validation result
     */
    public static class EmailValidationResult {
        private boolean valid;
        private String reason;

        public boolean isValid() {
            return valid;
        }

        public void setValid(boolean valid) {
            this.valid = valid;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
