package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.Response;
import com.dev.Hotel.dto.PromotionsByRentalDTO;
import com.dev.Hotel.dto.HangPhongDTO;
import com.dev.Hotel.dto.KhuyenMaiDTO;
import com.dev.Hotel.entity.PhieuThue;
import com.dev.Hotel.entity.CtPhieuThue;
import com.dev.Hotel.entity.KhuyenMai;
import com.dev.Hotel.entity.CtKhuyenMai;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.exception.OurException;
import com.dev.Hotel.repo.PhieuThueRepository;
import com.dev.Hotel.repo.CtPhieuThueRepository;
import com.dev.Hotel.repo.KhuyenMaiRepository;
import com.dev.Hotel.service.EmailService;
import com.dev.Hotel.service.EmailValidationService;
import com.dev.Hotel.utils.EntityDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PhieuThueRepository phieuThueRepository;

    @Autowired
    private CtPhieuThueRepository ctPhieuThueRepository;

    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailValidationService emailValidationService;

    /**
     * Lấy danh sách khuyến mãi available cho một phiếu thuê
     * Nhóm theo hạng phòng và bao gồm khuyến mãi tổng hóa đơn
     */
    public Response getPromotionsByRental(Integer idPt) {
        Response response = new Response();
        try {
            System.out.println("Getting promotions for rental ID: " + idPt);

            // 1. Tìm phiếu thuê
            PhieuThue phieuThue = phieuThueRepository.findById(idPt)
                    .orElseThrow(() -> new OurException("Không tìm thấy phiếu thuê"));

            System.out.println("Found rental: " + phieuThue.getIdPt());

            // 2. Lấy danh sách chi tiết phiếu thuê (chỉ phòng chưa thanh toán)
            List<CtPhieuThue> ctPhieuThueList = ctPhieuThueRepository.findByPhieuThue(phieuThue)
                    .stream()
                    .filter(ct -> !"Đã thanh toán".equals(ct.getTtThanhToan()))
                    .collect(Collectors.toList());

            System.out.println("Found " + ctPhieuThueList.size() + " unpaid room details");

            if (ctPhieuThueList.isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("Không có phòng nào cần thanh toán");
                response.setPromotionsByRental(new PromotionsByRentalDTO());
                return response;
            }

            // 3. Nhóm theo hạng phòng
            Map<Integer, List<CtPhieuThue>> groupedByHangPhong = ctPhieuThueList.stream()
                    .filter(ct -> {
                        boolean hasRoom = ct.getPhong() != null;
                        boolean hasHangPhong = hasRoom && ct.getPhong().getHangPhong() != null;
                        System.out.println("CtPhieuThue " + ct.getIdCtPt() + " - hasRoom: " + hasRoom + ", hasHangPhong: " + hasHangPhong);
                        return hasHangPhong;
                    })
                    .collect(Collectors.groupingBy(ct -> ct.getPhong().getHangPhong().getIdHangPhong()));

            System.out.println("Grouped by hang phong: " + groupedByHangPhong.keySet());

            if (groupedByHangPhong.isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("Không có hạng phòng nào để áp dụng khuyến mãi");
                PromotionsByRentalDTO promotionsData = new PromotionsByRentalDTO();
                promotionsData.setRoomTypePromotions(new HashMap<>());
                promotionsData.setInvoicePromotions(new ArrayList<>());
                response.setPromotionsByRental(promotionsData);
                return response;
            }

            // 4. Tạo promotions by room type
            Map<Integer, PromotionsByRentalDTO.RoomTypePromotionDTO> roomTypePromotions = new HashMap<>();
            
            for (Map.Entry<Integer, List<CtPhieuThue>> entry : groupedByHangPhong.entrySet()) {
                Integer idHangPhong = entry.getKey();
                List<CtPhieuThue> roomsInCategory = entry.getValue();

                // Lấy thông tin hạng phòng từ phòng đầu tiên
                HangPhong hangPhong = roomsInCategory.get(0).getPhong().getHangPhong();
                
                // Lấy khuyến mãi available cho hạng phòng này
                List<KhuyenMai> availablePromotions = khuyenMaiRepository
                        .findActivePromotionsByHangPhong(idHangPhong, LocalDate.now());

                System.out.println("Found " + availablePromotions.size() + " promotions for hang phong " + idHangPhong);

                // Tính toán thông tin phòng
                List<String> roomNumbers = roomsInCategory.stream()
                        .map(ct -> ct.getPhong().getSoPhong())
                        .collect(Collectors.toList());

                BigDecimal totalRoomCharges = calculateRoomCharges(roomsInCategory);
                int roomCount = roomsInCategory.size();
                int nightCount = calculateNightCount(roomsInCategory);

                // Tạo DTO
                PromotionsByRentalDTO.RoomTypePromotionDTO roomTypePromo = 
                        new PromotionsByRentalDTO.RoomTypePromotionDTO();
                roomTypePromo.setHangPhong(EntityDTOMapper.mapHangPhongToDTO(hangPhong));
                roomTypePromo.setRooms(roomNumbers);
                roomTypePromo.setAvailablePromotions(EntityDTOMapper.mapKhuyenMaiListToDTO(availablePromotions));
                roomTypePromo.setRoomCharges(totalRoomCharges);
                roomTypePromo.setRoomCount(roomCount);
                roomTypePromo.setNightCount(nightCount);

                roomTypePromotions.put(idHangPhong, roomTypePromo);
            }

            // 5. Lấy khuyến mãi tổng hóa đơn (nếu có)
            List<KhuyenMai> invoicePromotions = getInvoiceLevelPromotions(ctPhieuThueList.size());

            // 6. Tạo response
            PromotionsByRentalDTO promotionsData = new PromotionsByRentalDTO();
            promotionsData.setRoomTypePromotions(roomTypePromotions);
            promotionsData.setInvoicePromotions(EntityDTOMapper.mapKhuyenMaiListToDTO(invoicePromotions));

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setPromotionsByRental(promotionsData);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khuyến mãi: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    /**
     * Tính tổng tiền phòng cho danh sách chi tiết phiếu thuê
     */
    private BigDecimal calculateRoomCharges(List<CtPhieuThue> ctPhieuThueList) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (CtPhieuThue ct : ctPhieuThueList) {
            if (ct.getDonGia() != null && ct.getNgayDen() != null) {
                // Tính số ngày
                LocalDate checkIn = ct.getNgayDen();
                LocalDate checkOut = ct.getNgayDi() != null ? ct.getNgayDi() : LocalDate.now();
                
                long days = Math.max(1, ChronoUnit.DAYS.between(checkIn, checkOut));
                BigDecimal roomTotal = ct.getDonGia().multiply(BigDecimal.valueOf(days));
                total = total.add(roomTotal);
            }
        }
        
        return total;
    }

    /**
     * Tính số đêm trung bình
     */
    private int calculateNightCount(List<CtPhieuThue> ctPhieuThueList) {
        if (ctPhieuThueList.isEmpty()) return 0;
        
        CtPhieuThue firstRoom = ctPhieuThueList.get(0);
        if (firstRoom.getNgayDen() == null) return 1;
        
        LocalDate checkIn = firstRoom.getNgayDen();
        LocalDate checkOut = firstRoom.getNgayDi() != null ? firstRoom.getNgayDi() : LocalDate.now();
        
        return (int) Math.max(1, ChronoUnit.DAYS.between(checkIn, checkOut));
    }

    /**
     * Lấy khuyến mãi cấp hóa đơn (ví dụ: giảm giá khi đặt nhiều phòng)
     */
    private List<KhuyenMai> getInvoiceLevelPromotions(int totalRooms) {
        List<KhuyenMai> invoicePromotions = new ArrayList<>();

        try {
            // Ví dụ: Khuyến mãi khi đặt >= 3 phòng
            if (totalRooms >= 3) {
                List<KhuyenMai> multiRoomPromotions = khuyenMaiRepository.findActivePromotions(LocalDate.now())
                        .stream()
                        .filter(km -> km.getMoTaKm() != null &&
                                     (km.getMoTaKm().toLowerCase().contains("nhiều phòng") ||
                                      km.getMoTaKm().toLowerCase().contains("đặt nhiều") ||
                                      km.getMoTaKm().toLowerCase().contains("tổng hóa đơn")))
                        .collect(Collectors.toList());
                invoicePromotions.addAll(multiRoomPromotions);
            }
        } catch (Exception e) {
            System.err.println("Error getting invoice level promotions: " + e.getMessage());
            // Trả về danh sách rỗng nếu có lỗi
        }

        return invoicePromotions;
    }

    /**
     * Lấy tất cả khuyến mãi đang active
     */
    public Response getActivePromotions() {
        Response response = new Response();
        try {
            List<KhuyenMai> activePromotions = khuyenMaiRepository.findActivePromotions(LocalDate.now());

            // Group promotions by room type
            Map<Integer, List<KhuyenMai>> promotionsByRoomType = new HashMap<>();

            for (KhuyenMai promotion : activePromotions) {
                if (promotion.getChiTietKhuyenMai() != null) {
                    for (CtKhuyenMai ctKm : promotion.getChiTietKhuyenMai()) {
                        Integer idHangPhong = ctKm.getIdHangPhong();
                        promotionsByRoomType.computeIfAbsent(idHangPhong, k -> new ArrayList<>()).add(promotion);
                    }
                }
            }

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setKhuyenMaiList(EntityDTOMapper.mapKhuyenMaiListToDTO(activePromotions));

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách khuyến mãi: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    /**
     * Đăng ký nhận thông tin ưu đãi qua email
     */
    public Response subscribeToPromotions(String email) {
        Response response = new Response();
        try {
            // Validate email format and domain existence
            EmailValidationService.EmailValidationResult validationResult =
                emailValidationService.validateEmailDetailed(email);

            if (!validationResult.isValid()) {
                response.setStatusCode(400);
                response.setMessage(validationResult.getReason());
                return response;
            }

            // Lấy tất cả khuyến mãi đang active
            List<KhuyenMai> activePromotions = khuyenMaiRepository.findActivePromotions(LocalDate.now());

            if (activePromotions.isEmpty()) {
                response.setStatusCode(200);
                response.setMessage("Cảm ơn bạn đã đăng ký! Hiện tại chưa có chương trình khuyến mãi nào.");
                return response;
            }

            // Gửi email với thông tin khuyến mãi
            sendPromotionEmail(email, activePromotions);

            response.setStatusCode(200);
            response.setMessage("Đăng ký thành công! Thông tin ưu đãi đã được gửi đến email của bạn.");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi đăng ký nhận ưu đãi: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    /**
     * Gửi email với thông tin khuyến mãi
     */
    private void sendPromotionEmail(String email, List<KhuyenMai> promotions) {
        try {
            StringBuilder emailContent = new StringBuilder();
            emailContent.append("Xin chào,\n\n");
            emailContent.append("Cảm ơn bạn đã đăng ký nhận thông tin ưu đãi từ khách sạn chúng tôi!\n\n");
            emailContent.append("Dưới đây là các chương trình khuyến mãi hiện đang có:\n\n");

            // Group promotions by room type for better presentation
            Map<String, List<String>> promotionsByRoomType = new HashMap<>();

            for (KhuyenMai promotion : promotions) {
                if (promotion.getChiTietKhuyenMai() != null && !promotion.getChiTietKhuyenMai().isEmpty()) {
                    for (CtKhuyenMai ctKm : promotion.getChiTietKhuyenMai()) {
                        HangPhong hangPhong = ctKm.getHangPhong();
                        if (hangPhong != null) {
                            String roomTypeKey = hangPhong.getKieuPhong().getTenKp() + " - " + hangPhong.getLoaiPhong().getTenLp();
                            String promotionInfo = String.format("• %s (Giảm %.0f%%) - Từ %s đến %s",
                                promotion.getMoTaKm(),
                                ctKm.getPhanTramGiam(),
                                promotion.getNgayBatDau(),
                                promotion.getNgayKetThuc());

                            promotionsByRoomType.computeIfAbsent(roomTypeKey, k -> new ArrayList<>()).add(promotionInfo);
                        }
                    }
                }
            }

            // Add promotions grouped by room type
            for (Map.Entry<String, List<String>> entry : promotionsByRoomType.entrySet()) {
                emailContent.append("🏨 ").append(entry.getKey()).append(":\n");
                for (String promotionInfo : entry.getValue()) {
                    emailContent.append("   ").append(promotionInfo).append("\n");
                }
                emailContent.append("\n");
            }

            emailContent.append("Để đặt phòng và tận hưởng các ưu đãi này, vui lòng truy cập website của chúng tôi ");
            emailContent.append("hoặc liên hệ hotline: 1900 1234\n\n");
            emailContent.append("Địa chỉ: 97 Man Thiện, Hiệp Phú, Thủ Đức, Hồ Chí Minh\n");
            emailContent.append("Email: booking@hotel.com\n\n");
            emailContent.append("Trân trọng,\n");
            emailContent.append("Hotel Booking Management System");

            // Send email using existing EmailService
            emailService.sendPromotionEmail(email, emailContent.toString());

        } catch (Exception e) {
            System.err.println("Failed to send promotion email to: " + email + " - " + e.getMessage());
            throw new RuntimeException("Email sending failed", e);
        }
    }
}
