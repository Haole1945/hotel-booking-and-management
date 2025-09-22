package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoiPhongRequest {
    
    // Thông tin chi tiết phiếu thuê hiện tại
    private Integer idCtPt;
    
    // Thông tin phòng mới
    private String soPhongMoi;
    
    // Thời gian đổi phòng
    private LocalDate ngayDen;
    private LocalDate ngayDi;
    
    // Lý do đổi phòng
    private String lyDo;
    
    // Thông tin nhân viên xử lý
    private String idNhanVien;
    
    // Ghi chú thêm
    private String ghiChu;
    
    // Có tự động tính phí chênh lệch không
    private Boolean autoCalculateFee = true;
    
    // Có áp dụng khuyến mãi không
    private Boolean applyPromotion = true;
}
