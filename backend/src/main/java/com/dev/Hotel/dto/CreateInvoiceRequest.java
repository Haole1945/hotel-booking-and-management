package com.dev.Hotel.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateInvoiceRequest {
    private Integer idPt; // ID Phiếu thuê
    private String idNv; // ID Nhân viên
    private BigDecimal tongTien; // Tổng tiền
    private String trangThai; // Trạng thái hóa đơn
    private String ghiChu; // Ghi chú
    
    // Additional charges and damages
    private List<AdditionalChargeDTO> additionalCharges;
    private List<DamageDTO> damages;
    
    @Data
    public static class AdditionalChargeDTO {
        private String description;
        private BigDecimal amount;
    }
    
    @Data
    public static class DamageDTO {
        private String description;
        private BigDecimal amount;
    }
}
