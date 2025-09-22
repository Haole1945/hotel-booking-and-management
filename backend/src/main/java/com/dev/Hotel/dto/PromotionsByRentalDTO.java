package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PromotionsByRentalDTO {
    
    // Khuyến mãi theo từng hạng phòng
    private Map<Integer, RoomTypePromotionDTO> roomTypePromotions;
    
    // Khuyến mãi tổng hóa đơn
    private List<KhuyenMaiDTO> invoicePromotions;
    
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RoomTypePromotionDTO {
        private HangPhongDTO hangPhong;
        private List<String> rooms; // Danh sách số phòng
        private List<KhuyenMaiDTO> availablePromotions;
        private BigDecimal roomCharges; // Tổng tiền phòng hạng này
        private Integer roomCount; // Số lượng phòng
        private Integer nightCount; // Số đêm
    }
}
