package com.dev.Hotel.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.dev.Hotel.entity.NhanVien;
import com.dev.Hotel.entity.KhachHang;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Service
public class JWTUtils {


    private static final long EXPIRATION_TIME = 1000 * 60 * 24 * 7; //for 7 days

    private final SecretKey Key;

    public JWTUtils() {
        String secreteString = "843567893696976453275974432697R634976R738467TR678T34865R6834R8763T478378637664538745673865783678548735687R3";
        byte[] keyBytes = Base64.getDecoder().decode(secreteString.getBytes(StandardCharsets.UTF_8));
        this.Key = new SecretKeySpec(keyBytes, "HmacSHA256");

    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Key)
                .compact();
    }

    public String generateToken(NhanVien nhanVien) {
        return Jwts.builder()
                .subject(nhanVien.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Key)
                .compact();
    }

    public String generateTokenForCustomer(KhachHang khachHang) {
        return Jwts.builder()
                .subject(khachHang.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Key)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return extractClaims(token, Claims::getSubject);
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // Tạo JWT token cho reset password (hết hạn sau 1 giờ)
    public String generatePasswordResetToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim("type", "password_reset")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + (1000 * 60 * 60))) // 1 giờ
                .signWith(Key)
                .compact();
    }

    // Validate password reset token
    public boolean isPasswordResetTokenValid(String token, String email) {
        try {
            String extractedEmail = extractClaims(token, Claims::getSubject);
            String tokenType = extractClaims(token, claims -> (String) claims.get("type"));

            return extractedEmail.equals(email) &&
                   "password_reset".equals(tokenType) &&
                   !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }



    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        try {
            return claimsTFunction.apply(Jwts.parser().verifyWith(Key).build().parseSignedClaims(token).getPayload());
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JWT token", e);
        }
    }

    public boolean isValidToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            return extractClaims(token, Claims::getExpiration).before(new Date());
        } catch (Exception e) {
            return true; // Consider expired if we can't parse
        }
    }
}
