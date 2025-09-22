package com.dev.Hotel.service;

import com.dev.Hotel.entity.GiaHangPhong;
import com.dev.Hotel.repo.GiaHangPhongRepository;
import com.dev.Hotel.service.impl.RoomPricingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoomPricingServiceTest {

    @Mock
    private GiaHangPhongRepository giaHangPhongRepository;

    @InjectMocks
    private RoomPricingService roomPricingService;

    private GiaHangPhong giaHangPhong1;
    private GiaHangPhong giaHangPhong2;

    @BeforeEach
    void setUp() {
        // Setup test data
        giaHangPhong1 = new GiaHangPhong();
        giaHangPhong1.setIdHangPhong(1);
        giaHangPhong1.setNgayApDung(LocalDate.of(2025, 8, 1));
        giaHangPhong1.setGia(BigDecimal.valueOf(2000000));

        giaHangPhong2 = new GiaHangPhong();
        giaHangPhong2.setIdHangPhong(1);
        giaHangPhong2.setNgayApDung(LocalDate.of(2025, 8, 15));
        giaHangPhong2.setGia(BigDecimal.valueOf(5000000));
    }

    @Test
    void testGetPriceForDate_WithExistingPrice() {
        // Given
        LocalDate testDate = LocalDate.of(2025, 8, 10);
        when(giaHangPhongRepository.findLatestPriceByHangPhong(1, testDate))
                .thenReturn(Optional.of(giaHangPhong1));

        // When
        BigDecimal result = roomPricingService.getPriceForDate(1, testDate);

        // Then
        assertEquals(BigDecimal.valueOf(2000000), result);
    }

    @Test
    void testGetPriceForDate_WithoutExistingPrice() {
        // Given
        LocalDate testDate = LocalDate.of(2025, 7, 1);
        when(giaHangPhongRepository.findLatestPriceByHangPhong(1, testDate))
                .thenReturn(Optional.empty());

        // When
        BigDecimal result = roomPricingService.getPriceForDate(1, testDate);

        // Then
        assertEquals(BigDecimal.valueOf(500000), result); // Default price
    }

    @Test
    void testCalculateTotalPriceForDateRange_WithPriceChange() {
        // Given
        LocalDate checkIn = LocalDate.of(2025, 8, 12);
        LocalDate checkOut = LocalDate.of(2025, 8, 20);

        // Mock responses for different dates
        when(giaHangPhongRepository.findLatestPriceByHangPhong(eq(1), any(LocalDate.class)))
                .thenAnswer(invocation -> {
                    LocalDate date = invocation.getArgument(1);
                    if (date.isBefore(LocalDate.of(2025, 8, 15))) {
                        return Optional.of(giaHangPhong1); // 2M before 15/8
                    } else {
                        return Optional.of(giaHangPhong2); // 5M from 15/8
                    }
                });

        // When
        BigDecimal result = roomPricingService.calculateTotalPriceForDateRange(1, checkIn, checkOut);

        // Then
        // 12/8, 13/8, 14/8 = 3 nights at 2M = 6M
        // 15/8, 16/8, 17/8, 18/8, 19/8 = 5 nights at 5M = 25M
        // Total = 31M
        BigDecimal expected = BigDecimal.valueOf(31000000);
        assertEquals(expected, result);
    }

    @Test
    void testGetCurrentPrice() {
        // Given
        when(giaHangPhongRepository.findLatestPriceByHangPhong(eq(1), any(LocalDate.class)))
                .thenReturn(Optional.of(giaHangPhong1));

        // When
        BigDecimal result = roomPricingService.getCurrentPrice(1);

        // Then
        assertEquals(BigDecimal.valueOf(2000000), result);
    }

    @Test
    void testGetAveragePricePerNight() {
        // Given
        LocalDate checkIn = LocalDate.of(2025, 8, 12);
        LocalDate checkOut = LocalDate.of(2025, 8, 15); // 3 nights

        when(giaHangPhongRepository.findLatestPriceByHangPhong(eq(1), any(LocalDate.class)))
                .thenReturn(Optional.of(giaHangPhong1));

        // When
        BigDecimal result = roomPricingService.getAveragePricePerNight(1, checkIn, checkOut);

        // Then
        // 3 nights at 2M each = 6M total, average = 2M
        assertEquals(BigDecimal.valueOf(2000000), result);
    }

    @Test
    void testHasPriceChanges_WithChanges() {
        // Given
        LocalDate checkIn = LocalDate.of(2025, 8, 12);
        LocalDate checkOut = LocalDate.of(2025, 8, 20);

        when(giaHangPhongRepository.findLatestPriceByHangPhong(eq(1), any(LocalDate.class)))
                .thenAnswer(invocation -> {
                    LocalDate date = invocation.getArgument(1);
                    if (date.isBefore(LocalDate.of(2025, 8, 15))) {
                        return Optional.of(giaHangPhong1); // 2M before 15/8
                    } else {
                        return Optional.of(giaHangPhong2); // 5M from 15/8
                    }
                });

        // When
        boolean result = roomPricingService.hasPriceChanges(1, checkIn, checkOut);

        // Then
        assertTrue(result);
    }

    @Test
    void testHasPriceChanges_WithoutChanges() {
        // Given
        LocalDate checkIn = LocalDate.of(2025, 8, 12);
        LocalDate checkOut = LocalDate.of(2025, 8, 15);

        when(giaHangPhongRepository.findLatestPriceByHangPhong(eq(1), any(LocalDate.class)))
                .thenReturn(Optional.of(giaHangPhong1));

        // When
        boolean result = roomPricingService.hasPriceChanges(1, checkIn, checkOut);

        // Then
        assertFalse(result);
    }
}
