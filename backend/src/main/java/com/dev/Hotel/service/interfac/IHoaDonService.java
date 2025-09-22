package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.CreateInvoiceRequest;
import com.dev.Hotel.dto.Response;

public interface IHoaDonService {
    
    // CRUD operations
    Response getAllHoaDon();
    Response getHoaDonById(String idHd);
    Response createHoaDon(CreateInvoiceRequest request);
    Response updateHoaDon(String idHd, CreateInvoiceRequest request);
    Response deleteHoaDon(String idHd);
    
    // Business logic
    Response getHoaDonByPhieuThue(Integer idPt);
    Response createInvoiceFromCheckout(Integer idPt, String actualCheckOut);
    Response createInvoiceFromCheckoutWithPromotions(Integer idPt, String actualCheckOut, java.math.BigDecimal promotionDiscount);
    Response updateInvoiceStatus(String idHd, String trangThai);

    // Invoice details - chỉ hiển thị items đã thanh toán (có ID_HD)
    Response getInvoiceDetails(String idHd);
    
    // Reports
    Response getInvoicesByDateRange(String startDate, String endDate);
    Response getInvoicesByStatus(String trangThai);
}
