package com.dev.Hotel.service.impl;

import com.dev.Hotel.dto.AvailableRoomsByHangPhongDTO;
import com.dev.Hotel.dto.Response;
import com.dev.Hotel.entity.GiaHangPhong;
import com.dev.Hotel.entity.HangPhong;
import com.dev.Hotel.entity.AnhHangPhong;
import com.dev.Hotel.entity.TienNghi;
import com.dev.Hotel.entity.KhuyenMai;
import com.dev.Hotel.dto.TienNghiDTO;
import com.dev.Hotel.dto.KhuyenMaiDTO;
import com.dev.Hotel.repo.GiaHangPhongRepository;
import com.dev.Hotel.repo.HangPhongRepository;
import com.dev.Hotel.repo.TienNghiRepository;
import com.dev.Hotel.repo.KhuyenMaiRepository;
import com.dev.Hotel.service.interfac.IRoomAvailabilityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomAvailabilityService implements IRoomAvailabilityService {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private GiaHangPhongRepository giaHangPhongRepository;

    @Autowired
    private HangPhongRepository hangPhongRepository;

    @Autowired
    private TienNghiRepository tienNghiRepository;

    @Autowired
    private KhuyenMaiRepository khuyenMaiRepository;

    @Autowired
    private RoomPricingService roomPricingService;

    @Override
    public Response getAvailableRoomsByHangPhongAndPriceRange(LocalDate checkIn, LocalDate checkOut,
            BigDecimal minPrice, BigDecimal maxPrice) {
        Response response = new Response();
        try {
            // Gọi stored procedure
            StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GetAvailableRoomsByHangPhong");
            query.registerStoredProcedureParameter("p_ngay_den", LocalDate.class, ParameterMode.IN);
            query.registerStoredProcedureParameter("p_ngay_di", LocalDate.class, ParameterMode.IN);

            query.setParameter("p_ngay_den", checkIn);
            query.setParameter("p_ngay_di", checkOut);

            System.out.println("=== CALLING STORED PROCEDURE WITH PARAMETERS ===");
            System.out.println("p_ngay_den: " + checkIn);
            System.out.println("p_ngay_di: " + checkOut);
            System.out.println("================================================");

            query.execute();

            @SuppressWarnings("unchecked")
            List<Object[]> results = query.getResultList();
            System.out.println("Stored procedure returned " + results.size() + " results");

            List<AvailableRoomsByHangPhongDTO> availableRooms = new ArrayList<>();

            for (Object[] result : results) {
                try {
                    // Debug: Print actual types safely
                    System.out.println("Result array length: " + result.length);
                    for (int i = 0; i < result.length; i++) {
                        System.out.println("Result[" + i + "] = " + result[i] +
                                " (type: " + (result[i] != null ? result[i].getClass().getSimpleName() : "null") + ")");
                    }

                    // Correct mapping based on stored procedure result order:
                    // [0] = ID_HANG_PHONG (Integer)
                    // [1] = TEN_KIEU_PHONG (String)
                    // [2] = TEN_LOAI_PHONG (String)
                    // [3] = TONG_SO_PHONG (Long)
                    // [4] = SO_PHONG_TRONG (Long)
                    Integer idHangPhong = convertToInteger(result[0]);
                    String tenKieuPhong = (String) result[1];
                    String tenLoaiPhong = (String) result[2];
                    Integer tongSoPhong = convertToInteger(result[3]);
                    Integer soPhongTrong = convertToInteger(result[4]);

                    System.out.println("Processing room: ID=" + idHangPhong +
                            ", KieuPhong=" + tenKieuPhong +
                            ", LoaiPhong=" + tenLoaiPhong +
                            ", Available=" + soPhongTrong +
                            ", Total=" + tongSoPhong);

                    if (soPhongTrong > 0) {
                        AvailableRoomsByHangPhongDTO dto = new AvailableRoomsByHangPhongDTO();
                        dto.setIdHangPhong(idHangPhong);
                        dto.setSoPhongTrong(soPhongTrong);
                        dto.setTongSoPhong(tongSoPhong);

                        // Set thông tin từ stored procedure
                        dto.setTenKieuPhong(tenKieuPhong);
                        dto.setTenLoaiPhong(tenLoaiPhong);

                        boolean shouldAdd = false;

                        // Lấy giá hiện tại và tính giá cho khoảng thời gian
                        try {
                            // Get current price for display
                            BigDecimal giaHienTai = roomPricingService.getCurrentPrice(idHangPhong);
                            dto.setGiaHienTai(giaHienTai);

                            // Calculate total price for the date range
                            BigDecimal totalPrice = roomPricingService.calculateTotalPriceForDateRange(idHangPhong,
                                    checkIn, checkOut);
                            dto.setTotalPrice(totalPrice);

                            // Calculate average price per night
                            BigDecimal averagePrice = roomPricingService.getAveragePricePerNight(idHangPhong, checkIn,
                                    checkOut);
                            dto.setAveragePrice(averagePrice);

                            // Get price segments for detailed breakdown
                            List<RoomPricingService.PriceSegment> priceSegments = roomPricingService
                                    .getPriceSegments(idHangPhong, checkIn, checkOut);
                            dto.setPriceSegments(new ArrayList<>(priceSegments));

                            System.out.println("Found price for room " + idHangPhong + ": current=" + giaHienTai
                                    + ", total=" + totalPrice);
                        } catch (Exception priceException) {
                            System.err.println(
                                    "Error getting price for room " + idHangPhong + ": " + priceException.getMessage());
                            priceException.printStackTrace();
                        }

                        if (dto.getGiaHienTai() != null) {
                            BigDecimal giaHienTai = dto.getGiaHienTai();

                            // Lọc theo khoảng giá nếu được chỉ định
                            if (minPrice != null && maxPrice != null) {
                                System.out.println("Filtering by price range: " + minPrice + " - " + maxPrice);
                                if (giaHienTai.compareTo(minPrice) >= 0 && giaHienTai.compareTo(maxPrice) <= 0) {
                                    shouldAdd = true;
                                    System.out.println(
                                            "Room " + idHangPhong + " price " + giaHienTai + " is within range");
                                } else {
                                    shouldAdd = false;
                                    System.out
                                            .println("Room " + idHangPhong + " price " + giaHienTai
                                                    + " is outside range");
                                }
                            } else {
                                shouldAdd = true;
                                System.out.println("No price filter applied");
                            }
                        } else {
                            System.out.println("No price found for room " + idHangPhong);
                            // Không có giá - chỉ thêm vào nếu không lọc theo giá
                            if (minPrice == null && maxPrice == null) {
                                shouldAdd = true;
                            } else {
                                shouldAdd = false; // Có filter giá nhưng phòng không có giá
                            }
                        }

                        if (shouldAdd) {
                            try {
                                enrichRoomDetails(dto, idHangPhong);
                                System.out.println(
                                        "After enrichment - DTO: " + dto.getMoTaKieuPhong() + ", "
                                                + dto.getSoLuongKhachO());
                                availableRooms.add(dto);
                                System.out.println("Successfully added room " + idHangPhong + " to results");
                            } catch (Exception e) {
                                System.err.println("Error processing room " + idHangPhong + ": " + e.getMessage());
                                e.printStackTrace();
                            }
                        }
                    }
                } catch (Exception rowException) {
                    System.err.println("Error processing row: " + rowException.getMessage());
                    rowException.printStackTrace();
                }
            }

            System.out.println("About to set response with " + availableRooms.size() + " rooms");

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setAvailableRoomsByHangPhongList(availableRooms);

            System.out.println("Final response size: " + availableRooms.size());
            if (!availableRooms.isEmpty()) {
                AvailableRoomsByHangPhongDTO firstRoom = availableRooms.get(0);
                System.out.println("First room details: " + firstRoom.getIdHangPhong() + ", " +
                        firstRoom.getTenKieuPhong() + ", " + firstRoom.getMoTaKieuPhong());
            }

            System.out.println("Response setup completed successfully");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tìm kiếm phòng: " + e.getMessage());
            e.printStackTrace(); // Debug: in ra stack trace
        }
        return response;
    }

    private void enrichRoomDetails(AvailableRoomsByHangPhongDTO dto, Integer idHangPhong) {
        try {
            System.out.println("Enriching details for room " + idHangPhong);

            // Lấy thông tin HangPhong với eager loading cho images
            Optional<HangPhong> hangPhongOpt = hangPhongRepository.findByIdWithImages(idHangPhong);
            if (hangPhongOpt.isPresent()) {
                HangPhong hangPhong = hangPhongOpt.get();
                System.out.println("Found HangPhong: " + hangPhong.getIdHangPhong());

                // Set basic info
                dto.setTenHangPhong("Hạng " + hangPhong.getIdHangPhong());

                // Set KieuPhong info
                if (hangPhong.getKieuPhong() != null) {
                    dto.setTenKieuPhong(hangPhong.getKieuPhong().getTenKp());
                    dto.setMoTaKieuPhong(hangPhong.getKieuPhong().getMoTa());
                    dto.setSoLuongKhachO(hangPhong.getKieuPhong().getSoLuongKhach());
                    System.out
                            .println("Set KieuPhong: " + dto.getTenKieuPhong() + ", Guests: " + dto.getSoLuongKhachO());
                }

                // Set LoaiPhong info
                if (hangPhong.getLoaiPhong() != null) {
                    dto.setTenLoaiPhong(hangPhong.getLoaiPhong().getTenLp());
                    dto.setMoTaLoaiPhong(hangPhong.getLoaiPhong().getMoTa());
                    System.out.println("Set LoaiPhong: " + dto.getTenLoaiPhong());
                }

                // Set images
                if (hangPhong.getDanhSachAnhHangPhong() != null && !hangPhong.getDanhSachAnhHangPhong().isEmpty()) {
                    List<String> imageUrls = new ArrayList<>();
                    for (AnhHangPhong anh : hangPhong.getDanhSachAnhHangPhong()) {
                        if (anh.getUrlAnh() != null) {
                            imageUrls.add(anh.getUrlAnh());
                        }
                    }
                    dto.setDanhSachAnhUrl(imageUrls);
                    System.out.println("Set " + imageUrls.size() + " images");
                }

                // Set amenities
                try {
                    List<TienNghi> tienNghiList = tienNghiRepository.findByHangPhong(hangPhong);
                    if (!tienNghiList.isEmpty()) {
                        List<TienNghiDTO> tienNghiDTOList = new ArrayList<>();
                        for (TienNghi tn : tienNghiList) {
                            TienNghiDTO tnDTO = new TienNghiDTO();
                            tnDTO.setIdTn(tn.getIdTn());
                            tnDTO.setTenTn(tn.getTenTn());
                            tnDTO.setIcon(tn.getIcon());
                            tienNghiDTOList.add(tnDTO);
                        }
                        dto.setDanhSachTienNghi(tienNghiDTOList);
                        System.out.println("Set " + tienNghiDTOList.size() + " amenities");
                    }
                } catch (Exception e) {
                    System.out.println("Skipping amenities due to database schema: " + e.getMessage());
                    // Continue without amenities
                }

                // Set promotions - temporarily disabled due to database schema mismatch
                try {
                    List<KhuyenMai> khuyenMaiList = khuyenMaiRepository.findActivePromotionsByHangPhong(idHangPhong,
                            LocalDate.now());
                    if (!khuyenMaiList.isEmpty()) {
                        List<KhuyenMaiDTO> khuyenMaiDTOList = new ArrayList<>();
                        for (KhuyenMai km : khuyenMaiList) {
                            KhuyenMaiDTO kmDTO = new KhuyenMaiDTO();
                            kmDTO.setIdKm(km.getIdKm());
                            kmDTO.setMoTaKm(km.getMoTaKm());
                            kmDTO.setNgayBatDau(km.getNgayBatDau());
                            kmDTO.setNgayKetThuc(km.getNgayKetThuc());
                            khuyenMaiDTOList.add(kmDTO);
                        }
                        dto.setDanhSachKhuyenMai(khuyenMaiDTOList);
                        System.out.println("Set " + khuyenMaiDTOList.size() + " promotions");
                    }
                } catch (Exception e) {
                    System.out.println("Skipping promotions due to database schema: " + e.getMessage());
                    // Continue without promotions
                }

                // Set current price
                try {
                    BigDecimal currentPrice = roomPricingService.getCurrentPrice(idHangPhong);
                    dto.setGiaHienTai(currentPrice);
                    System.out.println("Set current price: " + currentPrice);
                } catch (Exception e) {
                    System.out.println("Could not get current price for room " + idHangPhong + ": " + e.getMessage());
                    // Continue without price
                }

                System.out.println("Enrichment completed for room " + idHangPhong);
            } else {
                System.out.println("HangPhong not found for ID: " + idHangPhong);
            }
        } catch (Exception e) {
            System.err.println("Error enriching room details for " + idHangPhong + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Safely converts Object to Integer, handling both String and Integer types
     */
    private Integer convertToInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Integer) {
            return (Integer) value;
        }
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                System.err.println("Cannot convert string to integer: " + value);
                return null;
            }
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        System.err.println("Unexpected type for integer conversion: " + value.getClass().getName() + " = " + value);
        return null;
    }

    /**
     * Safely converts Object to BigDecimal, handling various numeric types
     */
    private BigDecimal convertToBigDecimal(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof String) {
            try {
                return new BigDecimal((String) value);
            } catch (NumberFormatException e) {
                System.err.println("Cannot convert string to BigDecimal: " + value);
                return null;
            }
        }
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        System.err.println("Unexpected type for BigDecimal conversion: " + value.getClass().getName() + " = " + value);
        return null;
    }

    @Override
    public Response getAvailableRoomsByHangPhongAndPriceRange(LocalDate checkIn, LocalDate checkOut,
            BigDecimal minPrice, BigDecimal maxPrice, String idKp, String idLp) {
        Response response = new Response();
        try {
            // Gọi stored procedure
            StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GetAvailableRoomsByHangPhong");
            query.registerStoredProcedureParameter("p_ngay_den", LocalDate.class, ParameterMode.IN);
            query.registerStoredProcedureParameter("p_ngay_di", LocalDate.class, ParameterMode.IN);

            query.setParameter("p_ngay_den", checkIn);
            query.setParameter("p_ngay_di", checkOut);

            System.out.println("=== CALLING STORED PROCEDURE WITH FILTERS ===");
            System.out.println("p_ngay_den: " + checkIn);
            System.out.println("p_ngay_di: " + checkOut);
            System.out.println("idKp filter: " + idKp);
            System.out.println("idLp filter: " + idLp);
            System.out.println("Price range: " + minPrice + " - " + maxPrice);
            System.out.println("==============================================");

            query.execute();

            @SuppressWarnings("unchecked")
            List<Object[]> results = query.getResultList();
            System.out.println("Stored procedure returned " + results.size() + " results");

            List<AvailableRoomsByHangPhongDTO> availableRooms = new ArrayList<>();

            for (Object[] result : results) {
                try {
                    if (result.length >= 5) {
                        // Correct mapping based on stored procedure result order:
                        // [0] = ID_HANG_PHONG (Integer)
                        // [1] = TEN_KIEU_PHONG (String)
                        // [2] = TEN_LOAI_PHONG (String)
                        // [3] = TONG_SO_PHONG (Long)
                        // [4] = SO_PHONG_TRONG (Long)
                        Integer idHangPhong = convertToInteger(result[0]);
                        String tenKieuPhong = (String) result[1];
                        String tenLoaiPhong = (String) result[2];
                        Integer tongSoPhong = convertToInteger(result[3]);
                        Integer soPhongTrong = convertToInteger(result[4]);

                        System.out.println("Processing room: ID=" + idHangPhong +
                                ", KieuPhong=" + tenKieuPhong +
                                ", LoaiPhong=" + tenLoaiPhong +
                                ", Available=" + soPhongTrong +
                                ", Total=" + tongSoPhong);

                        if (soPhongTrong > 0) {
                            // Apply filters BEFORE creating DTO
                            boolean passKieuPhongFilter = (idKp == null || idKp.isEmpty() ||
                                    (tenKieuPhong != null && tenKieuPhong.equalsIgnoreCase(idKp)));

                            boolean passLoaiPhongFilter = (idLp == null || idLp.isEmpty() ||
                                    (tenLoaiPhong != null && tenLoaiPhong.equalsIgnoreCase(idLp)));

                            System.out.println("Applying filters for room " + idHangPhong + ":");
                            System.out.println(
                                    "  - Filter idKp: '" + idKp + "', Room tenKieuPhong: '" + tenKieuPhong + "'");
                            System.out.println(
                                    "  - Filter idLp: '" + idLp + "', Room tenLoaiPhong: '" + tenLoaiPhong + "'");
                            System.out.println("  - KieuPhong filter pass: " + passKieuPhongFilter);
                            System.out.println("  - LoaiPhong filter pass: " + passLoaiPhongFilter);

                            if (passKieuPhongFilter && passLoaiPhongFilter) {
                                AvailableRoomsByHangPhongDTO dto = new AvailableRoomsByHangPhongDTO();
                                dto.setIdHangPhong(idHangPhong);
                                dto.setSoPhongTrong(soPhongTrong);
                                dto.setTongSoPhong(tongSoPhong);

                                // Set thông tin từ stored procedure
                                dto.setTenKieuPhong(tenKieuPhong);
                                dto.setTenLoaiPhong(tenLoaiPhong);

                                // Enrich additional details and apply price filter
                                enrichRoomDetails(dto, idHangPhong);

                                boolean passPriceFilter = true;
                                System.out.println("Price filter debug:");
                                System.out.println("  - dto.getGiaHienTai(): " + dto.getGiaHienTai());
                                System.out.println("  - minPrice: " + minPrice);
                                System.out.println("  - maxPrice: " + maxPrice);

                                if (dto.getGiaHienTai() != null && minPrice != null && maxPrice != null) {
                                    BigDecimal giaHienTaiValue = dto.getGiaHienTai();
                                    passPriceFilter = giaHienTaiValue.compareTo(minPrice) >= 0 &&
                                            giaHienTaiValue.compareTo(maxPrice) <= 0;
                                    System.out.println("  - Price comparison: " + giaHienTaiValue + " >= " + minPrice
                                            + " && " + giaHienTaiValue + " <= " + maxPrice + " = " + passPriceFilter);
                                } else if (minPrice != null || maxPrice != null) {
                                    passPriceFilter = false; // Has price filter but room has no price
                                    System.out.println("  - Room has no price but price filter is applied");
                                } else {
                                    System.out.println("  - No price filter applied");
                                }

                                System.out.println("Price filter pass: " + passPriceFilter);

                                if (passPriceFilter) {
                                    availableRooms.add(dto);
                                    System.out.println("Successfully added room " + idHangPhong + " to results");
                                } else {
                                    System.out.println("Room " + idHangPhong + " filtered out by price");
                                }
                            } else {
                                System.out.println("Room " + idHangPhong + " filtered out by room type/category");
                            }
                        }
                    }
                } catch (Exception rowException) {
                    System.err.println("Error processing row: " + rowException.getMessage());
                    rowException.printStackTrace();
                }
            }

            System.out.println("About to set response with " + availableRooms.size() + " rooms");

            response.setStatusCode(200);
            response.setMessage("Thành công");
            response.setAvailableRoomsByHangPhongList(availableRooms);

            System.out.println("Final response size: " + availableRooms.size());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi tìm kiếm phòng: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    @Override
    public Response getAvailableRoomsForStaff(LocalDate checkIn, LocalDate checkOut) {
        Response response = new Response();
        try {
            // Gọi stored procedure GetAvailableRoomsByHangPhong
            StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GetAvailableRoomsByHangPhong");
            query.registerStoredProcedureParameter("p_ngay_den", LocalDate.class, ParameterMode.IN);
            query.registerStoredProcedureParameter("p_ngay_di", LocalDate.class, ParameterMode.IN);

            query.setParameter("p_ngay_den", checkIn);
            query.setParameter("p_ngay_di", checkOut);

            System.out.println("=== CALLING STORED PROCEDURE FOR STAFF ===");
            System.out.println("p_ngay_den: " + checkIn);
            System.out.println("p_ngay_di: " + checkOut);
            System.out.println("==========================================");

            query.execute();

            @SuppressWarnings("unchecked")
            List<Object[]> results = query.getResultList();
            System.out.println("Stored procedure returned " + results.size() + " results for staff");

            List<AvailableRoomsByHangPhongDTO> availableRooms = new ArrayList<>();

            for (Object[] result : results) {
                try {
                    // Hỗ trợ cả 2 định dạng kết quả từ SP:
                    // 1) 7 cột: có SO_PHONG_CHIEM, SO_PHONG_KHONG_KHADUNG riêng
                    // 2) 5 cột: chỉ có SO_PHONG_TRONG (thông dụng hiện tại)
                    if (result.length >= 5) {
                        Integer idHangPhong = convertToInteger(result[0]);
                        String tenKieuPhong = (String) result[1];
                        String tenLoaiPhong = (String) result[2];
                        Integer tongSoPhong = convertToInteger(result[3]);

                        Integer soPhongChiem = null;
                        Integer soPhongKhongKhaDung = null;
                        Integer soPhongTrong;

                        if (result.length >= 7) {
                            // Định dạng đầy đủ
                            soPhongChiem = convertToInteger(result[4]);
                            soPhongKhongKhaDung = convertToInteger(result[5]);
                            soPhongTrong = convertToInteger(result[6]);
                        } else {
                            // Định dạng rút gọn: [4] là SO_PHONG_TRONG
                            soPhongTrong = convertToInteger(result[4]);
                        }

                        System.out.println("Processing room for staff: ID=" + idHangPhong +
                                ", KieuPhong=" + tenKieuPhong +
                                ", LoaiPhong=" + tenLoaiPhong +
                                ", Total=" + tongSoPhong +
                                ", Occupied=" + soPhongChiem +
                                ", Unavailable=" + soPhongKhongKhaDung +
                                ", Available=" + soPhongTrong);

                        // Chỉ thêm hạng phòng còn trống
                        if (soPhongTrong != null && soPhongTrong > 0) {
                            AvailableRoomsByHangPhongDTO dto;
                            if (soPhongChiem != null || soPhongKhongKhaDung != null) {
                                dto = new AvailableRoomsByHangPhongDTO(
                                        idHangPhong, tenKieuPhong, tenLoaiPhong,
                                        tongSoPhong, soPhongChiem, soPhongKhongKhaDung, soPhongTrong);
                            } else {
                                dto = new AvailableRoomsByHangPhongDTO(
                                        idHangPhong, tenKieuPhong, tenLoaiPhong,
                                        tongSoPhong, soPhongTrong);
                            }
                            availableRooms.add(dto);
                        }
                    } else {
                        System.out.println("Skipping result with insufficient columns: " + result.length);
                    }
                } catch (Exception e) {
                    System.err.println("Error processing result row for staff: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            response.setStatusCode(200);
            response.setMessage("Lấy danh sách phòng trống cho nhân viên thành công");
            response.setAvailableRoomsByHangPhongList(availableRooms);

        } catch (Exception e) {
            System.err.println("Error in getAvailableRoomsForStaff: " + e.getMessage());
            e.printStackTrace();
            response.setStatusCode(500);
            response.setMessage("Lỗi khi lấy danh sách phòng trống cho nhân viên: " + e.getMessage());
        }
        return response;
    }
}
